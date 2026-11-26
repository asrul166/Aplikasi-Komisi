/**
 * End-to-end API test. It wipes its database, so it only runs against one whose
 * name ends in `_test` (set TEST_DATABASE_URL to override).
 */
import 'dotenv/config';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

const base = new URL(process.env.DATABASE_URL!);
base.pathname = `${base.pathname}_test`;
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? base.toString();
assert.ok(new URL(process.env.DATABASE_URL).pathname.endsWith('_test'), 'refusing to wipe');

const { app } = await import('../src/app.js');
const { db } = await import('../src/db/index.js');
const { workspaces } = await import('../src/db/schema/index.js');
const { userService } = await import('../src/services/user.service.js');
const { sql } = await import('drizzle-orm');

let server: Server;
let url: string;
const PASSWORD = 'Rahasia123!';
const cookies: Record<string, string> = {};
const ids: Record<string, string> = {};

async function call(who: string | null, method: string, path: string, body?: unknown) {
  const form = body instanceof FormData;
  const res = await fetch(url + path, {
    method,
    headers: {
      Origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
      ...(body && !form ? { 'Content-Type': 'application/json' } : {}),
      ...(who ? { Cookie: cookies[who] } : {}),
    },
    body: form ? body : body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(10_000),
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, json, text, cookie: res.headers.getSetCookie() };
}

async function login(who: string, email: string, password = PASSWORD) {
  const res = await call(null, 'POST', '/api/auth/sign-in/email', { email, password });
  cookies[who] = res.cookie.map((c) => c.split(';')[0]).join('; ');
  return res;
}

const trx = (code: string, salesAgentId: string, unitPrice: number) => ({
  transactionCode: code,
  customerName: 'PT Uji',
  date: '2026-11-10',
  salesAgentId,
  productName: 'Produk Uji',
  quantity: 1,
  unitPrice,
});

before(async () => {
  await db.execute(sql`TRUNCATE TABLE workspaces, "user", verification CASCADE`);
  for (const [prefix, company] of [['', 'Utama'], ['other-', 'Lain']]) {
    const [ws] = await db.insert(workspaces).values({ name: company }).returning();
    for (const role of ['admin', 'manager', 'sales'] as const) {
      ids[prefix + role] = await userService.create(
        { name: `${prefix}${role}`, email: `${prefix}${role}@uji.test`, password: PASSWORD, role },
        ws.id
      );
    }
  }
  server = app.listen(0);
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  for (const who of ['admin', 'manager', 'sales', 'other-admin']) {
    assert.equal((await login(who, `${who}@uji.test`)).status, 200, `login ${who}`);
  }
});

after(() => {
  server.close();
  setImmediate(() => process.exit());
});

test('sign-in rejects a wrong password and public sign-up is disabled', async () => {
  assert.equal((await login('x', 'admin@uji.test', 'salah-sekali')).status, 401);
  const signUp = await call(null, 'POST', '/api/auth/sign-up/email', {
    name: 'x',
    email: 'x@uji.test',
    password: PASSWORD,
  });
  assert.notEqual(signUp.status, 200);
  assert.equal((await call(null, 'GET', '/api/transactions')).status, 401);
});

test('commission is computed on approval and removed on rejection', async () => {
  const created = await call('admin', 'POST', '/api/transactions', trx('A-1', ids.sales, 80));
  assert.equal(created.status, 201, created.text);
  assert.equal(created.json.status, 'pending');
  assert.equal(created.json.commissionAmount, null);
  ids.first = created.json.id;

  const status = (id: string, value: string) =>
    call('manager', 'PATCH', `/api/transactions/${id}/status`, { status: value });

  const noRule = await status(ids.first, 'success');
  assert.equal(noRule.status, 400, 'approval needs an active rule');
  assert.equal((await call('admin', 'GET', `/api/transactions/${ids.first}`)).json.status, 'pending');

  const rule = await call('admin', 'POST', '/api/commissions/rules', {
    name: 'Uji',
    type: 'tiered',
    flatRate: 0.03,
    tiers: [{ minVolume: 100, commissionRate: 0.01 }],
  });
  assert.equal(rule.status, 201, rule.text);
  ids.rule = rule.json.id;
  assert.equal(
    (await call('admin', 'POST', `/api/commissions/rules/${ids.rule}/activate`)).status,
    204
  );

  // 80 is below the tier: 3% only.
  assert.equal(Number((await status(ids.first, 'success')).json.commissionAmount), 2.4);

  // 80 + 50 reaches the tier: 3% + 1% on the new transaction only.
  const second = await call('admin', 'POST', '/api/transactions', trx('A-2', ids.sales, 50));
  assert.equal(Number((await status(second.json.id, 'success')).json.commissionAmount), 2);
  const first = await call('admin', 'GET', `/api/transactions/${ids.first}`);
  assert.equal(Number(first.json.commissionAmount), 2.4, 'earlier commission is not recalculated');

  const rejected = await status(second.json.id, 'cancelled');
  assert.equal(rejected.json.commissionAmount, null);
  const payouts = await db.execute(sql`SELECT status, amount FROM commission_payouts ORDER BY amount`);
  assert.deepEqual(
    payouts.rows.map((p: any) => p.status),
    ['cancelled', 'pending']
  );

  const summary = await call('admin', 'GET', '/api/dashboard/summary?month=2026-11');
  assert.equal(summary.json.totalSales, 80);
  assert.equal(summary.json.totalCommission, 2.4);

  const edit = await call('admin', 'PUT', `/api/transactions/${ids.first}`, trx('A-1', ids.sales, 9));
  assert.equal(edit.status, 409, 'approved transactions are locked');
  assert.equal(
    (await call('admin', 'DELETE', `/api/commissions/rules/${ids.rule}`)).status,
    409
  );
});

test('duplicate codes and invalid input are rejected', async () => {
  assert.equal((await call('admin', 'POST', '/api/transactions', trx('A-1', ids.sales, 1))).status, 409);
  assert.equal((await call('admin', 'POST', '/api/transactions', trx('A-9', ids.sales, -1))).status, 400);
  assert.equal(
    (await call('admin', 'POST', '/api/transactions', trx('A-9', ids['other-sales'], 1))).status,
    400,
    'agent from another workspace'
  );
});

test('roles and workspaces are isolated', async () => {
  const manager = await call('admin', 'POST', '/api/transactions', trx('M-1', ids.manager, 10));

  const own = await call('sales', 'GET', `/api/transactions?salesAgentId=${ids.manager}`);
  assert.ok(own.json.data.every((t: any) => t.salesAgentId === ids.sales));
  assert.equal((await call('sales', 'GET', `/api/transactions/${manager.json.id}`)).status, 404);
  assert.equal(
    (await call('sales', 'PATCH', `/api/transactions/${manager.json.id}/status`, { status: 'success' }))
      .status,
    403
  );
  assert.equal((await call('sales', 'GET', '/api/dashboard/team')).status, 403);
  assert.equal((await call('manager', 'DELETE', `/api/transactions/${ids.first}`)).status, 403);

  assert.equal((await call('other-admin', 'GET', `/api/transactions/${ids.first}`)).status, 404);
  assert.equal((await call('other-admin', 'DELETE', `/api/transactions/${ids.first}`)).status, 404);
  assert.equal(
    (await call('other-admin', 'POST', `/api/commissions/rules/${ids.rule}/activate`)).status,
    404
  );
  assert.equal(
    (await call('other-admin', 'PATCH', `/api/users/${ids.sales}`, { role: 'admin' })).status,
    404
  );
  assert.equal((await call('admin', 'GET', '/api/transactions/bukan-uuid')).status, 404);
});

test('CSV import inserts rows, applies commission and reports bad rows', async () => {
  const csv = [
    'ID_Transaksi,Tanggal,Nama_Sales,Nama_Produk,Qty,Harga_Satuan,Status_Transaksi',
    'C-1,2026-11-12,sales,Produk CSV,2,1.000.000,Sukses',
    'C-2,12/11/2026,sales@uji.test,Produk CSV,1,500000,Pending',
    'C-3,2026-11-12,tidak ada,Produk CSV,1,500000,Sukses',
    'A-1,2026-11-12,sales,Produk CSV,1,500000,Sukses',
  ].join('\n');
  const form = new FormData();
  form.append('file', new Blob([csv], { type: 'text/csv' }), 'data.csv');

  const uploaded = await call('admin', 'POST', '/api/csv/upload', form);
  assert.equal(uploaded.status, 201, uploaded.text);
  const path = `/api/csv/${uploaded.json.jobId}/import`;
  const body = { mapping: uploaded.json.mapping };

  assert.equal((await call('other-admin', 'POST', path, body)).status, 404);
  const result = await call('admin', 'POST', path, body);
  assert.equal(result.status, 200, result.text);
  assert.equal(result.json.imported, 2);
  assert.deepEqual(result.json.errors.map((e: any) => e.row), [4, 5]);
  assert.equal((await call('admin', 'POST', path, body)).status, 409, 'no double import');

  const list = await call('admin', 'GET', '/api/transactions?search=C-1');
  assert.equal(list.json.data[0].status, 'success');
  assert.equal(Number(list.json.data[0].commissionAmount), 80_000); // 3% + 1% of 2,000,000
});

test('new users can sign in; deactivated users are locked out', async () => {
  const created = await call('admin', 'POST', '/api/users', {
    name: 'Baru',
    email: 'baru@uji.test',
    password: PASSWORD,
    role: 'sales',
  });
  assert.equal(created.status, 201, created.text);
  assert.equal((await login('baru', 'baru@uji.test')).status, 200);
  assert.equal((await call('baru', 'GET', '/api/users/me')).json.role, 'sales');

  await call('admin', 'PATCH', `/api/users/${created.json.id}`, { isActive: false });
  assert.equal((await call('baru', 'GET', '/api/users/me')).status, 401);
  await login('baru', 'baru@uji.test');
  assert.equal((await call('baru', 'GET', '/api/users/me')).status, 403);

  const self = await call('admin', 'PATCH', `/api/users/${ids.admin}`, { isActive: false });
  assert.equal(self.status, 400);
});

test('profile update cannot change the role', async () => {
  const res = await call('sales', 'PATCH', '/api/users/me', { name: 'Nama Baru', role: 'admin' });
  assert.equal(res.status, 200, res.text);
  const me = await call('sales', 'GET', '/api/users/me');
  assert.equal(me.json.name, 'Nama Baru');
  assert.equal(me.json.role, 'sales');
});

test('a sales target shows up on the team page', async () => {
  const body = { userId: ids.sales, month: '2026-11', targetAmount: 5_000_000 };
  assert.equal((await call('manager', 'PUT', '/api/dashboard/goals', body)).status, 204);
  assert.equal((await call('sales', 'PUT', '/api/dashboard/goals', body)).status, 403);
  const team = await call('admin', 'GET', '/api/dashboard/team?month=2026-11');
  assert.equal(team.json.find((m: any) => m.id === ids.sales).target, 5_000_000);
});

test('changing the password replaces the old one', async () => {
  const next = 'PasswordBaru123!';
  const res = await call('manager', 'POST', '/api/auth/change-password', {
    currentPassword: PASSWORD,
    newPassword: next,
    revokeOtherSessions: true,
  });
  assert.equal(res.status, 200, res.text);
  assert.equal((await login('x', 'manager@uji.test')).status, 401);
  assert.equal((await login('x', 'manager@uji.test', next)).status, 200);
});

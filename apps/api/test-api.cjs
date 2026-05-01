const { Pool } = require('pg');

const BASE = 'http://localhost:3001';
let cookie = '';
let userId = '';
let workspaceId = '';

const R = []; // results
let pass = 0, fail = 0;

async function api(method, path, body, expect = 200) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'Referer': 'http://localhost:5173/',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    redirect: 'manual',
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch {}

  const ok = res.status === expect;
  const lbl = `${method} ${path.split('?')[0]}`;
  if (ok) { pass++; R.push(`  PASS  ${lbl} -> ${res.status}`); }
  else { fail++; R.push(`  FAIL  ${lbl} -> ${res.status} (expected ${expect}) ${text.substring(0,120)}`); }

  // capture cookies
  const sc = res.headers.getSetCookie?.() || [];
  if (sc.length > 0) {
    const m = new Map();
    if (cookie) for (const c of cookie.split('; ')) { const [k] = c.split('='); if(k) m.set(k.trim(), c); }
    for (const h of sc) { const p = h.split(';')[0].trim(); const [k] = p.split('='); if(k) m.set(k.trim(), p); }
    cookie = [...m.values()].join('; ');
  }
  return { status: res.status, json, ok };
}

async function main() {
  console.log('=== AutoComm API Test Suite ===\n');

  // 1. Health
  console.log('--- Health ---');
  await api('GET', '/health');

  // 2. Seed via DB FIRST (workspace + admin role)
  console.log('--- DB Seed ---');
  const pool = new Pool({ connectionString: 'postgresql://autocomm:autocomm_secret@localhost:5433/autocomm' });

  // Create workspace
  let wsRows = await pool.query('SELECT id FROM workspaces LIMIT 1');
  if (wsRows.rows.length > 0) {
    workspaceId = wsRows.rows[0].id;
  } else {
    wsRows = await pool.query(`INSERT INTO workspaces (name, max_seats) VALUES ('AutoComm HQ', 50) RETURNING id`);
    workspaceId = wsRows.rows[0].id;
  }
  console.log('  Workspace:', workspaceId);

  // 3. Auth - Sign up (may already exist)
  console.log('--- Auth ---');
  const email = 'admin@autocomm.test';
  const signup = await api('POST', '/api/auth/sign-up/email', {
    name: 'Test Admin', email, password: 'TestPassword123!'
  });
  // Accept both 200 (new user) and 422 (already exists) as success for setup
  if (signup.status === 422) {
    // Fix the fail count since this is expected on re-runs
    fail--; pass++;
    R[R.length - 1] = `  PASS  POST /api/auth/sign-up/email -> 422 (user exists, OK)`;
  }
  if (signup.json?.user?.id) userId = signup.json.user.id;

  // Set user role to admin and assign workspace BEFORE signing in
  if (!userId) {
    const userRow = await pool.query('SELECT id FROM "user" WHERE email = $1', [email]);
    if (userRow.rows.length > 0) userId = userRow.rows[0].id;
  }
  if (userId) {
    await pool.query('UPDATE "user" SET workspace_id = $1, role = $2 WHERE id = $3', [workspaceId, 'admin', userId]);
    console.log('  User role set to admin, workspace assigned');
  }
  await pool.end();

  // Now sign in (with admin role already set)
  const signin = await api('POST', '/api/auth/sign-in/email', { email, password: 'TestPassword123!' });
  if (signin.json?.user?.id) {
    userId = signin.json.user.id;
    console.log('  Signed in:', userId, '- cookie:', cookie ? 'YES' : 'NO');
  }

  const sess = await api('GET', '/api/auth/get-session');
  if (sess.json?.user) console.log('  Session:', sess.json.user.email, '- role:', sess.json.user.role);

  // 4. Workspace routes
  console.log('--- Workspace ---');
  await api('GET', '/api/workspaces/current');
  await api('PUT', '/api/workspaces/current', { name: 'AutoComm Updated', maxSeats: 100 });
  await api('PUT', '/api/workspaces/ai-config', { aiEndpoint: 'https://ai.test/v1', anomalySensitivity: 0.9 });

  // 5. Dashboard
  console.log('--- Dashboard ---');
  const sum = await api('GET', '/api/dashboard/summary');
  console.log('  Summary:', JSON.stringify(sum.json));
  await api('GET', '/api/dashboard/commission-progress?period=weekly');
  await api('GET', '/api/dashboard/monthly-goal');
  await api('GET', '/api/dashboard/recent-transactions');

  // 6. Transactions
  console.log('--- Transactions ---');
  const tx1 = await api('POST', '/api/transactions', {
    transactionCode: `TXN-${Date.now()}-A`, customerName: 'Acme Corp',
    date: '2026-04-01', quantity: 5, unitPrice: 25000, status: 'pending',
  }, 201);
  const txId = tx1.json?.id;
  if (txId) console.log('  Created TXN1:', txId);

  const tx2 = await api('POST', '/api/transactions', {
    transactionCode: `TXN-${Date.now()}-B`, customerName: 'Stellar Labs',
    date: '2026-04-02', quantity: 3, unitPrice: 50000, status: 'success',
  }, 201);
  const tx2Id = tx2.json?.id;
  if (tx2Id) console.log('  Created TXN2:', tx2Id);

  const list = await api('GET', '/api/transactions?page=1&limit=10');
  if (list.json?.data) console.log('  Listed:', list.json.data.length, 'of', list.json.pagination?.totalItems);

  const stats = await api('GET', '/api/transactions/stats');
  if (stats.json) console.log('  Stats: vol=$' + stats.json.totalVolume + ' count=' + stats.json.totalCount);

  if (txId) {
    await api('GET', `/api/transactions/${txId}`);
    const upd = await api('PUT', `/api/transactions/${txId}`, { customerName: 'Acme Updated', quantity: 10, unitPrice: 25000 });
    if (upd.json) console.log('  Updated:', upd.json.customerName, 'total=$' + upd.json.totalSales);
    await api('PATCH', `/api/transactions/${txId}/status`, { status: 'success' });
  }
  await api('GET', '/api/transactions?status=success&page=1&limit=5');
  await api('GET', '/api/transactions?search=Acme&page=1&limit=5');

  // 7. Commission Rules
  console.log('--- Commissions ---');
  const rule = await api('POST', '/api/commissions/rules', {
    name: 'Q2 Tiered Growth', description: 'Tiered plan with volume bonuses',
    type: 'tiered', flatRate: 0.03, status: 'operational',
  }, 201);
  const ruleId = rule.json?.id;
  if (ruleId) console.log('  Rule:', ruleId, rule.json?.ruleCode);

  const flat = await api('POST', '/api/commissions/rules', {
    name: 'Simple Flat 5%', type: 'flat', flatRate: 0.05, status: 'operational',
  }, 201);
  const flatId = flat.json?.id;

  const ruleList = await api('GET', '/api/commissions/rules?page=1&limit=10');
  if (ruleList.json?.data) console.log('  Rules:', ruleList.json.data.length);

  if (ruleId) {
    await api('GET', `/api/commissions/rules/${ruleId}`);
    await api('PUT', `/api/commissions/rules/${ruleId}`, { name: 'Q2 Tiered v2' });

    const t1 = await api('POST', `/api/commissions/rules/${ruleId}/tiers`,
      { tierOrder: 1, minVolume: 0, maxVolume: 100000, commissionRate: 0.003 }, 201);
    const tierId = t1.json?.id;
    console.log('  Tier1: $0-$100K @ 0.3%');

    await api('POST', `/api/commissions/rules/${ruleId}/tiers`,
      { tierOrder: 2, minVolume: 100001, maxVolume: 500000, commissionRate: 0.0015 }, 201);
    console.log('  Tier2: $100K-$500K @ 0.15%');

    await api('POST', `/api/commissions/rules/${ruleId}/tiers`,
      { tierOrder: 3, minVolume: 500001, maxVolume: null, commissionRate: 0.001 }, 201);
    console.log('  Tier3: $500K+ @ 0.10%');

    if (tierId) await api('PUT', `/api/commissions/tiers/${tierId}`, { commissionRate: 0.004 });

    // Simulate at different volumes
    const sim1 = await api('POST', '/api/commissions/calculate', { ruleId, totalSales: 50000, cumulativeSales: 75000 });
    if (sim1.json) console.log('  Sim @$75K: flat=$'+sim1.json.flatCommission+' tier=$'+sim1.json.tieredBonus+' total=$'+sim1.json.totalCommission);

    const sim2 = await api('POST', '/api/commissions/calculate', { ruleId, totalSales: 100000, cumulativeSales: 250000 });
    if (sim2.json) console.log('  Sim @$250K: flat=$'+sim2.json.flatCommission+' tier=$'+sim2.json.tieredBonus+' total=$'+sim2.json.totalCommission);

    const sim3 = await api('POST', '/api/commissions/calculate', { ruleId, totalSales: 200000, cumulativeSales: 750000 });
    if (sim3.json) console.log('  Sim @$750K: flat=$'+sim3.json.flatCommission+' tier=$'+sim3.json.tieredBonus+' total=$'+sim3.json.totalCommission);

    if (tierId) await api('DELETE', `/api/commissions/tiers/${tierId}`, null, 204);
  }
  await api('GET', '/api/commissions/payouts?page=1&limit=10');

  // 8. Users
  console.log('--- Users ---');
  const users = await api('GET', '/api/users?page=1&limit=10');
  if (users.json?.data) console.log('  Users:', users.json.data.length);

  const ustats = await api('GET', '/api/users/stats');
  if (ustats.json) console.log('  Stats: total=' + ustats.json.totalUsers + ' active=' + ustats.json.activeUsers + ' seats=' + ustats.json.maxSeats);

  if (userId) {
    const me = await api('GET', `/api/users/${userId}`);
    if (me.json) console.log('  Me:', me.json.name, '/', me.json.role);
  }

  const inv = await api('POST', '/api/users/invite',
    { name: 'Jane Sales', email: `jane-${Date.now()}@test.com`, role: 'sales' }, 201);
  const invId = inv.json?.id;
  if (invId) {
    console.log('  Invited:', invId);
    await api('PUT', `/api/users/${invId}`, { jobTitle: 'Senior Sales Rep' });
    await api('PATCH', `/api/users/${invId}/role`, { role: 'manager' });
    await api('PATCH', `/api/users/${invId}/status`, { isActive: false });
    await api('PATCH', `/api/users/${invId}/status`, { isActive: true });
  }

  // 9. Reporting
  console.log('--- Reporting ---');
  const rpt = await api('POST', '/api/reports/generate', { format: 'csv', detailLevel: 'standard' }, 201);
  const rptId = rpt.json?.id;
  if (rptId) console.log('  CSV Report:', rptId);

  const rpt2 = await api('POST', '/api/reports/generate', { format: 'pdf', detailLevel: 'comprehensive' }, 201);
  if (rpt2.json?.id) console.log('  PDF Report:', rpt2.json.id);

  const hist = await api('GET', '/api/reports/history?page=1&limit=10');
  if (hist.json?.data) console.log('  History:', hist.json.data.length, 'reports');

  if (rptId) await api('GET', `/api/reports/download/${rptId}`);

  const sched = await api('POST', '/api/reports/schedules',
    { name: 'Weekly Commission', frequency: 'weekly', format: 'csv', detailLevel: 'standard' }, 201);
  const schedId = sched.json?.id;
  if (schedId) console.log('  Schedule:', schedId);

  const scheds = await api('GET', '/api/reports/schedules');
  if (Array.isArray(scheds.json)) console.log('  Schedules:', scheds.json.length);

  if (schedId) {
    await api('PUT', `/api/reports/schedules/${schedId}`, { name: 'Monthly Summary', frequency: 'monthly' });
    await api('DELETE', `/api/reports/schedules/${schedId}`, null, 204);
  }

  // 10. CSV
  console.log('--- CSV ---');
  await api('GET', '/api/csv/template');

  // 11. Audit
  console.log('--- Audit ---');
  await new Promise(r => setTimeout(r, 1000));
  const auditList = await api('GET', '/api/audit?page=1&limit=20');
  if (auditList.json?.data?.length > 0) {
    console.log('  Logs:', auditList.json.data.length, 'total:', auditList.json.pagination?.totalItems);
    for (const l of auditList.json.data.slice(0,5)) console.log('    - ' + l.action + ' (' + l.status + ')');
    const logId = auditList.json.data[0].id;
    await api('GET', `/api/audit/${logId}`);
  } else {
    console.log('  No audit logs yet');
  }

  // 12. AI Placeholders
  console.log('--- AI ---');
  const chat = await api('POST', '/api/ai/chat', { message: 'How are sales?' });
  if (chat.json) console.log('  Chat:', chat.json.response?.substring(0,60));
  await api('POST', '/api/ai/anomaly-detect', {});
  await api('POST', '/api/ai/csv-mapping', {});

  // 13. Auth protection (unauthenticated)
  console.log('--- Auth Protection (7 routes) ---');
  const saved = cookie; cookie = '';
  await api('GET', '/api/dashboard/summary', null, 401);
  await api('GET', '/api/transactions', null, 401);
  await api('POST', '/api/commissions/rules', { name: 'X', type: 'flat' }, 401);
  await api('GET', '/api/users', null, 401);
  await api('GET', '/api/audit', null, 401);
  await api('GET', '/api/csv/template', null, 401);
  await api('PUT', '/api/workspaces/current', { name: 'X' }, 401);
  cookie = saved;

  // 14. Edge cases
  console.log('--- Edge Cases ---');
  await api('GET', '/api/nonexistent', null, 404);
  await api('POST', '/api/transactions', { customerName: 'X' }, 400); // missing required fields

  // 15. Cleanup
  console.log('--- Cleanup ---');
  if (ruleId) { await api('DELETE', `/api/commissions/rules/${ruleId}`, null, 204); console.log('  Deleted rule'); }
  if (flatId) { await api('DELETE', `/api/commissions/rules/${flatId}`, null, 204); console.log('  Deleted flat rule'); }
  if (txId) { await api('DELETE', `/api/transactions/${txId}`, null, 204); console.log('  Deleted TXN1'); }
  if (tx2Id) { await api('DELETE', `/api/transactions/${tx2Id}`, null, 204); console.log('  Deleted TXN2'); }

  // Summary
  console.log('\n' + '='.repeat(55));
  for (const r of R) console.log(r);
  console.log('='.repeat(55));
  console.log(`  PASSED: ${pass}  |  FAILED: ${fail}  |  TOTAL: ${pass+fail}`);
  if (fail === 0) console.log('\n  ALL TESTS PASSED!\n');
  else console.log(`\n  ${fail} test(s) failed.\n`);
  console.log('='.repeat(55));
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });

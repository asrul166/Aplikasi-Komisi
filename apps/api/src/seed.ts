/**
 * Demo data. Run `npm run db:seed` on an empty database,
 * or `npm run db:seed -- --reset` to wipe all data first.
 */
import 'dotenv/config';
import { count, sql } from 'drizzle-orm';
import { db } from './db/index.js';
import { user, workspaces } from './db/schema/index.js';
import { currentMonth, monthRange, toDateString } from './lib/period.js';
import { commissionService } from './services/commission.service.js';
import { dashboardService } from './services/dashboard.service.js';
import { transactionService, type TxStatus } from './services/transaction.service.js';
import { userService } from './services/user.service.js';

const PASSWORD = process.env.SEED_PASSWORD ?? 'Komisia123!';

const people = [
  { name: 'Ayu Lestari', email: 'admin@komisia.test', role: 'admin', jobTitle: 'Finance' },
  { name: 'Budi Santoso', email: 'manager@komisia.test', role: 'manager', jobTitle: 'Supervisor Sales' },
  { name: 'Citra Dewi', email: 'sales@komisia.test', role: 'sales', jobTitle: 'Sales Executive' },
  { name: 'Dimas Pratama', email: 'dimas@komisia.test', role: 'sales', jobTitle: 'Sales Executive' },
  { name: 'Eka Putri', email: 'eka@komisia.test', role: 'sales', jobTitle: 'Sales Representative' },
] as const;

const catalog = [
  { productName: 'Laptop Kantor', productCategory: 'Elektronik', unitPrice: 12_500_000 },
  { productName: 'Printer Laser', productCategory: 'Elektronik', unitPrice: 3_750_000 },
  { productName: 'Lisensi Software', productCategory: 'Software', unitPrice: 4_800_000 },
  { productName: 'Paket Instalasi Jaringan', productCategory: 'Jasa', unitPrice: 18_000_000 },
  { productName: 'Kursi Ergonomis', productCategory: 'Furnitur', unitPrice: 2_150_000 },
];

const customers = [
  'PT Sumber Pangan',
  'CV Karya Utama',
  'PT Bumi Sejahtera',
  'Toko Makmur Jaya',
  'PT Lintas Niaga',
  'CV Sinar Abadi',
  'PT Cahaya Nusantara',
  'Koperasi Mitra Usaha',
];

async function seed() {
  if (process.argv.includes('--reset')) {
    await db.execute(sql`TRUNCATE TABLE workspaces, "user", verification CASCADE`);
  }
  const [existing] = await db.select({ count: count() }).from(user);
  if (existing.count > 0) {
    console.log('Database sudah berisi data. Gunakan --reset untuk mengisi ulang.');
    return;
  }

  const [workspace] = await db.insert(workspaces).values({ name: 'PT Maju Bersama' }).returning();

  const ids: string[] = [];
  for (const person of people) {
    ids.push(await userService.create({ ...person, password: PASSWORD }, workspace.id));
  }
  const agentIds = ids.slice(2);

  const rule = await commissionService.createRule(
    {
      name: 'Skema Reguler',
      description: 'Komisi dasar 3% ditambah bonus sesuai total penjualan bulanan.',
      type: 'tiered',
      flatRate: 0.03,
      tiers: [
        { minVolume: 100_000_000, commissionRate: 0.01 },
        { minVolume: 250_000_000, commissionRate: 0.02 },
      ],
    },
    workspace.id,
    ids[0]
  );
  await commissionService.activateRule(rule.id, workspace.id);

  const now = new Date();
  const previous = toDateString(new Date(now.getFullYear(), now.getMonth() - 1, 1)).slice(0, 7);
  let sequence = 1000;

  for (const month of [previous, currentMonth()]) {
    const isCurrent = month === currentMonth();
    const lastDay = isCurrent ? now.getDate() : monthRange(month).days;
    const total = 36;

    for (let i = 0; i < total; i++) {
      // Deterministic spread so every run produces the same demo data.
      const product = catalog[(i * 7) % catalog.length];
      const day = 1 + Math.floor((i * lastDay) / total);
      let status: TxStatus = i % 11 === 5 ? 'cancelled' : 'success';
      // Leave some of the latest sales waiting for approval.
      if (isCurrent && i >= total - 14 && i % 2 === 0) status = 'pending';

      await transactionService.create(
        {
          ...product,
          transactionCode: `TRX-${++sequence}`,
          customerName: customers[(i * 3) % customers.length],
          date: `${month}-${String(day).padStart(2, '0')}`,
          salesAgentId: agentIds[i % agentIds.length],
          quantity: 1 + ((i * 5) % 4),
        },
        workspace.id,
        status
      );
    }

    for (const [index, agentId] of agentIds.entries()) {
      await dashboardService.setGoal(workspace.id, agentId, month, 300_000_000 - index * 50_000_000);
    }
  }

  console.log(`Selesai. Akun demo (password: ${PASSWORD}):`);
  for (const p of people) console.log(`  ${p.role.padEnd(8)} ${p.email}`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed gagal:', err);
    process.exit(1);
  });

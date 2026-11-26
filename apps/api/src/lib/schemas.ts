import { z } from 'zod';

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(v);
  }, 'Tanggal tidak valid');

export const monthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Format bulan harus YYYY-MM');

export const transactionSchema = z
  .object({
    transactionCode: z.string().trim().max(50).optional(),
    customerName: z.string().trim().min(1, 'Wajib diisi').max(255),
    date: dateSchema,
    salesAgentId: z.string().min(1, 'Pilih sales'),
    productName: z.string().trim().min(1, 'Wajib diisi').max(255),
    productCategory: z.string().trim().max(255).optional(),
    quantity: z.number().int().positive().max(1_000_000),
    unitPrice: z.number().positive().max(1_000_000_000_000),
    notes: z.string().max(2000).optional(),
  })
  .refine((t) => t.quantity * t.unitPrice < 10_000_000_000_000, {
    message: 'Nilai transaksi terlalu besar',
    path: ['unitPrice'],
  });

// Capped at 50% so base rate + bonus can never exceed the full sale value.
const rate = z.number().min(0).max(0.5);

const ruleFields = {
  type: z.enum(['flat', 'tiered']),
  flatRate: rate,
  tiers: z
    .array(z.object({ minVolume: z.number().min(0), commissionRate: rate }))
    .max(10)
    .default([]),
};

export const ruleSchema = z.object({
  name: z.string().trim().min(1, 'Wajib diisi').max(255),
  description: z.string().max(2000).optional(),
  ...ruleFields,
});

export const simulateSchema = z.object({
  ...ruleFields,
  totalSales: z.number().positive(),
  cumulativeSales: z.number().min(0),
});

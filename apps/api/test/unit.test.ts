import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCommission } from '../src/lib/commission-engine.js';
import {
  autoMapColumns,
  parseAmount,
  parseCSV,
  parseDate,
  parseStatus,
} from '../src/lib/csv-parser.js';

const tiers = [
  { tierOrder: 1, minVolume: 100, maxVolume: null, commissionRate: 0.01 },
  { tierOrder: 2, minVolume: 250, maxVolume: null, commissionRate: 0.02 },
];

test('commission: base rate only below the first tier', () => {
  const r = calculateCommission({ totalSales: 50, cumulativeSales: 50, flatRate: 0.03, tiers });
  assert.equal(r.totalCommission, 1.5);
});

test('commission: highest reached tier wins', () => {
  const r = calculateCommission({ totalSales: 100, cumulativeSales: 250, flatRate: 0.03, tiers });
  assert.equal(r.flatCommission, 3);
  assert.equal(r.tieredBonus, 2);
  assert.equal(r.totalCommission, 5);
});

test('csv: headers map by exact alias only', () => {
  assert.deepEqual(autoMapColumns(['Tgl Trx', 'IDTrans', 'Harga_Satuan', 'Total_Penjualan', 'Paid']), {
    'Tgl Trx': 'date',
    IDTrans: 'transactionCode',
    Harga_Satuan: 'unitPrice',
  });
});

test('csv: quoted fields, semicolons and BOM', () => {
  const { headers, rows } = parseCSV('﻿a;b\n"x;1";"say ""hi"""\n');
  assert.deepEqual(headers, ['a', 'b']);
  assert.deepEqual(rows, [{ a: 'x;1', b: 'say "hi"' }]);
});

test('csv: amounts, dates and statuses', () => {
  for (const v of ['15000000', '15.000.000', '15,000,000', 'Rp 15.000.000']) {
    assert.equal(parseAmount(v), 15_000_000, v);
  }
  assert.equal(parseAmount('1.500,50'), 1500.5);
  assert.ok(Number.isNaN(parseAmount('abc')));
  assert.equal(parseDate('5/11/2026'), '2026-11-05');
  assert.equal(parseStatus('Sukses'), 'success');
  assert.equal(parseStatus('Batal'), 'cancelled');
  assert.equal(parseStatus('??'), null);
});

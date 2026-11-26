/** CSV helpers for the bulk transaction import. */

export const TARGET_COLUMNS = [
  'transactionCode',
  'date',
  'customerName',
  'salesAgentName',
  'productName',
  'productCategory',
  'quantity',
  'unitPrice',
  'status',
  'notes',
] as const;

export type TargetColumn = (typeof TARGET_COLUMNS)[number];

// Compared after lower-casing and removing everything that is not a letter or digit.
const ALIASES: Record<TargetColumn, string[]> = {
  transactionCode: ['idtransaksi', 'idtrans', 'trxid', 'transactionid', 'kodetransaksi', 'id'],
  date: ['tanggal', 'tgltrx', 'tgl', 'tanggaltransaksi', 'date', 'transactiondate'],
  customerName: ['namapelanggan', 'pelanggan', 'namacustomer', 'customer', 'customername'],
  salesAgentName: ['namasales', 'sales', 'agent', 'salesperson'],
  productName: ['namaproduk', 'produk', 'product', 'productname', 'item'],
  productCategory: ['kategoriproduk', 'kategori', 'category'],
  quantity: ['qty', 'jumlah', 'quantity'],
  unitPrice: ['hargasatuan', 'harga', 'price', 'unitprice'],
  status: ['statustransaksi', 'status'],
  notes: ['catatan', 'notes', 'remarks', 'keterangan'],
};

/** Map each source header to a target column; each target is used at most once. */
export function autoMapColumns(headers: string[]): Record<string, TargetColumn> {
  const mapping: Record<string, TargetColumn> = {};
  const used = new Set<TargetColumn>();
  for (const header of headers) {
    const key = header.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = TARGET_COLUMNS.find((t) => !used.has(t) && ALIASES[t].includes(key));
    if (target) {
      mapping[header] = target;
      used.add(target);
    }
  }
  return mapping;
}

/** Accepts comma, semicolon or tab delimiters and quoted fields. */
export function parseCSV(content: string) {
  const lines = content
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] as Record<string, string>[] };

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseLine(lines[0], delimiter);
  const rows: Record<string, string>[] = lines.slice(1).map((line) => {
    const values = parseLine(line, delimiter);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
  return { headers, rows };
}

/** Understands `15000000`, `15.000.000`, `15,000,000` and `Rp 1.500,50`. */
export function parseAmount(value: string): number {
  const text = value.replace(/rp|\s/gi, '');
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(text)) {
    return Number(text.replaceAll('.', '').replace(',', '.'));
  }
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(text)) return Number(text.replaceAll(',', ''));
  if (/^\d+([.,]\d+)?$/.test(text)) return Number(text.replace(',', '.'));
  return NaN;
}

/** Accepts `YYYY-MM-DD` and `DD/MM/YYYY`; returns the former. */
export function parseDate(value: string): string {
  const match = value.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!match) return value.trim();
  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function parseStatus(value: string): 'pending' | 'success' | 'cancelled' | null {
  const key = value.trim().toLowerCase();
  if (['', 'pending', 'menunggu'].includes(key)) return 'pending';
  if (['sukses', 'success', 'disetujui'].includes(key)) return 'success';
  if (['batal', 'cancelled', 'ditolak'].includes(key)) return 'cancelled';
  return null;
}

function detectDelimiter(line: string): string {
  const candidates = [',', ';', '\t'];
  const counts = candidates.map((c) => line.split(c).length);
  return candidates[counts.indexOf(Math.max(...counts))];
}

function parseLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

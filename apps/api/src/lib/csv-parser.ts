/**
 * CSV Parser utility for transaction bulk import.
 * Handles column detection, validation, and row-level error tracking.
 */

export interface CSVParseResult {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

export interface ColumnMapping {
  /** Source column name from the CSV */
  source: string;
  /** Target column in our schema */
  target: string;
  /** Confidence score (0-1) from AI mapping */
  confidence?: number;
}

/** Known target columns matching the PRD transaction structure */
export const TARGET_COLUMNS = [
  'transactionCode',
  'date',
  'salesAgentName',
  'productName',
  'productCategory',
  'quantity',
  'unitPrice',
  'totalSales',
  'commissionPercent',
  'status',
  'notes',
] as const;

/**
 * Parse CSV content into headers and rows.
 * Handles common delimiters (comma, semicolon, tab).
 */
export function parseCSV(content: string): CSVParseResult {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [], totalRows: 0 };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseLine(lines[0], delimiter);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i], delimiter);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return { headers, rows, totalRows: rows.length };
}

/**
 * Auto-detect column mapping using simple string similarity.
 * In a production system, this would call the AI Agent endpoint.
 */
export function autoMapColumns(sourceHeaders: string[]): ColumnMapping[] {
  const mappings: ColumnMapping[] = [];

  const knownAliases: Record<string, string[]> = {
    transactionCode: ['id_transaksi', 'idtrans', 'trx_id', 'transaction_id', 'id'],
    date: ['tanggal', 'tgl_trx', 'tgl', 'date', 'transaction_date'],
    salesAgentName: ['nama_sales', 'sales', 'agent', 'salesperson'],
    productName: ['nama_produk', 'produk', 'product', 'product_name', 'item'],
    productCategory: ['kategori_produk', 'kategori', 'category'],
    quantity: ['qty', 'jumlah', 'quantity', 'amount'],
    unitPrice: ['harga_satuan', 'harga', 'price', 'unit_price'],
    totalSales: ['total_penjualan', 'total', 'total_sales', 'gross'],
    commissionPercent: ['persentase_komisi', 'komisi_pct', 'commission_rate'],
    status: ['status_transaksi', 'status'],
    notes: ['catatan', 'notes', 'remarks', 'keterangan'],
  };

  for (const sourceHeader of sourceHeaders) {
    const normalized = sourceHeader.toLowerCase().replace(/[^a-z0-9]/g, '_');
    let bestMatch: string | null = null;
    let bestConfidence = 0;

    for (const [target, aliases] of Object.entries(knownAliases)) {
      for (const alias of aliases) {
        if (normalized === alias || normalized.includes(alias) || alias.includes(normalized)) {
          const confidence = normalized === alias ? 1.0 : 0.8;
          if (confidence > bestConfidence) {
            bestMatch = target;
            bestConfidence = confidence;
          }
        }
      }
    }

    if (bestMatch) {
      mappings.push({
        source: sourceHeader,
        target: bestMatch,
        confidence: bestConfidence,
      });
    }
  }

  return mappings;
}

function detectDelimiter(line: string): string {
  const counts: Record<string, number> = { ',': 0, ';': 0, '\t': 0 };
  for (const char of line) {
    if (char in counts) counts[char]++;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function parseLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
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

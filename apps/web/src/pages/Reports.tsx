import { useState } from 'react'
import { Button, PageHeader, State, Table } from '../components/ui'
import { downloadCsv, rupiah, STATUS_LABEL, today } from '../lib/format'
import type { Transaction } from '../lib/types'
import { useData } from '../lib/useData'

function recapByAgent(rows: Transaction[]) {
  const map = new Map<
    string,
    { id: string; name: string; count: number; sales: number; commission: number }
  >()
  for (const t of rows) {
    if (t.status !== 'success') continue
    const item = map.get(t.salesAgentId) ?? {
      id: t.salesAgentId,
      name: t.salesAgentName,
      count: 0,
      sales: 0,
      commission: 0,
    }
    item.count += 1
    item.sales += Number(t.totalSales)
    item.commission += Number(t.commissionAmount ?? 0)
    map.set(t.salesAgentId, item)
  }
  return [...map.values()].sort((a, b) => b.sales - a.sales)
}

export default function Reports() {
  const [dateFrom, setDateFrom] = useState(() => `${today().slice(0, 7)}-01`)
  const [dateTo, setDateTo] = useState(today)
  const valid = !!dateFrom && !!dateTo && dateFrom <= dateTo
  const { data, error, loading, reload } = useData<Transaction[]>(
    valid ? `/dashboard/report?dateFrom=${dateFrom}&dateTo=${dateTo}` : null,
  )

  const rows = valid && !loading && !error ? (data ?? []) : []
  const recap = recapByAgent(rows)
  const totals = recap.reduce(
    (sum, r) => ({
      count: sum.count + r.count,
      sales: sum.sales + r.sales,
      commission: sum.commission + r.commission,
    }),
    { count: 0, sales: 0, commission: 0 },
  )

  const exportRecap = () =>
    downloadCsv(`rekap-komisi_${dateFrom}_${dateTo}.csv`, [
      ['Sales', 'Transaksi disetujui', 'Total penjualan', 'Total komisi'],
      ...recap.map((r) => [r.name, r.count, r.sales, r.commission]),
    ])

  const exportDetail = () =>
    downloadCsv(`transaksi_${dateFrom}_${dateTo}.csv`, [
      [
        'ID transaksi',
        'Tanggal',
        'Pelanggan',
        'Sales',
        'Produk',
        'Jumlah',
        'Harga satuan',
        'Total',
        'Komisi',
        'Status',
      ],
      ...rows.map((t) => [
        t.transactionCode,
        t.date,
        t.customerName,
        t.salesAgentName,
        t.productName ?? '',
        t.quantity,
        Number(t.unitPrice),
        Number(t.totalSales),
        Number(t.commissionAmount ?? 0),
        STATUS_LABEL[t.status],
      ]),
    ])

  return (
    <>
      <PageHeader title="Laporan" description="Rekap komisi per sales untuk periode pilihan.">
        <Button icon="download" disabled={!rows.length} onClick={exportDetail}>
          Unduh detail
        </Button>
        <Button variant="primary" icon="download" disabled={!recap.length} onClick={exportRecap}>
          Unduh rekap
        </Button>
      </PageHeader>

      <section className="card">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <label className="flex items-center gap-2">
            Dari
            <input
              type="date"
              className="field w-44"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2">
            Sampai
            <input
              type="date"
              className="field w-44"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>
        </div>

        {!valid ? (
          <State empty emptyText="Pilih rentang tanggal yang benar" />
        ) : (
          <State
            loading={loading}
            error={error}
            onRetry={reload}
            empty={!loading && recap.length === 0}
            emptyText="Tidak ada transaksi disetujui pada periode ini"
          />
        )}

        {recap.length > 0 && (
          <Table head={['Sales', 'Transaksi', 'Total penjualan', 'Total komisi']}>
            {recap.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.name}</td>
                <td>{r.count}</td>
                <td className="tabular-nums">{rupiah(r.sales)}</td>
                <td className="tabular-nums">{rupiah(r.commission)}</td>
              </tr>
            ))}
            <tr className="bg-canvas font-bold">
              <td>Total</td>
              <td>{totals.count}</td>
              <td className="tabular-nums">{rupiah(totals.sales)}</td>
              <td className="tabular-nums">{rupiah(totals.commission)}</td>
            </tr>
          </Table>
        )}
      </section>
    </>
  )
}

import { useState } from 'react'
import { useToast } from '../components/toast'
import { Button, PageHeader, State, Table } from '../components/ui'
import { api } from '../lib/api'
import { rupiah, shortDate } from '../lib/format'
import type { Page, Transaction } from '../lib/types'
import { useData } from '../lib/useData'

export default function Approvals() {
  const notify = useToast()
  // Oldest first, so commission tiers build up in the order of the sales.
  const { data, error, loading, reload } = useData<Page<Transaction>>(
    '/transactions?status=pending&sort=date&order=asc&limit=100',
  )
  const [busy, setBusy] = useState<string>()

  async function decide(t: Transaction, status: 'success' | 'cancelled') {
    setBusy(t.id)
    try {
      const updated = await api.patch<Transaction>(`/transactions/${t.id}/status`, { status })
      notify(
        status === 'success'
          ? `${t.transactionCode} disetujui, komisi ${rupiah(updated.commissionAmount ?? 0)}`
          : `${t.transactionCode} ditolak`,
      )
    } catch (e) {
      notify((e as Error).message, 'error')
    }
    reload()
    setBusy(undefined)
  }

  return (
    <>
      <PageHeader
        title="Persetujuan"
        description="Komisi dihitung saat transaksi disetujui. Diurutkan dari yang terlama."
      />
      <section className="card">
        <State
          loading={loading && !data}
          error={error}
          onRetry={reload}
          empty={data?.data.length === 0}
          emptyText="Semua transaksi sudah ditinjau"
        />
        {!error && !!data?.data.length && (
          <>
            <p className="border-b border-line px-4 py-3 text-ink-soft">
              {data.pagination.totalItems} transaksi menunggu
            </p>
            <Table head={['Transaksi', 'Pelanggan', 'Sales', 'Nilai', '']}>
              {data.data.map((t) => (
                <tr key={t.id}>
                  <td className="whitespace-nowrap">
                    <span className="block font-mono text-xs">{t.transactionCode}</span>
                    <span className="text-xs text-ink-faint">{shortDate(t.date)}</span>
                  </td>
                  <td>
                    <span className="block font-medium">{t.customerName}</span>
                    <span className="text-xs text-ink-faint">
                      {t.quantity} × {t.productName}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">{t.salesAgentName}</td>
                  <td className="whitespace-nowrap font-semibold tabular-nums">
                    {rupiah(t.totalSales)}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="danger"
                        disabled={!!busy}
                        onClick={() => decide(t, 'cancelled')}
                      >
                        Tolak
                      </Button>
                      <Button
                        variant="primary"
                        icon="check"
                        busy={busy === t.id}
                        disabled={!!busy}
                        onClick={() => decide(t, 'success')}
                      >
                        Setujui
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </>
        )}
      </section>
    </>
  )
}

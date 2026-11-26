import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DailyChart } from '../components/DailyChart'
import { PageHeader, Progress, StatCard, State, StatusBadge, Table } from '../components/ui'
import { useUser } from '../lib/auth'
import { monthLabel, rupiah, shortDate, thisMonth } from '../lib/format'
import type { Summary } from '../lib/types'
import { useData } from '../lib/useData'

function targetMessage(data: Summary) {
  const remaining = data.target - data.totalSales
  if (remaining <= 0) return 'Target tercapai. Kerja bagus!'
  if (data.daysLeft === 0) return `Kurang ${rupiah(remaining)} dari target.`
  return `Kurang ${rupiah(remaining)}, sekitar ${rupiah(remaining / data.daysLeft)} per hari selama ${data.daysLeft} hari tersisa.`
}

export default function Dashboard() {
  const user = useUser()
  const [month, setMonth] = useState(thisMonth)
  const { data, error, loading, reload } = useData<Summary>(`/dashboard/summary?month=${month}`)
  const ratio = data && data.target > 0 ? data.totalSales / data.target : 0

  return (
    <>
      <PageHeader
        title="Ringkasan komisi"
        description={
          user.role === 'sales' ? 'Penjualan dan komisi Anda.' : 'Penjualan dan komisi seluruh tim.'
        }
      >
        <input
          aria-label="Periode"
          type="month"
          className="field w-48"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
        />
      </PageHeader>

      {!data || error ? (
        <div className="card">
          <State loading={loading} error={error} onRetry={reload} />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Penjualan disetujui"
              icon="payments"
              value={rupiah(data.totalSales)}
              note={`${data.approvedCount} transaksi · ${monthLabel(data.month)}`}
            />
            <StatCard
              label="Komisi terhitung"
              icon="percent"
              value={rupiah(data.totalCommission)}
              note="Dari transaksi disetujui"
            />
            <StatCard
              label="Menunggu persetujuan"
              icon="schedule"
              value={rupiah(data.pendingValue)}
              note={`${data.pendingCount} transaksi perlu ditinjau`}
            />
            <StatCard
              label="Capaian target"
              icon="flag"
              value={data.target > 0 ? `${Math.round(ratio * 100)}%` : '–'}
              note={data.target > 0 ? `Target ${rupiah(data.target)}` : 'Target belum diatur'}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2">
              <DailyChart month={data.month} days={data.daysInMonth} data={data.daily} />
            </div>
            <section className="card flex flex-col p-5">
              <h2 className="text-base font-bold">Target bulanan</h2>
              {data.target > 0 ? (
                <>
                  <p className="mt-4 text-3xl font-bold">{rupiah(data.totalSales)}</p>
                  <p className="mb-4 text-ink-soft">dari {rupiah(data.target)}</p>
                  <Progress value={data.totalSales} target={data.target} />
                  <p className="mt-auto pt-6 text-ink-soft">{targetMessage(data)}</p>
                </>
              ) : (
                <p className="mt-4 text-ink-soft">Belum ada target untuk periode ini.</p>
              )}
            </section>
          </div>

          <section className="card">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-base font-bold">Transaksi terbaru</h2>
              <Link to="/transaksi" className="font-semibold text-brand hover:underline">
                Semua transaksi →
              </Link>
            </div>
            <State empty={data.recent.length === 0} emptyText="Belum ada transaksi" />
            {data.recent.length > 0 && (
              <Table head={['Tanggal', 'Pelanggan', 'Sales', 'Nilai', 'Komisi', 'Status']}>
                {data.recent.map((t) => (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap text-ink-soft">{shortDate(t.date)}</td>
                    <td className="font-medium">{t.customerName}</td>
                    <td>{t.salesAgentName}</td>
                    <td className="whitespace-nowrap tabular-nums">{rupiah(t.totalSales)}</td>
                    <td className="whitespace-nowrap tabular-nums">
                      {t.commissionAmount ? rupiah(t.commissionAmount) : '–'}
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </section>
        </>
      )}
    </>
  )
}

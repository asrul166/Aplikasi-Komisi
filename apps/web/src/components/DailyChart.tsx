import { useState } from 'react'
import { compact, rupiah } from '../lib/format'

/** Single-series daily commission columns with a hover tooltip and a table view. */
export function DailyChart({
  month,
  days,
  data,
}: {
  month: string
  days: number
  data: { date: string; commission: number }[]
}) {
  const [hover, setHover] = useState<number | null>(null)
  const [asTable, setAsTable] = useState(false)

  const values = Array.from({ length: days }, (_, i) => {
    const date = `${month}-${String(i + 1).padStart(2, '0')}`
    return data.find((d) => d.date === date)?.commission ?? 0
  })
  const peak = Math.max(...values, 0)
  // Round the axis up to a clean step.
  const step = peak > 0 ? 10 ** Math.floor(Math.log10(peak)) / 2 : 1
  const max = peak > 0 ? Math.ceil(peak / step) * step : 1
  const total = values.reduce((a, b) => a + b, 0)
  const monthName = new Date(`${month}-01T00:00:00`).toLocaleDateString('id-ID', {
    month: 'short',
  })
  const hoverAt = hover === null ? 0 : ((hover + 0.5) / days) * 100

  return (
    <section className="card h-full p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">Komisi harian</h2>
          <p className="text-ink-soft">Total {rupiah(total)}</p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-brand hover:underline"
          onClick={() => setAsTable((v) => !v)}
        >
          {asTable ? 'Lihat grafik' : 'Lihat tabel'}
        </button>
      </div>

      {asTable ? (
        <div className="mt-4 h-60 overflow-y-auto">
          <table className="w-full text-left [&_td]:py-1.5 [&_th]:py-1.5">
            <thead>
              <tr className="text-xs text-ink-faint">
                <th>Tanggal</th>
                <th className="text-right">Komisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {values.map(
                (value, i) =>
                  value > 0 && (
                    <tr key={i}>
                      <td>
                        {i + 1} {monthName}
                      </td>
                      <td className="text-right tabular-nums">{rupiah(value)}</td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5 flex gap-2">
          <div className="flex h-52 flex-col justify-between text-right text-[11px] text-ink-faint">
            <span>{compact(max)}</span>
            <span>{compact(max / 2)}</span>
            <span>0</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="relative h-52" onMouseLeave={() => setHover(null)}>
              <div className="absolute inset-x-0 top-0 border-t border-line" />
              <div className="absolute inset-x-0 top-1/2 border-t border-line" />
              <div className="absolute inset-0 flex items-stretch gap-0.5 border-b border-line-strong">
                {values.map((value, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i + 1} ${monthName}: ${rupiah(value)}`}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    className={`flex h-full flex-1 flex-col items-center justify-end ${hover === i ? 'bg-brand-soft' : ''}`}
                  >
                    <span
                      className="block w-full max-w-6 rounded-t bg-brand"
                      style={{ height: `${(value / max) * 100}%` }}
                    />
                  </button>
                ))}
              </div>
              {hover !== null && (
                <div
                  className="card pointer-events-none absolute top-0 z-10 whitespace-nowrap px-3 py-2 text-xs shadow-lg"
                  style={{ left: `${hoverAt}%`, transform: `translateX(-${hoverAt}%)` }}
                >
                  <p className="text-ink-faint">
                    {hover + 1} {monthName}
                  </p>
                  <p className="font-bold">{rupiah(values[hover])}</p>
                </div>
              )}
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-ink-faint">
              <span>1 {monthName}</span>
              <span>{Math.ceil(days / 2)}</span>
              <span>
                {days} {monthName}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

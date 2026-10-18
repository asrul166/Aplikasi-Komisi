const transactions = [
  { date: '15 Okt 2026', id: 'TRX-10482', customer: 'PT Sumber Pangan', amount: 'Rp 42.500.000', commission: 'Rp 2.125.000', status: 'Disetujui' },
  { date: '14 Okt 2026', id: 'TRX-10479', customer: 'CV Karya Utama', amount: 'Rp 18.750.000', commission: 'Rp 937.500', status: 'Menunggu' },
  { date: '13 Okt 2026', id: 'TRX-10461', customer: 'PT Bumi Sejahtera', amount: 'Rp 95.000.000', commission: 'Rp 4.750.000', status: 'Disetujui' },
  { date: '12 Okt 2026', id: 'TRX-10452', customer: 'Toko Makmur Jaya', amount: 'Rp 5.400.000', commission: 'Rp 270.000', status: 'Menunggu' },
]

const weeklyCommissions = [
  { day: 'Sen', amount: '2,1 jt', height: '35%' },
  { day: 'Sel', amount: '4,4 jt', height: '68%' },
  { day: 'Rab', amount: '3,2 jt', height: '52%' },
  { day: 'Kam', amount: '6,8 jt', height: '92%' },
  { day: 'Jum', amount: '2,8 jt', height: '44%' },
  { day: 'Sab', amount: '5,1 jt', height: '76%' },
  { day: 'Min', amount: '4,0 jt', height: '62%' },
]

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-screen-2xl space-y-7 px-5 pb-10 pt-24 lg:px-8">
      <header className="flex flex-col justify-between gap-4 border-b border-[#d0d6cc] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#727c72]">Periode 1–31 Oktober 2026</p>
          <h2 className="text-2xl font-bold tracking-normal text-[#18231d]">Ringkasan komisi</h2>
          <p className="mt-1 text-sm text-[#536158]">Pantau penjualan, komisi, dan transaksi tim.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#536158]">
          <span className="h-2 w-2 rounded-full bg-[#39835f]" />
          Data diperbarui hari ini, 09.42 WIB
        </div>
      </header>

      <section aria-label="Ringkasan periode" className="grid grid-cols-1 divide-y divide-[#d0d6cc] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        <div className="py-4 sm:px-5 sm:py-2 sm:first:pl-0">
          <p className="text-sm text-[#536158]">Total penjualan</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[#18231d]">Rp 1.284.500.000</p>
          <p className="mt-1 text-xs text-[#536158]">124 transaksi bulan ini</p>
        </div>
        <div className="py-4 sm:px-5 sm:py-2">
          <p className="text-sm text-[#536158]">Komisi terhitung</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[#176b52]">Rp 38.535.000</p>
          <p className="mt-1 text-xs text-[#536158]">Dari skema komisi aktif</p>
        </div>
        <div className="py-4 sm:px-5 sm:py-2">
          <p className="text-sm text-[#536158]">Menunggu persetujuan</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[#a84626]">Rp 4.120.000</p>
          <p className="mt-1 text-xs text-[#536158]">8 transaksi perlu ditinjau</p>
        </div>
        <div className="py-4 sm:pl-5 sm:pr-0 sm:py-2">
          <p className="text-sm text-[#536158]">Pencapaian target</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-[#18231d]">75%</p>
          <p className="mt-1 text-xs text-[#536158]">Rp 215.000.000 menuju target</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 border-y border-[#d0d6cc] py-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-[#18231d]">Komisi mingguan</h3>
              <p className="mt-1 text-xs text-[#536158]">Pergerakan komisi yang tercatat minggu ini</p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-[#18231d]">Rp 28,4 jt</span>
          </div>
          <div className="grid h-48 grid-cols-7 items-end gap-3 border-b border-[#d0d6cc] px-1 sm:gap-5">
            {weeklyCommissions.map((item, index) => (
              <div key={item.day} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="text-[10px] tabular-nums text-[#536158]">{item.amount}</span>
                <div className={`w-full max-w-10 ${index === 3 ? 'bg-[#176b52]' : 'bg-[#bfd3c3]'}`} style={{ height: item.height }} />
                <span className="pb-2 text-[10px] font-medium text-[#536158]">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#d0d6cc] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#727c72]">Target tim</p>
          <div className="mt-5 flex items-baseline justify-between gap-3">
            <span className="text-sm text-[#536158]">Realisasi penjualan</span>
            <span className="text-sm font-semibold tabular-nums text-[#18231d]">Rp 785 jt</span>
          </div>
          <div className="mt-3 h-2 w-full bg-[#dce1d8]">
            <div className="h-full w-3/4 bg-[#176b52]" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-[#536158]">
            <span>75% tercapai</span>
            <span>Target Rp 1 M</span>
          </div>
          <div className="mt-6 border-l-2 border-[#b58b3a] pl-3">
            <p className="text-sm font-semibold text-[#18231d]">16 hari tersisa</p>
            <p className="mt-1 text-xs leading-5 text-[#536158]">Rata-rata Rp 13,4 jt per hari untuk mencapai target.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#18231d]">Transaksi terbaru</h3>
            <p className="mt-1 text-xs text-[#536158]">Aktivitas penjualan yang baru dicatat</p>
          </div>
          <button className="text-sm font-semibold text-[#176b52] hover:text-[#0f513f]" type="button">Semua transaksi <span aria-hidden="true">→</span></button>
        </div>
        <div className="overflow-x-auto border-y border-[#d0d6cc]">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#d0d6cc] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#727c72]">
                <th className="py-3 pr-4">Tanggal</th>
                <th className="py-3 pr-4">ID transaksi</th>
                <th className="py-3 pr-4">Pelanggan</th>
                <th className="py-3 pr-4 text-right">Nilai transaksi</th>
                <th className="py-3 pr-4 text-right">Komisi</th>
                <th className="py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e5dd]">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="text-sm hover:bg-white/70">
                  <td className="whitespace-nowrap py-4 pr-4 text-[#536158]">{transaction.date}</td>
                  <td className="whitespace-nowrap py-4 pr-4 font-mono text-xs text-[#536158]">{transaction.id}</td>
                  <td className="whitespace-nowrap py-4 pr-4 font-medium text-[#18231d]">{transaction.customer}</td>
                  <td className="whitespace-nowrap py-4 pr-4 text-right tabular-nums text-[#18231d]">{transaction.amount}</td>
                  <td className="whitespace-nowrap py-4 pr-4 text-right tabular-nums text-[#18231d]">{transaction.commission}</td>
                  <td className="whitespace-nowrap py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${transaction.status === 'Disetujui' ? 'text-[#286b49]' : 'text-[#98641f]'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${transaction.status === 'Disetujui' ? 'bg-[#39835f]' : 'bg-[#c28c37]'}`} />
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
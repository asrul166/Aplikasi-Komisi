const transactions = [
    { date: '15 Okt 2026', id: 'TRX-10482', customer: 'PT Sumber Pangan', amount: 'Rp 42.500.000', commission: 'Rp 2.125.000', status: 'Disetujui' },
    { date: '14 Okt 2026', id: 'TRX-10479', customer: 'CV Karya Utama', amount: 'Rp 18.750.000', commission: 'Rp 937.500', status: 'Menunggu' },
    { date: '13 Okt 2026', id: 'TRX-10461', customer: 'PT Bumi Sejahtera', amount: 'Rp 95.000.000', commission: 'Rp 4.750.000', status: 'Disetujui' },
    { date: '12 Okt 2026', id: 'TRX-10452', customer: 'Toko Makmur Jaya', amount: 'Rp 5.400.000', commission: 'Rp 270.000', status: 'Ditolak' },
    { date: '11 Okt 2026', id: 'TRX-10438', customer: 'PT Lintas Niaga', amount: 'Rp 55.000.000', commission: 'Rp 2.750.000', status: 'Disetujui' },
]

export default function Transactions() {
    return (
        <div className="mx-auto w-full max-w-screen-2xl px-5 pb-10 pt-24 lg:px-8">
            <header className="mb-7 flex flex-col justify-between gap-5 border-b border-[#d0d6cc] pb-5 lg:flex-row lg:items-end">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#727c72]">Operasional penjualan</p>
                    <h2 className="text-2xl font-bold text-[#18231d]">Transaksi</h2>
                    <p className="mt-1 text-sm text-[#536158]">Catatan penjualan dan komisi tim.</p>
                </div>
                <div className="flex gap-6 sm:gap-8">
                    <div>
                        <p className="text-xs text-[#727c72]">Nilai transaksi</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums text-[#18231d]">Rp 1.248.392.000</p>
                    </div>
                    <div className="border-l border-[#d0d6cc] pl-6 sm:pl-8">
                        <p className="text-xs text-[#727c72]">Rata-rata komisi</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums text-[#176b52]">4,2%</p>
                    </div>
                </div>
            </header>

            <section aria-label="Filter transaksi" className="mb-4 flex flex-col justify-between gap-3 border-b border-[#d0d6cc] pb-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                    <label className="sr-only" htmlFor="transaction-status">Status</label>
                    <select id="transaction-status" className="rounded-sm border border-[#c8d0c7] bg-white px-3 py-2 text-sm text-[#34443a] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]">
                        <option>Semua status</option>
                        <option>Disetujui</option>
                        <option>Menunggu</option>
                        <option>Ditolak</option>
                    </select>
                    <label className="sr-only" htmlFor="transaction-period">Periode</label>
                    <select id="transaction-period" className="rounded-sm border border-[#c8d0c7] bg-white px-3 py-2 text-sm text-[#34443a] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]">
                        <option>30 hari terakhir</option>
                        <option>90 hari terakhir</option>
                        <option>Tahun ini</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button className="rounded-sm border border-[#bfc9be] px-3 py-2 text-sm font-medium text-[#315744] transition-colors hover:bg-white" type="button">Impor CSV</button>
                    <button className="flex items-center gap-1.5 rounded-sm bg-[#176b52] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0f513f]" type="button">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Tambah transaksi
                    </button>
                </div>
            </section>

            <div className="overflow-x-auto border-y border-[#d0d6cc]">
                <table className="w-full min-w-[760px] border-collapse text-left">
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
                            <tr key={transaction.id} className="text-sm transition-colors hover:bg-white/70">
                                <td className="whitespace-nowrap py-4 pr-4 text-[#536158]">{transaction.date}</td>
                                <td className="whitespace-nowrap py-4 pr-4 font-mono text-xs text-[#536158]">{transaction.id}</td>
                                <td className="whitespace-nowrap py-4 pr-4 font-medium text-[#18231d]">{transaction.customer}</td>
                                <td className="whitespace-nowrap py-4 pr-4 text-right tabular-nums text-[#18231d]">{transaction.amount}</td>
                                <td className="whitespace-nowrap py-4 pr-4 text-right tabular-nums text-[#176b52]">{transaction.commission}</td>
                                <td className="whitespace-nowrap py-4 text-right">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${transaction.status === 'Disetujui' ? 'text-[#286b49]' : transaction.status === 'Menunggu' ? 'text-[#98641f]' : 'text-[#a63d2d]'}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${transaction.status === 'Disetujui' ? 'bg-[#39835f]' : transaction.status === 'Menunggu' ? 'bg-[#c28c37]' : 'bg-[#a63d2d]'}`} />
                                        {transaction.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-xs text-[#727c72]">Menampilkan {transactions.length} transaksi terbaru</p>
        </div>
    )
}
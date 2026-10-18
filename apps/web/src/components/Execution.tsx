const mockExecutions = [
    { id: 'ORD-99102X', time: '10:45:12 AM', symbol: 'NVDA', side: 'BUY', qty: 1500, price: '$880.00', status: 'FILLED' },
    { id: 'ORD-99103Y', time: '10:48:05 AM', symbol: 'TSLA', side: 'SELL', qty: 500, price: '$175.25', status: 'FILLED' },
    { id: 'ORD-99104Z', time: '11:02:33 AM', symbol: 'AAPL', side: 'BUY', qty: 2000, price: '$185.90', status: 'PARTIAL' },
    { id: 'ORD-99105A', time: '11:15:00 AM', symbol: 'MSFT', side: 'SELL', qty: 100, price: '$390.50', status: 'PENDING' },
    { id: 'ORD-99106B', time: '11:30:21 AM', symbol: 'AMZN', side: 'BUY', qty: 850, price: '$178.10', status: 'FILLED' },
];

export default function Execution() {
    return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-5 pb-10 pt-24 sm:px-6 lg:px-8">
    <div className="mb-6 flex flex-col justify-between gap-3 border-b border-[#d0d6cc] pb-5 sm:flex-row sm:items-end">
        <h2 className="text-2xl font-bold text-[#18231d]">Eksekusi pesanan</h2>
        <button className="flex items-center justify-center gap-2 self-start rounded-sm bg-[#176b52] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f513f] sm:self-auto">
            <span className="material-symbols-outlined text-sm">add</span>
            Pesanan baru
        </button>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] lg:gap-8">
        
        {/* Quick Trade Form */}
        <section className="h-fit border-y border-[#d0d6cc] py-5 lg:col-span-1 lg:border-y-0 lg:border-r lg:pr-6">
            <h3 className="mb-6 flex items-center gap-2 text-base font-semibold text-[#18231d]">
                <span className="material-symbols-outlined text-[#176b52]">speed</span>
                Pesanan cepat
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="pl-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">Simbol</label>
                    <input type="text" className="mt-1 w-full rounded-sm border border-[#c8d0c7] bg-white p-3 text-sm text-[#18231d] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" defaultValue="AAPL" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button className="rounded-sm border border-[#bfd3c3] bg-[#e5eee5] py-3 font-semibold text-[#286b49] transition-colors hover:bg-[#d9e6d8]">BELI</button>
                    <button className="rounded-sm border border-[#d0d6cc] bg-white py-3 font-semibold text-[#536158] transition-colors hover:border-[#a63d2d] hover:bg-[#f7d8d4] hover:text-[#a63d2d]">JUAL</button>
                </div>
                <div>
                    <label className="pl-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">Kuantitas</label>
                    <input type="number" className="mt-1 w-full rounded-sm border border-[#c8d0c7] bg-white p-3 text-sm text-[#18231d] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" defaultValue={100} />
                </div>
                <div>
                    <label className="pl-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">Jenis pesanan</label>
                    <select className="mt-1 w-full rounded-sm border border-[#c8d0c7] bg-white p-3 text-sm text-[#18231d] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]">
                        <option>Pasar</option>
                        <option>Batas</option>
                        <option>Stop</option>
                    </select>
                </div>
                <button className="mt-4 w-full rounded-sm bg-[#176b52] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f513f]">Kirim pesanan</button>
            </div>
        </section>

        {/* Executions Table */}
        <section className="min-w-0 overflow-hidden border-y border-[#d0d6cc] pb-4 lg:col-span-1">
            <div className="flex flex-col justify-between gap-2 border-b border-[#d0d6cc] py-4 sm:flex-row sm:items-center">
                <h3 className="text-base font-semibold text-[#18231d]">Pesanan hari ini</h3>
                <span className="text-xs font-medium text-[#536158]">Total volume: 4,95 rb saham</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-[#d0d6cc] text-[10px] font-semibold uppercase tracking-wider text-[#536158]">
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">ID pesanan</th>
                    <th className="px-4 py-3">Simbol</th>
                    <th className="px-4 py-3">Arah</th>
                    <th className="px-4 py-3 text-right">Jumlah</th>
                    <th className="px-4 py-3 text-right">Harga</th>
                    <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e5dd]">
                    {mockExecutions.map((exec) => (
                        <tr key={exec.id} className="text-sm transition-colors hover:bg-white/70 group">
                            <td className="whitespace-nowrap px-4 py-4 text-xs text-[#536158] tabular-nums">{exec.time}</td>
                            <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-[#536158]">{exec.id}</td>
                            <td className="px-4 py-4 font-semibold text-[#18231d]">{exec.symbol}</td>
                            <td className={`px-4 py-4 text-xs font-semibold ${exec.side === 'BUY' ? 'text-[#286b49]' : 'text-[#a63d2d]'}`}>{exec.side === 'BUY' ? 'BELI' : 'JUAL'}</td>
                            <td className="px-4 py-4 text-right tabular-nums">{exec.qty}</td>
                            <td className="px-4 py-4 text-right font-mono text-xs tabular-nums">{exec.price}</td>
                            <td className="whitespace-nowrap px-4 py-4">
                                <span className={`text-xs font-medium ${
                                    exec.status === 'FILLED' ? 'text-[#286b49]' : 
                                    exec.status === 'PARTIAL' ? 'text-[#98641f]' : 'text-[#536158]'
                                }`}>
                                    {exec.status === 'FILLED' ? 'Selesai' : exec.status === 'PARTIAL' ? 'Sebagian' : 'Menunggu'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </section>
      </div>
    </div>
  );
}

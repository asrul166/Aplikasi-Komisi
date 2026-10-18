const mockMarketData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '185.92', change: '+1.2%', changeType: 'positive', volume: '45.2M' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '390.27', change: '+0.8%', changeType: 'positive', volume: '18.1M' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '175.22', change: '-2.4%', changeType: 'negative', volume: '88.3M' },
  { symbol: 'NVDA', name: 'Nvidia Corp.', price: '880.08', change: '+3.5%', changeType: 'positive', volume: '62.7M' },
  { symbol: 'AMZN', name: 'Amazon.com', price: '178.15', change: '-0.3%', changeType: 'negative', volume: '32.4M' },
];

export default function MarketData() {
  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-5 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-[#d0d6cc] pb-5 sm:flex-row sm:items-end">
        <h2 className="text-2xl font-bold text-[#18231d]">Data pasar</h2>
        <div className="flex gap-2">
            <span className="flex items-center gap-2 border border-[#bfd3c3] bg-[#e5eee5] px-3 py-1.5 text-xs font-semibold text-[#286b49]">
                <span className="h-2 w-2 rounded-full bg-[#39835f]"></span>
                Pasar dibuka
            </span>
        </div>
      </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-b border-[#d0d6cc] bg-transparent px-2 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">S&P 500</p>
          <h3 className="font-mono text-xl font-semibold tabular-nums text-[#18231d]">5,123.41</h3>
          <p className="mt-1 text-xs font-semibold text-[#286b49]">+0.82%</p>
        </div>
        <div className="border-b border-[#d0d6cc] bg-transparent px-2 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">NASDAQ</p>
          <h3 className="font-mono text-xl font-semibold tabular-nums text-[#18231d]">16,248.52</h3>
          <p className="mt-1 text-xs font-semibold text-[#286b49]">+1.14%</p>
        </div>
        <div className="border-b border-[#d0d6cc] bg-transparent px-2 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">DOW JONES</p>
          <h3 className="font-mono text-xl font-semibold tabular-nums text-[#18231d]">38,905.66</h3>
          <p className="mt-1 text-xs font-semibold text-[#a63d2d]">-0.12%</p>
        </div>
        <div className="border-b border-[#d0d6cc] bg-transparent px-2 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">VIX</p>
          <h3 className="font-mono text-xl font-semibold tabular-nums text-[#18231d]">13.24</h3>
          <p className="mt-1 text-xs font-semibold text-[#a63d2d]">-4.05%</p>
        </div>
      </div>

        <section className="min-w-0 overflow-hidden border-y border-[#d0d6cc] pb-4">
        <div className="relative z-10 flex items-center justify-between py-5">
          <h3 className="text-base font-semibold text-[#18231d]">Daftar pantauan saham</h3>
        </div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
            <tr className="border-b border-[#d0d6cc] text-[10px] font-semibold uppercase tracking-wider text-[#536158]">
            <th className="px-4 py-3">Simbol</th>
            <th className="px-4 py-3">Nama perusahaan</th>
            <th className="px-4 py-3 text-right">Harga terakhir</th>
            <th className="px-4 py-3 text-right">Perubahan</th>
            <th className="px-4 py-3 text-right">Volume</th>
                </tr>
            </thead>
          <tbody className="divide-y divide-[#e1e5dd]">
                {mockMarketData.map((item) => (
              <tr key={item.symbol} className="text-sm transition-colors hover:bg-white/70">
                <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-[#176b52]">{item.symbol}</td>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-[#18231d]">{item.name}</td>
                <td className="whitespace-nowrap px-4 py-4 text-right font-mono text-xs tabular-nums text-[#18231d]">${item.price}</td>
                <td className={`whitespace-nowrap px-4 py-4 text-right text-xs font-semibold tabular-nums ${item.changeType === 'positive' ? 'text-[#286b49]' : 'text-[#a63d2d]'}`}>
                            {item.change}
                        </td>
                <td className="whitespace-nowrap px-4 py-4 text-right font-mono text-xs tabular-nums text-[#536158]">{item.volume}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </section>
    </div>
  );
}

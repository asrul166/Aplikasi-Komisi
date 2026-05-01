const mockMarketData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '185.92', change: '+1.2%', changeType: 'positive', volume: '45.2M' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '390.27', change: '+0.8%', changeType: 'positive', volume: '18.1M' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '175.22', change: '-2.4%', changeType: 'negative', volume: '88.3M' },
  { symbol: 'NVDA', name: 'Nvidia Corp.', price: '880.08', change: '+3.5%', changeType: 'positive', volume: '62.7M' },
  { symbol: 'AMZN', name: 'Amazon.com', price: '178.15', change: '-0.3%', changeType: 'negative', volume: '32.4M' },
];

export default function MarketData() {
  return (
    <div className="pt-24 px-8 pb-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-headline font-black text-on-surface">Market Data</h2>
        <div className="flex gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Markets Open
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-low p-5 rounded-2xl border border-secondary/10 hover:bg-surface-container transition-colors">
            <p className="text-outline text-xs font-bold uppercase tracking-wider mb-1">S&P 500</p>
            <h3 className="text-2xl font-bold text-on-surface">5,123.41</h3>
            <p className="text-emerald-400 text-xs font-bold mt-1">+0.82%</p>
        </div>
        <div className="bg-surface-container-low p-5 rounded-2xl border border-secondary/10 hover:bg-surface-container transition-colors">
            <p className="text-outline text-xs font-bold uppercase tracking-wider mb-1">NASDAQ</p>
            <h3 className="text-2xl font-bold text-on-surface">16,248.52</h3>
            <p className="text-emerald-400 text-xs font-bold mt-1">+1.14%</p>
        </div>
        <div className="bg-surface-container-low p-5 rounded-2xl border border-secondary/10 hover:bg-surface-container transition-colors">
            <p className="text-outline text-xs font-bold uppercase tracking-wider mb-1">DOW JONES</p>
            <h3 className="text-2xl font-bold text-on-surface">38,905.66</h3>
            <p className="text-error text-xs font-bold mt-1">-0.12%</p>
        </div>
        <div className="bg-surface-container-low p-5 rounded-2xl border border-secondary/10 hover:bg-surface-container transition-colors">
            <p className="text-outline text-xs font-bold uppercase tracking-wider mb-1">VIX</p>
            <h3 className="text-2xl font-bold text-on-surface">13.24</h3>
            <p className="text-error text-xs font-bold mt-1">-4.05%</p>
        </div>
      </div>

      <section className="bg-surface-container-low rounded-3xl overflow-hidden pb-4 relative group border border-secondary/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors duration-700"></div>
        <div className="p-8 flex justify-between items-center z-10 relative">
            <h3 className="text-xl font-headline font-bold">Watchlist Equities</h3>
        </div>
        <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-black/20 text-outline text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-4">Symbol</th>
                <th className="px-8 py-4">Company Name</th>
                <th className="px-8 py-4 text-right">Last Price</th>
                <th className="px-8 py-4 text-right">Change %</th>
                <th className="px-8 py-4 text-right">Volume</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
                {mockMarketData.map((item) => (
                    <tr key={item.symbol} className="hover:bg-surface-container-high transition-colors group">
                        <td className="px-8 py-6 font-bold text-sm text-primary">{item.symbol}</td>
                        <td className="px-8 py-6 font-medium text-sm text-on-surface">{item.name}</td>
                        <td className="px-8 py-6 text-right font-medium text-sm tabular-nums">${item.price}</td>
                        <td className={`px-8 py-6 text-right font-bold text-sm tabular-nums ${item.changeType === 'positive' ? 'text-emerald-400' : 'text-error'}`}>
                            {item.change}
                        </td>
                        <td className="px-8 py-6 text-right text-sm text-outline tabular-nums">{item.volume}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </section>
    </div>
  );
}

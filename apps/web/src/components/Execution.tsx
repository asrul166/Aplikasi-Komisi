const mockExecutions = [
  { id: 'ORD-99102X', time: '10:45:12 AM', symbol: 'NVDA', side: 'BUY', qty: 1500, price: '$880.00', status: 'FILLED' },
  { id: 'ORD-99103Y', time: '10:48:05 AM', symbol: 'TSLA', side: 'SELL', qty: 500, price: '$175.25', status: 'FILLED' },
  { id: 'ORD-99104Z', time: '11:02:33 AM', symbol: 'AAPL', side: 'BUY', qty: 2000, price: '$185.90', status: 'PARTIAL' },
  { id: 'ORD-99105A', time: '11:15:00 AM', symbol: 'MSFT', side: 'SELL', qty: 100, price: '$390.50', status: 'PENDING' },
  { id: 'ORD-99106B', time: '11:30:21 AM', symbol: 'AMZN', side: 'BUY', qty: 850, price: '$178.10', status: 'FILLED' },
];

export default function Execution() {
  return (
    <div className="pt-24 px-8 pb-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-headline font-black text-on-surface">Order Execution</h2>
        <button className="bg-primary text-on-primary-fixed px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_4px_14px_0_rgba(155,168,255,0.39)]">
            <span className="material-symbols-outlined text-sm">add</span>
            New Order
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Trade Form */}
        <div className="lg:col-span-1 bg-surface-container-low p-6 rounded-3xl h-fit border border-secondary/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">speed</span>
                Quick Trade
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] text-outline font-bold uppercase tracking-widest pl-2">Symbol</label>
                    <input type="text" className="w-full bg-surface-container-highest border-none rounded-xl p-3 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none mt-1" defaultValue="AAPL" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-emerald-500/20 text-emerald-400 font-bold py-3 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">BUY</button>
                    <button className="bg-surface-container-highest text-outline font-bold py-3 rounded-xl border border-outline-variant/30 hover:bg-error/20 hover:text-error hover:border-error/30 transition-colors">SELL</button>
                </div>
                <div>
                    <label className="text-[10px] text-outline font-bold uppercase tracking-widest pl-2">Quantity</label>
                    <input type="number" className="w-full bg-surface-container-highest border-none rounded-xl p-3 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none mt-1" defaultValue={100} />
                </div>
                <div>
                    <label className="text-[10px] text-outline font-bold uppercase tracking-widest pl-2">Order Type</label>
                    <select className="w-full bg-surface-container-highest border-none rounded-xl p-3 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none mt-1">
                        <option>Market</option>
                        <option>Limit</option>
                        <option>Stop</option>
                    </select>
                </div>
                <button className="w-full bg-primary text-on-primary-fixed py-4 rounded-xl font-bold mt-4 shadow-[0_4px_14px_0_rgba(155,168,255,0.39)] hover:shadow-[0_6px_20px_rgba(155,168,255,0.23)] hover:-translate-y-0.5 transition-all">Submit Order</button>
            </div>
        </div>

        {/* Executions Table */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-3xl overflow-hidden pb-4 border border-secondary/10">
            <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
                <h3 className="text-lg font-bold">Today's Executions</h3>
                <span className="text-xs text-outline font-medium">Group Vol: 4.95K Shares</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-black/20 text-outline text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Symbol</th>
                    <th className="px-6 py-4">Side</th>
                    <th className="px-6 py-4 text-right">Qty</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                    {mockExecutions.map((exec) => (
                        <tr key={exec.id} className="hover:bg-surface-container-high transition-colors group">
                            <td className="px-6 py-4 text-xs text-outline tabular-nums">{exec.time}</td>
                            <td className="px-6 py-4 text-xs font-mono text-secondary">{exec.id}</td>
                            <td className="px-6 py-4 font-bold text-sm text-on-surface">{exec.symbol}</td>
                            <td className={`px-6 py-4 text-xs font-bold ${exec.side === 'BUY' ? 'text-emerald-400' : 'text-error'}`}>{exec.side}</td>
                            <td className="px-6 py-4 text-right text-sm tabular-nums">{exec.qty}</td>
                            <td className="px-6 py-4 text-right font-medium text-sm tabular-nums">{exec.price}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                    exec.status === 'FILLED' ? 'bg-emerald-500/10 text-emerald-400' : 
                                    exec.status === 'PARTIAL' ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/20 text-outline'
                                }`}>
                                    {exec.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}

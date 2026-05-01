import { useState } from 'react';

export default function Transactions() {
    const [showAIChat, setShowAIChat] = useState(true);

    return (
        <div className="pt-28 p-8 max-w-7xl mx-auto w-full">
            {/* Page Title & Summary */}
            <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-manrope font-extrabold tracking-tight text-white">Transaction History</h2>
                    <p className="text-on-surface-variant mt-1">Real-time oversight of global commission flows.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-xs text-on-surface-variant font-manrope uppercase tracking-widest">Total Volume</p>
                        <p className="text-2xl font-manrope font-bold tabular-nums">$1,248,392.00</p>
                    </div>
                    <div className="w-px h-10 bg-outline-variant/30 self-center"></div>
                    <div className="text-right">
                        <p className="text-xs text-on-surface-variant font-manrope uppercase tracking-widest">Avg. Commission</p>
                        <p className="text-2xl font-manrope font-bold tabular-nums text-secondary">14.2%</p>
                    </div>
                </div>
            </div>

            {/* Toolbar Section */}
            <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select className="bg-surface-container-high border-none text-sm font-manrope text-white rounded-xl py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary appearance-none cursor-pointer">
                            <option>Status: All</option>
                            <option>Status: Success</option>
                            <option>Status: Pending</option>
                            <option>Status: Failed</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" style={{ fontVariationSettings: "'FILL' 1" }}>expand_more</span>
                    </div>
                    <div className="relative">
                        <select className="bg-surface-container-high border-none text-sm font-manrope text-white rounded-xl py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary appearance-none cursor-pointer">
                            <option>Last 30 Days</option>
                            <option>Last 90 Days</option>
                            <option>Year to Date</option>
                            <option>Custom Range</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                    </div>
                    <button className="p-2 rounded-xl bg-surface-container-high text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-variant transition-colors text-sm font-manrope font-semibold">
                        Import CSV
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-primary text-on-primary-container hover:bg-primary-fixed-dim transition-colors text-sm font-manrope font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">add</span>
                        Add Manual
                    </button>
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-surface-container-low rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-surface-container-lowest/40 text-on-surface-variant font-manrope text-xs font-bold uppercase tracking-widest">
                            <th className="px-6 py-5">Date</th>
                            <th className="px-6 py-5">Transaction ID</th>
                            <th className="px-6 py-5">Customer</th>
                            <th className="px-6 py-5 text-right">Amount</th>
                            <th className="px-6 py-5">Commission</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                        {/* Row 1 */}
                        <tr className="hover:bg-surface-container-high transition-colors group cursor-default">
                            <td className="px-6 py-6 text-sm tabular-nums text-slate-300">Oct 24, 2023</td>
                            <td className="px-6 py-6 font-manrope text-sm text-primary hover:underline cursor-pointer">#TXN-882910</td>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center">
                                        <span className="material-symbols-outlined text-tertiary">rocket_launch</span>
                                    </div>
                                    <span className="font-semibold text-white">Stellar Labs</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-right font-manrope font-medium tabular-nums text-white">$4,250.00</td>
                            <td className="px-6 py-6">
                                <span className="text-tertiary font-bold tabular-nums">+$637.50</span>
                            </td>
                            <td className="px-6 py-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                    Success
                                </span>
                            </td>
                            <td className="px-6 py-6 text-center">
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </td>
                        </tr>
                        {/* Row 2 */}
                        <tr className="hover:bg-surface-container-high transition-colors group cursor-default">
                            <td className="px-6 py-6 text-sm tabular-nums text-slate-300">Oct 23, 2023</td>
                            <td className="px-6 py-6 font-manrope text-sm text-primary hover:underline cursor-pointer">#TXN-882909</td>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center">
                                        <span className="material-symbols-outlined text-secondary">cloud</span>
                                    </div>
                                    <span className="font-semibold text-white">Nimbus Systems</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-right font-manrope font-medium tabular-nums text-white">$12,800.00</td>
                            <td className="px-6 py-6">
                                <span className="text-secondary font-bold tabular-nums">+$1,920.00</span>
                            </td>
                            <td className="px-6 py-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                    Pending
                                </span>
                            </td>
                            <td className="px-6 py-6 text-center">
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-surface-container-high transition-colors group cursor-default">
                            <td className="px-6 py-6 text-sm tabular-nums text-slate-300">Oct 23, 2023</td>
                            <td className="px-6 py-6 font-manrope text-sm text-primary hover:underline cursor-pointer">#TXN-882908</td>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">psychology</span>
                                    </div>
                                    <span className="font-semibold text-white">MindFlow AI</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-right font-manrope font-medium tabular-nums text-white">$2,100.00</td>
                            <td className="px-6 py-6">
                                <span className="text-tertiary font-bold tabular-nums">+$315.00</span>
                            </td>
                            <td className="px-6 py-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                    Success
                                </span>
                            </td>
                            <td className="px-6 py-6 text-center">
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </td>
                        </tr>
                        {/* Row 4 */}
                        <tr className="hover:bg-surface-container-high transition-colors group cursor-default">
                            <td className="px-6 py-6 text-sm tabular-nums text-slate-300">Oct 22, 2023</td>
                            <td className="px-6 py-6 font-manrope text-sm text-primary hover:underline cursor-pointer">#TXN-882907</td>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center">
                                        <span className="material-symbols-outlined text-error">bolt</span>
                                    </div>
                                    <span className="font-semibold text-white">Voltage Corp</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-right font-manrope font-medium tabular-nums text-white">$940.00</td>
                            <td className="px-6 py-6">
                                <span className="text-error-dim font-bold tabular-nums">$0.00</span>
                            </td>
                            <td className="px-6 py-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-error/10 text-error border border-error/20">
                                    Failed
                                </span>
                            </td>
                            <td className="px-6 py-6 text-center">
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </td>
                        </tr>
                        {/* Row 5 */}
                        <tr className="hover:bg-surface-container-high transition-colors group cursor-default">
                            <td className="px-6 py-6 text-sm tabular-nums text-slate-300">Oct 22, 2023</td>
                            <td className="px-6 py-6 font-manrope text-sm text-primary hover:underline cursor-pointer">#TXN-882906</td>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center">
                                        <span className="material-symbols-outlined text-tertiary">diamond</span>
                                    </div>
                                    <span className="font-semibold text-white">Luxe Dynamics</span>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-right font-manrope font-medium tabular-nums text-white">$55,000.00</td>
                            <td className="px-6 py-6">
                                <span className="text-tertiary font-bold tabular-nums">+$8,250.00</span>
                            </td>
                            <td className="px-6 py-6">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                    Success
                                </span>
                            </td>
                            <td className="px-6 py-6 text-center">
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                {/* Pagination Footer */}
                <div className="bg-surface-container-lowest/20 px-6 py-4 flex items-center justify-between">
                    <p className="text-sm text-on-surface-variant font-manrope">Showing <span className="text-white font-bold">1-5</span> of 482 transactions</p>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-outline-variant text-slate-400 hover:text-white hover:border-primary transition-all">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="w-10 h-10 rounded-lg bg-primary text-on-primary-container font-bold flex items-center justify-center">1</button>
                        <button className="w-10 h-10 rounded-lg border border-outline-variant text-slate-400 hover:text-white transition-all">2</button>
                        <button className="w-10 h-10 rounded-lg border border-outline-variant text-slate-400 hover:text-white transition-all">3</button>
                        <button className="p-2 rounded-lg border border-outline-variant text-slate-400 hover:text-white hover:border-primary transition-all">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating AI Chat Element */}
            {showAIChat && (
                <div className="fixed bottom-8 right-8 w-80 glass-panel rounded-2xl shadow-2xl p-4 animate-[float_4s_ease-in-out_infinite] z-50 bg-[#121b2f]/90">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-tertiary">AI Assistant</span>
                        </div>
                        <button onClick={() => setShowAIChat(false)} className="text-slate-400 hover:text-white">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <div className="bg-surface-variant/40 rounded-xl p-3 mb-4">
                        <p className="text-sm text-slate-300 leading-relaxed">
                            "I noticed a 15% drop in commissions from <span className="text-white font-bold">Nimbus Systems</span> this month. Would you like to view the comparison report?"
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 py-2 rounded-lg bg-surface-container-highest text-xs font-bold hover:bg-surface-bright transition-colors">View Report</button>
                        <button onClick={() => setShowAIChat(false)} className="flex-1 py-2 rounded-lg border border-tertiary/20 text-tertiary text-xs font-bold hover:bg-tertiary/10 transition-colors">Ignore</button>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    )
}

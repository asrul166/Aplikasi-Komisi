export default function CommissionSchema() {
    return (
        <>
            <section className="mt-20 p-8 overflow-y-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="headline-md text-on-surface tracking-tight mb-2">Commission Schema</h2>
                        <p className="text-outline max-w-lg">Manage institutional-grade commission structures and rule-based incentives for global desk operations.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-surface-container-highest border border-tertiary/20 hover:border-tertiary/50 text-tertiary px-6 py-3 rounded-2xl transition-all shadow-xl hover:translate-y-[-2px]">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        <span className="font-bold tracking-tight">+ New Commission Rule</span>
                    </button>
                </div>

                {/* Bento Grid - Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-[2rem] border border-outline-variant/10 flex flex-col justify-between h-48 group">
                        <div className="flex justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-3xl">account_balance</span>
                            </div>
                            <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full h-fit">TOP ACTIVE</span>
                        </div>
                        <div>
                            <p className="text-outline text-xs uppercase tracking-widest mb-1">Active Assets</p>
                            <h3 className="text-3xl font-manrope font-bold text-on-surface tabular-nums">$1.24B</h3>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-[2rem] border border-outline-variant/10 flex flex-col justify-between h-48 bg-gradient-to-br from-surface-container to-[#0f1930]">
                        <div className="flex justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-3xl">monitoring</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-outline text-xs uppercase tracking-widest mb-1">Avg. Payout Ratio</p>
                            <h3 className="text-3xl font-manrope font-bold text-on-surface tabular-nums">4.2% <span className="text-sm text-tertiary">+0.3%</span></h3>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-[2rem] border border-outline-variant/10 flex flex-col justify-between h-48 overflow-hidden relative">
                        <img className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" alt="abstract neural network visualization with glowing blue nodes and connecting lines on a dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaXDspEVQCzt61L6o5_A6O2e-_ZOjuEBFkt93PxQjm8gC2j7G5sS7a4ev4NYSYbEegvIymszt7At0JcZkrmfJqkCBYgD1BLGkdc-Rhk8k0ySJ2gn-B39TnUU2whWjOXTxRO8amxbDmLhkt_iGB1-DAuV_PiQjvDS6zULDTymOXzh-r06r_hreHT13VTqH8CN0CVeiLJdMnJ16vkiIKiuIpfMiX-EW-Y5_5yOxk53g1g-j_teLUtUXFmsC2GG5ngTyA1aMuBA7r_24W"/>
                        <div className="relative z-10 flex justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-3xl">smart_toy</span>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-outline text-xs uppercase tracking-widest mb-1">Rule Engine Status</p>
                            <h3 className="text-3xl font-manrope font-bold text-on-surface">Optimized</h3>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-surface-container-low rounded-[2rem] overflow-hidden border border-outline-variant/5">
                    <div className="px-8 py-6 flex justify-between items-center bg-surface-container-lowest/40 backdrop-blur-md">
                        <h3 className="font-manrope font-bold text-lg">Active Schema Registry</h3>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-surface-variant/40 rounded-lg text-outline transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
                            <button className="p-2 hover:bg-surface-variant/40 rounded-lg text-outline transition-colors"><span className="material-symbols-outlined">download</span></button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left min-w-[800px]">
                            <thead>
                                <tr className="bg-surface-container-lowest text-outline border-b border-outline-variant/5">
                                    <th className="px-8 py-5 font-manrope text-xs uppercase tracking-widest font-bold">Rule Name</th>
                                    <th className="px-8 py-5 font-manrope text-xs uppercase tracking-widest font-bold">Type</th>
                                    <th className="px-8 py-5 font-manrope text-xs uppercase tracking-widest font-bold">Value / Basis</th>
                                    <th className="px-8 py-5 font-manrope text-xs uppercase tracking-widest font-bold">Active Status</th>
                                    <th className="px-8 py-5 font-manrope text-xs uppercase tracking-widest font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/5">
                                {/* Row 1 */}
                                <tr className="hover:bg-surface-container-high/60 transition-colors group">
                                    <td className="px-8 py-6 border-b-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></div>
                                            <div>
                                                <div className="font-manrope font-bold text-on-surface">Flat Standard</div>
                                                <div className="text-xs text-outline">Global default across all desks</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-on-surface-variant text-sm font-medium border-b-0">Flat</td>
                                    <td className="px-8 py-6 text-on-surface font-manrope tabular-nums font-semibold border-b-0">1.25%</td>
                                    <td className="px-8 py-6 border-b-0">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[11px] font-bold uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                                            Operational
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right border-b-0">
                                        <button className="p-2 text-outline hover:text-white transition-colors"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
                                    </td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="hover:bg-surface-container-high/60 transition-colors group">
                                    <td className="px-8 py-6 border-b-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 rounded-full bg-secondary/40 group-hover:bg-secondary transition-all"></div>
                                            <div>
                                                <div className="font-manrope font-bold text-on-surface">Tiered High Performers</div>
                                                <div className="text-xs text-outline">Accelerated scale for $10M+ vol</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-on-surface-variant text-sm font-medium border-b-0">Tiered</td>
                                    <td className="px-8 py-6 text-on-surface font-manrope tabular-nums font-semibold border-b-0">2.5% — 5.0%</td>
                                    <td className="px-8 py-6 border-b-0">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[11px] font-bold uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                                            Operational
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right border-b-0">
                                        <button className="p-2 text-outline hover:text-white transition-colors"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
                                    </td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="hover:bg-surface-container-high/60 transition-colors group">
                                    <td className="px-8 py-6 border-b-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 rounded-full bg-outline-variant group-hover:bg-outline transition-all"></div>
                                            <div>
                                                <div className="font-manrope font-bold text-on-surface">Emerging Markets Pilot</div>
                                                <div className="text-xs text-outline">LatAm desk specific structure</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-on-surface-variant text-sm font-medium border-b-0">Tiered</td>
                                    <td className="px-8 py-6 text-on-surface font-manrope tabular-nums font-semibold border-b-0">1.0% — 3.5%</td>
                                    <td className="px-8 py-6 border-b-0">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-variant text-outline text-[11px] font-bold uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                                            Staging
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right border-b-0">
                                        <button className="p-2 text-outline hover:text-white transition-colors"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
                                    </td>
                                </tr>

                                {/* Row 4 */}
                                <tr className="hover:bg-surface-container-high/60 transition-colors group">
                                    <td className="px-8 py-6 border-b-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></div>
                                            <div>
                                                <div className="font-manrope font-bold text-on-surface">Institutional Managed</div>
                                                <div className="text-xs text-outline">Long-term portfolio management</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-on-surface-variant text-sm font-medium border-b-0">Flat</td>
                                    <td className="px-8 py-6 text-on-surface font-manrope tabular-nums font-semibold border-b-0">0.85%</td>
                                    <td className="px-8 py-6 border-b-0">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[11px] font-bold uppercase tracking-wider">
                                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                                            Operational
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right border-b-0">
                                        <button className="p-2 text-outline hover:text-white transition-colors"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-6 border-t border-outline-variant/5 flex justify-between items-center text-xs text-outline font-medium tracking-wide">
                        <span>Showing 4 of 12 registered rules</span>
                        <div className="flex gap-4">
                            <button className="hover:text-primary transition-colors">Previous Page</button>
                            <button className="hover:text-primary transition-colors">Next Page</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Chat Interface (Ethereal Floating Element) */}
            <div className="fixed bottom-10 right-10 w-80 z-50 group">
                <div className="glass-panel p-6 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-tertiary/20 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-tertiary to-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-on-surface text-sm">Rule Optimizer</h4>
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-tertiary"></span>
                                <span className="text-[10px] text-tertiary uppercase tracking-widest font-bold">Live Insight</span>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                        "Tiered High Performers" is currently under-payout by 12% compared to market benchmarks. Would you like to adjust the mid-tier threshold?
                    </p>
                    
                    <div className="flex gap-2">
                        <button className="flex-1 bg-surface-container-highest hover:bg-surface-bright py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors border border-outline-variant/20">Analyze</button>
                        <button className="flex-1 bg-primary text-on-primary-container py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-transform hover:scale-[1.05]">Adjust</button>
                    </div>

                    {/* Decorative glow behind */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl -z-10 cursor-pointer pointer-events-none"></div>
                </div>
            </div>
        </>
    )
}

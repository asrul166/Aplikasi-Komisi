export default function Reporting() {
    return (
        <div className="pt-28 p-8 space-y-10 max-w-7xl mx-auto pb-12 w-full">
            {/* Page Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Reports & Distribution</h1>
                    <p className="text-on-surface-variant max-w-lg">Preview, export, and automate your financial reporting infrastructure with neural-grade precision.</p>
                </div>
                <div className="flex gap-3">
                    <button className="glass-effect px-5 py-2.5 rounded-xl text-sm font-semibold text-primary flex items-center gap-2 hover:bg-[#192540] transition-all">
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Re-sync Data
                    </button>
                    <button className="bg-primary text-on-primary-container px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-sm">cloud_download</span>
                        Instant Export
                    </button>
                </div>
            </section>

            {/* Report Preview Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-surface-container-low rounded-[1.5rem] p-6 group hover:translate-y-[-4px] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                        </div>
                        <span className="text-xs font-medium text-tertiary px-2 py-1 rounded bg-tertiary/10">+12.4%</span>
                    </div>
                    <h3 className="text-lg font-bold text-on-surface mb-1">Monthly Payout Summary</h3>
                    <p className="text-sm text-outline-variant mb-6">Aggregated distribution metrics for Oct 2023.</p>
                    <div className="h-24 flex items-end gap-1.5">
                        <div className="flex-1 bg-primary/20 rounded-t-sm h-[40%] group-hover:bg-primary/40 transition-colors"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-sm h-[60%] group-hover:bg-primary/40 transition-colors"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-sm h-[45%] group-hover:bg-primary/40 transition-colors"></div>
                        <div className="flex-1 bg-primary rounded-t-sm h-[90%] group-hover:shadow-[0_0_15px_rgba(155,168,255,0.5)] transition-all"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-sm h-[55%] group-hover:bg-primary/40 transition-colors"></div>
                        <div className="flex-1 bg-primary/20 rounded-t-sm h-[70%] group-hover:bg-primary/40 transition-colors"></div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-surface-container-low rounded-[1.5rem] p-6 group hover:translate-y-[-4px] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                        </div>
                        <span className="text-xs font-medium text-outline-variant px-2 py-1 rounded bg-outline-variant/10">Stable</span>
                    </div>
                    <h3 className="text-lg font-bold text-on-surface mb-1">Regional Sales Performance</h3>
                    <p className="text-sm text-outline-variant mb-6">Global revenue split by operational node.</p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                <div className="bg-secondary h-full w-[75%] rounded-full"></div>
                            </div>
                            <span className="text-[10px] tabular-nums text-on-surface font-semibold w-8">75%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                <div className="bg-secondary/40 h-full w-[45%] rounded-full"></div>
                            </div>
                            <span className="text-[10px] tabular-nums text-on-surface font-semibold w-8">45%</span>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-surface-container-low rounded-[1.5rem] p-6 group hover:translate-y-[-4px] transition-transform border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-full bg-surface-variant flex items-center justify-center mb-4 group-hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-outline">add_chart</span>
                    </div>
                    <h3 className="text-on-surface font-bold">New Custom Insight</h3>
                    <p className="text-sm text-outline-variant mt-1">Design a new automated metric report</p>
                </div>
            </section>

            {/* Distribution & Export Panel */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Export Center */}
                <div className="lg:col-span-5 bg-surface-container rounded-[1.5rem] p-8 flex flex-col shadow-xl">
                    <h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">ios_share</span>
                        Export Center
                    </h2>
                    <div className="space-y-6 flex-1 flex flex-col">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-outline uppercase tracking-wider">File Format</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high border-2 border-primary text-on-surface">
                                    <span className="flex items-center gap-2 font-semibold">
                                        <span className="material-symbols-outlined text-error">picture_as_pdf</span>
                                        PDF
                                    </span>
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                </button>
                                <button className="flex items-center justify-between p-4 rounded-2xl bg-surface-variant text-outline hover:text-on-surface transition-colors">
                                    <span className="flex items-center gap-2 font-semibold">
                                        <span className="material-symbols-outlined text-tertiary">csv</span>
                                        CSV
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-outline uppercase tracking-wider">Detail Level</label>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-4 py-2 rounded-full bg-surface-container-highest text-sm text-on-surface cursor-pointer hover:bg-primary/20 transition-colors">Standard</span>
                                <span className="px-4 py-2 rounded-full border border-outline-variant text-sm text-outline cursor-pointer hover:text-on-surface transition-colors">Comprehensive</span>
                                <span className="px-4 py-2 rounded-full border border-outline-variant text-sm text-outline cursor-pointer hover:text-on-surface transition-colors">Audit-Ready</span>
                            </div>
                        </div>
                        <div className="mt-auto pt-8">
                            <button className="w-full bg-surface-bright border border-outline-variant/20 text-on-surface py-4 rounded-2xl font-bold hover:bg-[#1f2b49] transition-all flex items-center justify-center gap-3">
                                <span className="material-symbols-outlined">description</span>
                                Generate Preview Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Automated Distribution */}
                <div className="lg:col-span-7 bg-surface-container rounded-[1.5rem] p-8 glass-effect shadow-xl flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-xl font-bold font-headline flex items-center gap-3">
                                <span className="material-symbols-outlined text-secondary">schedule_send</span>
                                Automated Distribution
                            </h2>
                            <p className="text-sm text-outline-variant mt-1">Schedule recurring deliveries to stakeholders.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-tertiary uppercase">Active</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-outline-variant">RECIPIENTS</label>
                                <div className="bg-surface-variant p-3 rounded-xl flex flex-wrap gap-2 min-h-[48px]">
                                    <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                        Board Members
                                        <span className="material-symbols-outlined text-[12px] cursor-pointer">close</span>
                                    </span>
                                    <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                        Finance Ops
                                        <span className="material-symbols-outlined text-[12px] cursor-pointer">close</span>
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-outline-variant">FREQUENCY</label>
                                <select className="w-full bg-surface-variant border-none rounded-xl text-sm text-on-surface focus:ring-secondary">
                                    <option>Every Monday (08:00 UTC)</option>
                                    <option>Monthly (1st Business Day)</option>
                                    <option>Real-time (On Ledger Close)</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-outline-variant">DATA SLICE</label>
                                <select className="w-full bg-surface-variant border-none rounded-xl text-sm text-on-surface focus:ring-secondary">
                                    <option>Global Consolidation</option>
                                    <option>North America Only</option>
                                    <option>EU & APAC Corridors</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-outline-variant">EMAIL TEMPLATE</label>
                                <div className="flex items-center gap-3 p-3 bg-surface-variant rounded-xl border border-outline-variant/20">
                                    <span className="material-symbols-outlined text-outline">mark_email_read</span>
                                    <span className="text-sm">Institutional Executive...</span>
                                    <span className="material-symbols-outlined text-xs ml-auto text-outline">open_in_new</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button className="text-outline-variant font-bold text-sm hover:text-on-surface transition-colors">Discard Changes</button>
                        <button className="bg-secondary text-on-secondary-fixed font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(166,140,255,0.3)] transition-all">Save Schedule</button>
                    </div>
                </div>
            </section>

            {/* Export History Table */}
            <section className="bg-surface-container rounded-[2rem] overflow-hidden">
                <div className="px-8 py-6 flex justify-between items-center bg-surface-container-lowest">
                    <h2 className="text-lg font-bold font-headline">Export History</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs text-outline font-medium">
                            <span className="w-2 h-2 rounded-full bg-tertiary"></span> 148 Generated
                        </div>
                        <div className="flex items-center gap-2 text-xs text-outline font-medium">
                            <span className="w-2 h-2 rounded-full bg-error"></span> 2 Failed
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-lowest/50 text-outline-variant text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-8 py-4">Report Name</th>
                                <th className="px-8 py-4">Format</th>
                                <th className="px-8 py-4">Timestamp</th>
                                <th className="px-8 py-4">Recipients</th>
                                <th className="px-8 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            <tr className="hover:bg-surface-container-high transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">description</span>
                                        <span className="text-sm font-semibold text-on-surface">Monthly_Payout_Oct_23.pdf</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5"><span className="text-xs px-2 py-0.5 rounded bg-surface-variant text-on-surface">PDF</span></td>
                                <td className="px-8 py-5 text-sm text-outline tabular-nums">Oct 31, 2023 23:59</td>
                                <td className="px-8 py-5">
                                    <div className="flex -space-x-2">
                                        <img className="w-6 h-6 rounded-full border-2 border-surface-container object-cover" alt="Recipient" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj65BzZJ73MoDWWpux3UQFV-_1rRS9x32ww6O9rEfHZm0Er4s48tfxzkxgyMrck5_4UWiJvCkvNFSDEYcdu0HFdhw77_2IdNoYx-7xzN3ksRzQV8VnUFAguMNJKy5OOHitGP17ouezLMQ5n8DnP7Y9cgPsLtLq_O4flaMi_Z2Bt4p8f2xGd8l5p43z5GRh2nooW9AO1aMeDSvN4wUbRCbE-aRibSllCWD4uG1qtOXzAzIuMwPwl7J3y-iTAsnCuVvvXnGpKWrdkClK"/>
                                        <img className="w-6 h-6 rounded-full border-2 border-surface-container object-cover" alt="Recipient" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTVHCH6jaB7nbgUbZSvQo7UMUBOyEPe2lLOfrWLsBInNsvmi2ZquK_eBnA8XhRUpXma4UeRKNysEV_klKzzzVlgjXm17-bdTb2LX4RYfcXJDNu82N99QCbNLhzLU0cIMUNLvQdzdGSV-XEACtx80v78Z5YJ9sX8mxt-_IIxtkMPt-gPSIT8I_hGmgfgt0QZCYL2sPRH2iWJrF6e5LGTtlMftsCIn9IIsN5IN7f8LRimOg46KoO0ZZ3arnVleEZpKQejz0rDvGoMWbc"/>
                                        <div className="w-6 h-6 rounded-full border-2 border-surface-container bg-surface-variant flex items-center justify-center text-[8px] font-bold text-outline">+4</div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-tertiary">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Sent
                                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-surface-container-high transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">table_view</span>
                                        <span className="text-sm font-semibold text-on-surface">Global_Commission_Ledger.csv</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5"><span className="text-xs px-2 py-0.5 rounded bg-surface-variant text-on-surface">CSV</span></td>
                                <td className="px-8 py-5 text-sm text-outline tabular-nums">Oct 30, 2023 14:22</td>
                                <td className="px-8 py-5 text-xs text-outline italic">Manual Download</td>
                                <td className="px-8 py-5 text-right">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
                                        <span className="material-symbols-outlined text-sm">download_for_offline</span>
                                        Generated
                                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-surface-container-high transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">description</span>
                                        <span className="text-sm font-semibold text-on-surface">Weekly_Node_Performance_Q4.pdf</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5"><span className="text-xs px-2 py-0.5 rounded bg-surface-variant text-on-surface">PDF</span></td>
                                <td className="px-8 py-5 text-sm text-outline tabular-nums">Oct 28, 2023 09:00</td>
                                <td className="px-8 py-5"><span className="text-xs text-outline">Regional Managers</span></td>
                                <td className="px-8 py-5 text-right">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-error">
                                        <span className="material-symbols-outlined text-sm">error</span>
                                        Failed
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-6 flex justify-center border-t border-outline-variant/10">
                    <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View Full Archive</button>
                </div>
            </section>

            {/* Floating AI Chat Element */}
            <div className="fixed bottom-8 right-8 w-80 glass-effect rounded-2xl shadow-2xl p-4 animate-float z-50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-tertiary">AI Assistant</span>
                    </div>
                    <button className="text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
                <div className="bg-surface-variant/40 rounded-xl p-3 mb-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        "I've updated the distribution automation for the <span className="text-white font-bold">Q4 Audit</span> report. Would you like to review the scheduled recipients?"
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-surface-container-highest text-xs font-bold hover:bg-surface-bright transition-colors">Review</button>
                    <button className="flex-1 py-2 rounded-lg border border-tertiary/20 text-tertiary text-xs font-bold hover:bg-tertiary/10 transition-colors">Dismiss</button>
                </div>
            </div>            
        </div>
    )
}

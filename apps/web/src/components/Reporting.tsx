export default function Reporting() {
    return (
        <div className="mx-auto w-full max-w-screen-2xl space-y-7 px-5 pb-12 pt-24 sm:px-6 lg:px-8">
            {/* Page Header */}
            <section className="flex flex-col justify-between gap-4 border-b border-[#d0d6cc] pb-5 md:flex-row md:items-end">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-[#18231d]">Laporan dan distribusi</h1>
                    <p className="max-w-xl text-sm text-[#536158]">Tinjau, ekspor, dan jadwalkan laporan keuangan untuk tim Anda.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 rounded-sm border border-[#c8d0c7] bg-white px-4 py-2.5 text-sm font-medium text-[#315744] transition-colors hover:bg-[#fbfcf8]">
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Perbarui data
                    </button>
                    <button className="flex items-center gap-2 rounded-sm bg-[#176b52] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f513f]">
                        <span className="material-symbols-outlined text-sm">cloud_download</span>
                        Ekspor laporan
                    </button>
                </div>
            </section>

            {/* Report Preview Cards */}
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {/* Card 1 */}
                <div className="group border-b border-[#d0d6cc] py-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#d9e6d8] text-[#176b52]">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                        </div>
                        <span className="text-xs font-medium text-tertiary px-2 py-1 rounded bg-tertiary/10">+12.4%</span>
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-[#18231d]">Ringkasan komisi bulanan</h3>
                    <p className="mb-6 text-sm text-[#536158]">Rekapitulasi distribusi komisi untuk Oktober 2023.</p>
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
                <div className="group border-b border-[#d0d6cc] py-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#f4e2b8] text-[#80601d]">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                        </div>
                        <span className="text-xs font-medium text-outline-variant px-2 py-1 rounded bg-outline-variant/10">Stable</span>
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-[#18231d]">Kinerja penjualan wilayah</h3>
                    <p className="mb-6 text-sm text-[#536158]">Kontribusi pendapatan berdasarkan wilayah operasional.</p>
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
                <div className="group flex flex-col items-center justify-center border border-dashed border-[#c8d0c7] p-6 text-center">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-[#e9ece5]">
                        <span className="material-symbols-outlined text-[#536158]">add_chart</span>
                    </div>
                    <h3 className="font-semibold text-[#18231d]">Buat analisis baru</h3>
                    <p className="mt-1 text-sm text-[#536158]">Rancang metrik laporan otomatis</p>
                </div>
            </section>

            {/* Distribution & Export Panel */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Export Center */}
                <div className="flex flex-col border-y border-[#d0d6cc] bg-transparent p-5 sm:p-6 lg:col-span-5">
                    <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold text-[#18231d]">
                        <span className="material-symbols-outlined text-[#176b52]">ios_share</span>
                        Ekspor laporan
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
                <div className="flex flex-col border-y border-[#d0d6cc] bg-transparent p-5 sm:p-6 lg:col-span-7">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="flex items-center gap-3 text-lg font-semibold text-[#18231d]">
                                <span className="material-symbols-outlined text-secondary">schedule_send</span>
                                Distribusi otomatis
                            </h2>
                            <p className="mt-1 text-sm text-[#536158]">Jadwalkan pengiriman laporan berkala kepada tim terkait.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-semibold uppercase text-[#176b52]">Aktif</span>
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
            <section className="overflow-hidden border-y border-[#d0d6cc] bg-transparent">
                <div className="px-8 py-6 flex justify-between items-center bg-surface-container-lowest">
                    <h2 className="text-base font-semibold text-[#18231d]">Riwayat ekspor</h2>
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

        </div>
    )
}

interface TopNavBarProps {
    activeTab: string;
    onToggleMobileNav: () => void;
    onToggleAI: () => void;
}

export default function TopNavBar({ activeTab, onToggleMobileNav, onToggleAI }: TopNavBarProps) {
    const pageTitles: Record<string, string> = {
        dashboard: 'Ringkasan',
        transactions: 'Transaksi',
        reporting: 'Laporan',
        'new-rule': 'Aturan komisi',
        settings: 'Pengaturan',
        'market-data': 'Tim penjualan',
        execution: 'Persetujuan',
    }

    return (
        <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#dce1d8] bg-[#f3f4ef] px-3 sm:px-5 md:pl-64 md:pr-8">
            <div className="flex min-w-0 items-center gap-2 sm:gap-6">
                <button aria-label="Buka menu navigasi" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-[#315744] hover:bg-white md:hidden" onClick={onToggleMobileNav}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="truncate text-base font-semibold text-[#18231d]">{pageTitles[activeTab] ?? 'AutoComm'}</h1>
                <label className="relative hidden lg:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#727c72]">search</span>
                    <input aria-label="Cari" className="w-64 rounded-sm border border-[#d0d6cc] bg-white py-2 pl-10 pr-3 text-sm text-[#18231d] placeholder:text-[#727c72] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" placeholder="Cari transaksi atau sales" type="search" />
                </label>
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-4">
                <button onClick={onToggleAI} className="flex items-center gap-2 rounded-sm border border-[#c8d0c7] px-3 py-2 text-sm font-medium text-[#315744] transition-colors hover:bg-white" title="Buka asisten AI">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    <span className="hidden sm:inline">Asisten</span>
                </button>
                <button aria-label="Notifikasi" className="flex h-9 w-9 items-center justify-center rounded-sm text-[#536158] hover:bg-white hover:text-[#176b52]">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
                <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#dce8dd] text-xs font-bold text-[#315744] sm:flex">AF</span>
            </div>
        </header>
    )
}

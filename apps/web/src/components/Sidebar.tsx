interface SidebarProps {
    activeTab?: string
    isMobileOpen?: boolean
    onClose?: () => void
    onTabChange?: (tab: string) => void
}

export default function Sidebar({ activeTab = 'transactions', isMobileOpen = false, onClose, onTabChange }: SidebarProps) {
    const navItems = [
        { id: 'dashboard', icon: 'space_dashboard', label: 'Ringkasan' },
        { id: 'transactions', icon: 'receipt_long', label: 'Transaksi' },
        { id: 'reporting', icon: 'summarize', label: 'Laporan' },
        { id: 'market-data', icon: 'query_stats', label: 'Data pasar' },
        { id: 'execution', icon: 'task_alt', label: 'Persetujuan' },
    ];

    const handleNavigation = (tab: string) => {
        onTabChange?.(tab)
        onClose?.()
    }

    const content = (
        <>
            <button className="mb-10 flex items-center gap-3 px-3 text-left" onClick={() => handleNavigation('dashboard')}>
                <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#d9e6d8] text-[#173c2e]">
                    <span className="material-symbols-outlined">account_balance</span>
                </span>
                <span>
                    <span className="block text-lg font-bold leading-tight">AutoComm</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-[#b8cbbd]">Komisi & pembukuan</span>
                </span>
            </button>

            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a6bdae]">Ruang kerja</p>
            <nav aria-label="Navigasi utama" className="space-y-1">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-colors ${isActive ? 'bg-[#d9e6d8] font-semibold text-[#173c2e]' : 'text-[#d2dfd4] hover:bg-white/10 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            <div className="mt-auto border-t border-white/15 pt-4">
                <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-sm bg-[#d9e6d8] px-3 py-2.5 font-semibold text-[#173c2e] transition-colors hover:bg-white" onClick={() => handleNavigation('new-rule')}>
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Buat aturan komisi
                </button>
                <button className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-colors ${activeTab === 'settings' ? 'bg-white/15 text-white' : 'text-[#d2dfd4] hover:bg-white/10 hover:text-white'}`} onClick={() => handleNavigation('settings')}>
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    Pengaturan
                </button>
                <div className="mt-4 flex items-center gap-3 border-t border-white/15 px-3 pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b9cbbb] text-xs font-bold text-[#173c2e]">AF</span>
                    <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold">Admin Finance</span>
                        <span className="mt-0.5 block truncate text-[10px] text-[#b8cbbd]">Administrator</span>
                    </span>
                </div>
            </div>
        </>
    )

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-[#173c2e] px-4 py-6 text-sm text-white md:flex">
                {content}
            </aside>
            {isMobileOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <button aria-label="Tutup menu navigasi" className="absolute inset-0 h-full w-full bg-[#18231d]/40" onClick={onClose} />
                    <aside aria-label="Menu navigasi" aria-modal="true" className="relative flex h-full w-[min(18rem,calc(100%-3rem))] flex-col bg-[#173c2e] px-4 py-6 text-sm text-white shadow-xl" role="dialog">
                        <button aria-label="Tutup menu navigasi" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-sm text-[#d2dfd4] hover:bg-white/10 hover:text-white" onClick={onClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        {content}
                    </aside>
                </div>
            )}
        </>
    )
}

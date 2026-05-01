export default function Sidebar({ activeTab = 'transactions', onTabChange }: { activeTab?: string, onTabChange?: (tab: string) => void }) {
    const navItems = [
        { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
        { id: 'transactions', icon: 'receipt_long', label: 'Transactions' },
        { id: 'reporting', icon: 'assessment', label: 'Reporting', styleFill: true },
        { id: 'commissions', icon: 'payments', label: 'Commissions' },
        { id: 'analytics', icon: 'insights', label: 'Analytics' },
    ];

    return (
        <aside className="fixed left-4 top-4 bottom-4 w-64 rounded-3xl bg-[#091328] shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col py-8 z-50 tonal-stacking-no-borders font-manrope text-sm hidden md:flex">
            <div className="px-8 mb-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9ba8ff] to-[#4963ff] flex items-center justify-center cursor-pointer" onClick={() => onTabChange?.('dashboard')}>
                    <span className="material-symbols-outlined text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tighter text-[#9ba8ff]">AutoComm</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-outline">Institutional Grade</p>
                </div>
            </div>
            
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange && onTabChange(item.id)}
                            className={`w-full flex items-center gap-4 pl-4 py-3 transition-all duration-300 text-left ${
                                isActive 
                                    ? 'text-[#8999ff] border-l-2 border-[#9ba8ff] bg-gradient-to-r from-[#9ba8ff]/10 to-transparent font-bold' 
                                    : 'text-[#40485d] hover:text-[#9ba8ff] hover:bg-[#0f1930] hover:translate-y-[-2px] font-medium'
                            }`}
                        >
                            <span className="material-symbols-outlined" style={item.styleFill && isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                            <span className="font-manrope">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            <div className="px-4 mt-auto space-y-2">
                <button className="w-full py-4 bg-primary text-on-primary-container font-bold rounded-2xl flex items-center justify-center gap-2 mb-6 hover:scale-[1.02] transition-transform shadow-lg" onClick={() => onTabChange?.('new-rule')}>
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Rule
                </button>
                <a className="flex items-center gap-4 text-[#40485d] hover:text-[#9ba8ff] pl-4 transition-all py-2" href="#">
                    <span className="material-symbols-outlined">help_outline</span>
                    <span className="font-manrope text-sm">Support</span>
                </a>
                <button 
                    className={`w-full flex items-center gap-4 pl-4 transition-all py-2 text-left ${activeTab === 'settings' ? 'text-[#8999ff] border-l-2 border-[#9ba8ff] bg-gradient-to-r from-[#9ba8ff]/10 to-transparent font-bold' : 'text-[#40485d] hover:text-[#9ba8ff]'}`}
                    onClick={() => onTabChange?.('settings')}
                >
                    <span className="material-symbols-outlined" style={activeTab === 'settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
                    <span className="font-manrope text-sm">Settings</span>
                </button>
                <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center gap-3 pl-4">
                    <img alt="User Profile" className="w-10 h-10 rounded-full border border-primary/20 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-4r_rfGISpjAtRGHc0AprKthzS8aPmVtn-tbO_CRUJXFPVf1uYtCX9f1Crp91jYh274XxNvdhli3h6ExKXlK9aATMhj8lclk9SaJ3mGFj77wxnMRk3QlRQHJs108yyNJCCVKsBogW02ruZLZLGqbPrHw1hv5MMZwc7nw1BNaQA7G7KI7JC_6wMn6l1lmX2_lxoLamqMnrBFAms1r9r4ku7QOjla9xr12ED9V-SQZE1LXIUYpnKwpEMbokAqa7uaGrcxAnf6vWoVyi"/>
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-on-surface truncate">Marcus Thorne</p>
                        <p className="text-[10px] text-outline truncate">Managing Director</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

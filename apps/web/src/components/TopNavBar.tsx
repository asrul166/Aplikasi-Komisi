interface TopNavBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onToggleAI: () => void;
}

export default function TopNavBar({ activeTab, onTabChange, onToggleAI }: TopNavBarProps) {
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-[#060e20]/60 backdrop-blur-xl z-40 flex justify-between items-center md:pl-72 pr-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-8">
                <div className="relative hidden lg:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                    <input className="bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary w-64 transition-all" placeholder="Search analytics..." type="text"/>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <button 
                        onClick={() => onTabChange('market-data')}
                        className={`${activeTab === 'market-data' ? 'text-[#9ba8ff] font-bold border-b-2 border-[#9ba8ff] pb-1' : 'text-outline hover:text-white'} font-manrope text-sm font-semibold tracking-wide transition-all`}
                    >Market Data</button>
                    <button 
                        onClick={() => onTabChange('execution')}
                        className={`${activeTab === 'execution' ? 'text-[#9ba8ff] font-bold border-b-2 border-[#9ba8ff] pb-1' : 'text-outline hover:text-white'} font-manrope text-sm font-semibold tracking-wide transition-all`}
                    >Execution</button>
                    <button 
                        onClick={() => onTabChange('reporting')}
                        className={`${activeTab === 'reporting' ? 'text-[#9ba8ff] font-bold border-b-2 border-[#9ba8ff] pb-1' : 'text-outline hover:text-white'} font-manrope text-sm font-semibold tracking-wide transition-all`}
                    >Reporting</button>
                </nav>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={onToggleAI}
                    className="bg-surface-container-highest px-4 py-2 rounded-xl text-primary font-bold flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                    AI Assistant
                </button>
                <div className="flex items-center gap-2 px-2">
                    <button className="p-2 text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="p-2 text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                    </button>
                </div>
                <div className="h-10 w-10 rounded-full bg-surface-variant overflow-hidden flex items-center justify-center border border-outline-variant/30 hidden sm:flex">
                    <img alt="User Profile" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-4r_rfGISpjAtRGHc0AprKthzS8aPmVtn-tbO_CRUJXFPVf1uYtCX9f1Crp91jYh274XxNvdhli3h6ExKXlK9aATMhj8lclk9SaJ3mGFj77wxnMRk3QlRQHJs108yyNJCCVKsBogW02ruZLZLGqbPrHw1hv5MMZwc7nw1BNaQA7G7KI7JC_6wMn6l1lmX2_lxoLamqMnrBFAms1r9r4ku7QOjla9xr12ED9V-SQZE1LXIUYpnKwpEMbokAqa7uaGrcxAnf6vWoVyi"/>
                </div>
            </div>
        </header>
    )
}

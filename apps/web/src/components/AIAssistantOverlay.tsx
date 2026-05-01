interface AIAssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistantOverlay({ isOpen, onClose }: AIAssistantOverlayProps) {
  if (!isOpen) return null;

  return (
    <aside className="fixed right-6 bottom-6 w-[380px] h-[580px] pb-6 bg-[#192540]/60 backdrop-blur-[20px] rounded-[2.5rem] border border-tertiary/20 shadow-2xl z-50 flex flex-col p-6 overflow-hidden md:flex">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-tertiary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary">bolt</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface">AutoComm AI</h4>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] text-outline font-bold uppercase tracking-widest">Active Assistant</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
          <span className="material-symbols-outlined text-sm text-outline">close</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
        {/* System Message */}
        <div className="bg-surface-container-highest/40 p-4 rounded-2xl rounded-tl-none">
          <p className="text-xs leading-relaxed text-on-surface">
            Good afternoon, Alex. Based on current trends, you are on track to exceed your monthly goal by <span className="text-tertiary font-bold">12%</span>. Would you like me to analyze which leads have the highest conversion probability for your Elite Status qualification?
          </p>
        </div>
        
        {/* User Message */}
        <div className="bg-primary/20 p-4 rounded-2xl rounded-tr-none ml-8">
          <p className="text-xs leading-relaxed text-primary">Yes, show me the top 3 prospects for this week.</p>
        </div>
        
        {/* System Response Card */}
        <div className="bg-surface-container-highest/40 p-4 rounded-2xl rounded-tl-none space-y-3">
          <p className="text-xs font-bold text-tertiary">Top Conversion Probabilities:</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-black/20 p-2 rounded-xl">
              <span className="text-[10px]">Quantum Leap LLC</span>
              <span className="text-[10px] font-bold text-emerald-400">92%</span>
            </div>
            <div className="flex justify-between items-center bg-black/20 p-2 rounded-xl">
              <span className="text-[10px]">Stellar Logistics</span>
              <span className="text-[10px] font-bold text-emerald-400">85%</span>
            </div>
            <div className="flex justify-between items-center bg-black/20 p-2 rounded-xl">
              <span className="text-[10px]">Horizon Venture</span>
              <span className="text-[10px] font-bold text-primary">78%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 relative">
        <input 
          className="w-full bg-surface-container border-none rounded-2xl py-4 pl-4 pr-12 text-xs focus:ring-1 focus:ring-tertiary transition-all outline-none text-on-surface" 
          placeholder="Ask AI anything..." 
          type="text"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-tertiary text-on-tertiary-container rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </aside>
  )
}

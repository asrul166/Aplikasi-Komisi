export default function AnomalyDetection() {
    return (
        <div className="glass-card rounded-[2rem] p-8 border border-tertiary/20 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-tertiary">
                    <span className="material-symbols-outlined text-[20px]" data-icon="auto_awesome" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <h4 className="text-xs font-bold uppercase tracking-widest">Anomaly Detection</h4>
                </div>
                <span className="bg-error/20 text-error px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">ALERT</span>
            </div>
            
            <div className="bg-surface-container-lowest/50 p-4 rounded-2xl space-y-3">
                <p className="text-xs leading-relaxed text-on-surface/80">
                    Irregular commission spikes detected in <span className="text-primary font-bold">Account #8821</span>. Volume deviates <span className="text-error font-bold">4.2σ</span> from rolling average.
                </p>
                <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-surface-container-highest text-[10px] font-bold rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors">IGNORE</button>
                    <button className="flex-1 py-2 bg-primary/20 text-primary text-[10px] font-bold rounded-lg border border-primary/20 hover:bg-primary/30 transition-colors">INVESTIGATE</button>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Recent Intelligence</p>
                <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5"></div>
                    <p className="text-xs text-on-surface-variant">Market trend shift in APAC suggests 3% higher conversion next week.</p>
                </div>
                <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-outline-variant mt-1.5"></div>
                    <p className="text-xs text-on-surface-variant">Syncing with Execution Engine completed successfully at 04:00 UTC.</p>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-outline-variant/10">
                <button className="w-full flex items-center justify-between text-xs font-bold group">
                    <span>Auto-Tune Strategy</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
                </button>
            </div>
        </div>
    )
}

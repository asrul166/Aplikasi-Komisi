interface MetricCardProps {
    title: string;
    value: string;
    icon?: string;
    trendIcon: string;
    trendText: string;
    trendColor: string;
    extraClasses?: string;
}

export default function MetricCard({ 
    title, 
    value, 
    icon, 
    trendIcon, 
    trendText, 
    trendColor, 
    extraClasses = "bg-surface-container-low" 
}: MetricCardProps) {
    return (
        <div className={`${extraClasses} p-6 rounded-[2rem] relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300`}>
            {icon && (
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-6xl" data-icon={icon}>{icon}</span>
                </div>
            )}
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-2">{title}</p>
            <h3 className="text-4xl font-headline font-extrabold tabular-nums">{value}</h3>
            <div className={`mt-4 flex items-center gap-2 ${trendColor}`}>
                <span className="material-symbols-outlined text-sm" data-icon={trendIcon}>{trendIcon}</span>
                <span className="text-sm font-bold">{trendText}</span>
            </div>
        </div>
    )
}

export default function PerformanceChart() {
    return (
        <div className="bg-surface-container-low rounded-[2.5rem] p-8 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h4 className="text-xl font-headline font-bold">Performance Matrix</h4>
                    <p className="text-sm text-on-surface-variant">Team Sales vs. Commission Payouts (Q3)</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-xs font-bold opacity-70">Sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        <span className="text-xs font-bold opacity-70">Payouts</span>
                    </div>
                </div>
            </div>

            {/* Mock Chart Visualization */}
            <div className="flex-1 flex items-end justify-between gap-4 px-4">
                <Bar day="Mon" salesH="40%" payoutsH="15%" />
                <Bar day="Tue" salesH="65%" payoutsH="25%" />
                <Bar day="Wed" salesH="55%" payoutsH="22%" />
                <Bar day="Thu" salesH="90%" payoutsH="45%" />
                <Bar day="Fri" salesH="75%" payoutsH="35%" />
                <Bar day="Sat" salesH="30%" payoutsH="10%" />
                <Bar day="Sun" salesH="20%" payoutsH="05%" />
            </div>
        </div>
    )
}

function Bar({ day, salesH, payoutsH }: { day: string, salesH: string, payoutsH: string }) {
    return (
        <div className="flex-1 flex flex-col gap-2 items-center group">
            <div className="w-full flex items-end gap-1 h-48">
                <div className="bg-primary/20 hover:bg-primary w-full rounded-t-lg transition-all" style={{ height: salesH }}></div>
                <div className="bg-secondary/20 hover:bg-secondary w-full rounded-t-lg transition-all" style={{ height: payoutsH }}></div>
            </div>
            <span className="text-[10px] uppercase tracking-tighter opacity-40">{day}</span>
        </div>
    )
}

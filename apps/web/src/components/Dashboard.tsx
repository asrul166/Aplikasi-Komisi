

export default function Dashboard() {
  return (
    <>
      <div className="pt-24 px-8 pb-8 max-w-[1400px] mx-auto space-y-6">
        {/* Bento Grid Header: Personal performance overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-6 rounded-3xl relative overflow-hidden group hover:bg-surface-container transition-colors duration-500">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
            <p className="text-outline text-sm font-medium mb-1 uppercase tracking-widest">My Sales Volume</p>
            <h2 className="text-4xl font-headline font-black text-[#9ba8ff] tabular-nums">$1,284,500</h2>
            <div className="flex items-center gap-2 mt-4 text-emerald-400 text-xs font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              13.4% vs Last Month
            </div>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-3xl relative overflow-hidden group hover:bg-surface-container transition-colors duration-500">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all"></div>
            <p className="text-outline text-sm font-medium mb-1 uppercase tracking-widest">My Earned Commissions</p>
            <h2 className="text-4xl font-headline font-black text-on-surface tabular-nums">$38,535</h2>
            <div className="flex items-center gap-2 mt-4 text-emerald-400 text-xs font-bold">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Paid to Wallet
            </div>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-3xl relative overflow-hidden group hover:bg-surface-container transition-colors duration-500">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl group-hover:bg-tertiary/20 transition-all"></div>
            <p className="text-outline text-sm font-medium mb-1 uppercase tracking-widest">Pending Payouts</p>
            <h2 className="text-4xl font-headline font-black text-tertiary tabular-nums">$4,120</h2>
            <div className="flex items-center gap-2 mt-4 text-outline text-xs font-bold">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Processing (Est. 2 days)
            </div>
          </div>
        </section>

        {/* Trends & Goals Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Commission Progress Chart (Simulated) */}
          <div className="lg:col-span-8 bg-surface-container-low p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-headline font-bold">Commission Progress</h3>
              <div className="flex gap-2">
                <button className="bg-surface-container px-3 py-1 text-xs rounded-full border border-outline-variant/20">Daily</button>
                <button className="bg-primary text-on-primary-fixed px-3 py-1 text-xs rounded-full font-bold">Weekly</button>
              </div>
            </div>
            
            <div className="relative h-64 w-full flex items-end justify-between gap-4 px-4">
              {/* Simulated Bar Chart */}
              <div className="flex-1 bg-surface-container-highest/30 rounded-t-lg relative group h-[40%] hover:bg-primary/40 transition-all">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">$2.1k</div>
              </div>
              <div className="flex-1 bg-surface-container-highest/30 rounded-t-lg relative group h-[65%] hover:bg-primary/40 transition-all">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">$4.4k</div>
              </div>
              <div className="flex-1 bg-surface-container-highest/30 rounded-t-lg relative group h-[55%] hover:bg-primary/40 transition-all">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">$3.2k</div>
              </div>
              <div className="flex-1 bg-primary rounded-t-lg relative group h-[85%]">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">$6.8k</div>
              </div>
              <div className="flex-1 bg-surface-container-highest/30 rounded-t-lg relative group h-[45%] hover:bg-primary/40 transition-all">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">$2.8k</div>
              </div>
              <div className="flex-1 bg-surface-container-highest/30 rounded-t-lg relative group h-[70%] hover:bg-primary/40 transition-all">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">$5.1k</div>
              </div>
              <div className="flex-1 bg-surface-container-highest/30 rounded-t-lg relative group h-[60%] hover:bg-primary/40 transition-all">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">$4.0k</div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 px-4 text-outline text-[10px] font-bold uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Goals & Achievements Widget */}
          <div className="lg:col-span-4 bg-[#0f1930] p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-headline font-bold">Monthly Goal</h3>
                <span className="material-symbols-outlined text-secondary">trophy</span>
              </div>
              <div className="text-center py-6">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-secondary transition-all duration-1000" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.42" strokeDashoffset="91.1" strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-on-surface">75%</span>
                    <span className="text-[10px] text-outline font-bold uppercase">Progress</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Target Remaining</p>
                  <p className="text-xl font-bold">$215,000</p>
                </div>
                <p className="text-[10px] text-on-surface font-medium bg-secondary/20 px-2 py-1 rounded-md">8 Days Left</p>
              </div>
              <div className="bg-surface-container-highest p-4 rounded-2xl border border-secondary/10">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-secondary">military_tech</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Elite Club Status</p>
                    <p className="text-[10px] text-outline">Close $50k more to unlock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Transactions (Read-only) */}
        <section className="bg-surface-container-low rounded-3xl overflow-hidden pb-4 mb-10">
          <div className="p-8 flex justify-between items-center">
            <h3 className="text-xl font-headline font-bold">Recent Transactions</h3>
            <button className="text-primary text-xs font-bold hover:underline">View All History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-outline text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Transaction ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-6 text-sm tabular-nums">Oct 24, 2023</td>
                  <td className="px-8 py-6 font-mono text-xs text-primary">#TXN-882194</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-surface-container-highest to-surface-container flex items-center justify-center text-[10px] font-bold">GN</div>
                      <span className="text-sm font-medium">Global Nexus Corp</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-sm tabular-nums">$42,500.00</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">Approved</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-6 text-sm tabular-nums">Oct 23, 2023</td>
                  <td className="px-8 py-6 font-mono text-xs text-primary">#TXN-882155</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-surface-container-highest to-surface-container flex items-center justify-center text-[10px] font-bold">AS</div>
                      <span className="text-sm font-medium">Apex Systems</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-sm tabular-nums">$12,800.00</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-tighter">Pending</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-6 text-sm tabular-nums">Oct 22, 2023</td>
                  <td className="px-8 py-6 font-mono text-xs text-primary">#TXN-882101</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-surface-container-highest to-surface-container flex items-center justify-center text-[10px] font-bold">TI</div>
                      <span className="text-sm font-medium">Terra Industries</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-sm tabular-nums">$95,000.00</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">Approved</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-6 text-sm tabular-nums">Oct 21, 2023</td>
                  <td className="px-8 py-6 font-mono text-xs text-primary">#TXN-882088</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-surface-container-highest to-surface-container flex items-center justify-center text-[10px] font-bold">KL</div>
                      <span className="text-sm font-medium">Kinetico Ltd.</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-sm tabular-nums">$5,400.00</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-tighter">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* System Audit Logs */}
        <section className="bg-surface-container-low rounded-3xl overflow-hidden pb-4 mb-10 border border-secondary/10 relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 group-hover:bg-secondary/10 transition-colors duration-700"></div>
          <div className="p-8 flex justify-between items-center bg-surface-container-low z-10 relative">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">history</span>
              <h3 className="text-xl font-headline font-bold">System Audit Logs</h3>
            </div>
            <button className="text-secondary text-xs font-bold hover:underline flex items-center gap-1">
              <span>View Full Audit Trail</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-outline text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-4">Timestamp</th>
                  <th className="px-8 py-4">Actor</th>
                  <th className="px-8 py-4">Action Event</th>
                  <th className="px-8 py-4">Target Resource</th>
                  <th className="px-8 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-6 text-xs text-outline tabular-nums">Oct 24, 2023 14:32:05</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">JD</div>
                      <span className="text-sm font-medium">John Doe (Admin)</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium">Updated Commission Rule</td>
                  <td className="px-8 py-6 font-mono text-xs text-secondary">Rule_Tiermap_V2</td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">Success</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-6 text-xs text-outline tabular-nums">Oct 24, 2023 11:15:22</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-tertiary/20 flex items-center justify-center text-[8px] font-bold text-tertiary">SYS</div>
                      <span className="text-sm font-medium">System AutoComm</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium">Processed Batch Payouts</td>
                  <td className="px-8 py-6 font-mono text-xs text-secondary">Batch_Oct_W3</td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">Success</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-6 text-xs text-outline tabular-nums">Oct 23, 2023 09:44:10</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-error/20 flex items-center justify-center text-[8px] font-bold text-error">UK</div>
                      <span className="text-sm font-medium">Unknown Source</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-error">Failed Login Attempt</td>
                  <td className="px-8 py-6 font-mono text-xs text-secondary">IP: 192.168.1.105</td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-tighter">Failed</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors group">
                  <td className="px-8 py-6 text-xs text-outline tabular-nums">Oct 22, 2023 16:20:00</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">AS</div>
                      <span className="text-sm font-medium">Alice Smith (Mgr)</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium">Modified User Role</td>
                  <td className="px-8 py-6 font-mono text-xs text-secondary">User_ID_9942</td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">Success</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}

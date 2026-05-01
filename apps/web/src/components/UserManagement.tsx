import { useState } from 'react';

export default function UserManagement() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="px-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Team & Access Management</h2>
          <p className="text-on-surface-variant mt-2 max-w-2xl font-body">Manage institutional roles, permissions, and account status for your organization. Maintain security through granular access control.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 text-on-surface hover:bg-surface-bright transition-all font-semibold text-sm">
            <span className="material-symbols-outlined text-lg" data-icon="file_download">file_download</span>
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-on-primary-container font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-lg" data-icon="person_add">person_add</span>
            Add New User
          </button>
        </div>
      </div>

      {/* Quick Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined" data-icon="group">group</span>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">Seats</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-headline tabular-nums">42</span>
            <span className="text-on-surface-variant font-medium">/ 50 users</span>
          </div>
          <div className="mt-4 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '84%' }}></div>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
            +2 added this week
          </p>
        </div>
        
        <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-tertiary/10 text-tertiary">
              <span className="material-symbols-outlined" data-icon="bolt">bolt</span>
            </div>
            <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full uppercase tracking-wider">Real-time</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-headline tabular-nums">18</span>
            <span className="text-on-surface-variant font-medium">Active Now</span>
          </div>
          <div className="mt-6 flex gap-1 items-end h-8">
            <div className="w-1.5 bg-tertiary/20 rounded-t-sm h-[40%]"></div>
            <div className="w-1.5 bg-tertiary/20 rounded-t-sm h-[60%]"></div>
            <div className="w-1.5 bg-tertiary/40 rounded-t-sm h-[30%]"></div>
            <div className="w-1.5 bg-tertiary/60 rounded-t-sm h-[80%]"></div>
            <div className="w-1.5 bg-tertiary rounded-t-sm h-[100%]"></div>
            <div className="w-1.5 bg-tertiary/70 rounded-t-sm h-[50%]"></div>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-3">Live system pulse</p>
        </div>
        
        <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
              <span className="material-symbols-outlined" data-icon="mail">mail</span>
            </div>
            <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full uppercase tracking-wider">Status</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-headline tabular-nums">4</span>
            <span className="text-on-surface-variant font-medium">Pending Invites</span>
          </div>
          <div className="mt-4 flex -space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold">JD</div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold">ML</div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-secondary">RS</div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+1</div>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-3 underline cursor-pointer hover:text-secondary">View invite history</p>
        </div>
      </div>

      {/* Table Toolbar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4 bg-surface-container-high/40 p-1.5 rounded-2xl backdrop-blur-md">
          <button className="px-5 py-2.5 rounded-xl bg-primary/20 text-primary font-bold text-xs">All Members</button>
          <button className="px-5 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors font-semibold text-xs">Admins</button>
          <button className="px-5 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors font-semibold text-xs">Managers</button>
          <button className="px-5 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors font-semibold text-xs">Sales</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/10 flex items-center gap-3 cursor-pointer hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="filter_list">filter_list</span>
            <span className="text-xs font-semibold">Advanced Filters</span>
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="mt-6 p-1 glass-panel rounded-[2rem] overflow-hidden shadow-2xl border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-lowest/50 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
              <tr>
                <th className="px-8 py-6">Member Name</th>
                <th className="px-6 py-6">Email Address</th>
                <th className="px-6 py-6">System Role</th>
                <th className="px-6 py-6">Last Active</th>
                <th className="px-6 py-6">Account Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {/* Row 1 */}
              <tr className="group hover:bg-surface-container-high/40 transition-all duration-300">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img alt="User" className="w-10 h-10 rounded-2xl object-cover" data-alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjS75GIuE6fM4hlKGIW4UV1QB19P2xn5Z6GjeGfem4t-Bd2XqI_XzRa7YLmNaEzAlGiYjEoaRYz_XmFU6eujAdc37oGAvpEQAdFconVIZ4vTbJEH3_CtTN7yJA6crBf8q1A48d8OkVPQ-mb-Ku7WdGkB5IZLOjBIhPsrjGXsaZBe4M3cRZcKbNxOBRE-bBF1W_Bf30GkvO6jY9OWRguSoArDlg7Ft5lek7UK-0vJolLwBBNigGNXJ1n6J3M0EaNHwaJ8gzairdRMxE"/>
                    <div>
                      <p className="font-headline font-bold text-sm text-on-surface">Jordan Vane</p>
                      <p className="text-[11px] text-on-surface-variant font-medium">Head of Sales</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-body text-slate-300">jordan.v@autocomm.ai</td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-extrabold uppercase tracking-tight">Sales</span>
                </td>
                <td className="px-6 py-5 text-sm tabular-nums text-on-surface-variant">2 min ago</td>
                <td className="px-6 py-5">
                  <div className="w-10 h-5 bg-tertiary rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(129,236,255,0.3)]">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-[#ffffff] rounded-full shadow-sm"></div>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg" data-icon="more_vert">more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="group hover:bg-surface-container-high/40 transition-all duration-300">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img alt="User" className="w-10 h-10 rounded-2xl object-cover" data-alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB4JO5ZbzZTJt05S5-4zmAh6Wx15FwABMCyRl6uZdLfn2I1iYFs22bSAGX2m862fmIOVQqqb7tvyPfg8FwonvP9Dq-hdp2Xwz2viBYpZyhUI3yufTc83rU9RIjRm8pRa7qfAbLNsqQkVq0imktXLrKwOAFQxaiUnIU0bbFAzWj-pJHMsem7RhlJKI-ZdhS909BK3GWQ64BHGwa-ta7rbujAphS6sxJMxZH2Hm55t9rc0XfV1wXJyrvqxtMQGSD_6Ql0NQXa029NJFx"/>
                    <div>
                      <p className="font-headline font-bold text-sm text-on-surface">Elena Rodriguez</p>
                      <p className="text-[11px] text-on-surface-variant font-medium">Platform Architect</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-body text-slate-300">elena.rod@autocomm.ai</td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-tight">Admin</span>
                </td>
                <td className="px-6 py-5 text-sm tabular-nums text-on-surface-variant">Oct 14, 10:45 AM</td>
                <td className="px-6 py-5">
                  <div className="w-10 h-5 bg-tertiary rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(129,236,255,0.3)]">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-[#ffffff] rounded-full shadow-sm"></div>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg" data-icon="more_vert">more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="group hover:bg-surface-container-high/40 transition-all duration-300">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img alt="User" className="w-10 h-10 rounded-2xl object-cover" data-alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4TeKCIDdUDNUzwHc8FIdoiXVhf30FwgAP0jBj5SV_s0IoD_RI_Xo6VHxu8jNWwBCGpldwwI1DxdKQiGBwTWk2Kt33agP21Blc7UONKIt_jLt0YJLGdYvmO6rCVwpNlQyJbTHJDErVkDZ3MMFidrVu5K3cVteOA8Q2tBon5lqjzM8uVUUWtKgSlFbxUJI1_WpNUxFpdPebnmzjUIcDFeenLOGyKxMTn6mFF6dGSEVMfiDvj1Fb-IOeeCrys_MkRLfb1C4xwnSdmVdF"/>
                    <div>
                      <p className="font-headline font-bold text-sm text-on-surface">Marcus Thorne</p>
                      <p className="text-[11px] text-on-surface-variant font-medium">Inventory Manager</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-body text-slate-300">m.thorne@autocomm.ai</td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-on-surface-variant/10 text-on-surface-variant text-[10px] font-extrabold uppercase tracking-tight">Manager</span>
                </td>
                <td className="px-6 py-5 text-sm tabular-nums text-on-surface-variant">Oct 12, 04:12 PM</td>
                <td className="px-6 py-5">
                  <div className="w-10 h-5 bg-surface-container-high rounded-full relative cursor-pointer border border-outline-variant/30">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-on-surface-variant/50 rounded-full"></div>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg" data-icon="more_vert">more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="group hover:bg-surface-container-high/40 transition-all duration-300">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img alt="User" className="w-10 h-10 rounded-2xl object-cover" data-alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEWHRAEm1jt5yZXsJnlXpWtY81qvREbqYg2gjdD3uAekOv8M_H2oC2LMdZZtknT9C1J7s4UA4dEYdK4AOAo6HzJi8MaM3YTifvei6Mo0fWOsH6OCBkTrVEyVQ2RrccjB1_mVGFpoiox0KVLQHLT92jwsXTFEMl0-uC5pfVlnQ9Z-1rOCQKPDxdGdaJewM2bA1OYQ_hcAcXzZq6wvV-ztLqQHThCLOR9o_kZCI3cLmFjImFMGi8uKRygWHTgha-PVnsRRB3Rd36UQqh"/>
                    <div>
                      <p className="font-headline font-bold text-sm text-on-surface">Sasha Kovic</p>
                      <p className="text-[11px] text-on-surface-variant font-medium">Compliance Officer</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-body text-slate-300">s.kovic@autocomm.ai</td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-tight">Admin</span>
                </td>
                <td className="px-6 py-5 text-sm tabular-nums text-on-surface-variant">Oct 14, 09:30 AM</td>
                <td className="px-6 py-5">
                  <div className="w-10 h-5 bg-tertiary rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(129,236,255,0.3)]">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-[#ffffff] rounded-full shadow-sm"></div>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg" data-icon="more_vert">more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-6 bg-surface-container-lowest/30 flex items-center justify-between border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant font-medium">Showing <span className="text-on-surface">4</span> of <span className="text-on-surface">42</span> team members</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-lg" data-icon="chevron_left">chevron_left</span>
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-xs">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-xs font-bold text-on-surface-variant">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-xs font-bold text-on-surface-variant">3</button>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-lg" data-icon="chevron_right">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Management Drawer (Side) */}
      <div 
        className={`fixed inset-0 bg-[#000000]/50 backdrop-blur-sm z-40 transition-opacity ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsDrawerOpen(false)}
      ></div>
      <aside className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 glass-panel border-l border-white/5 transition-transform duration-500 ease-in-out z-50 p-8 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold font-headline">Quick Permissions</h3>
            <div className="flex gap-2">
              <button onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-sm" data-icon="close">close</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-10 bg-white/5 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-on-primary font-bold">JV</div>
            <div>
              <p className="font-bold text-sm">Jordan Vane</p>
              <p className="text-xs text-on-surface-variant">Sales Role Selected</p>
            </div>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Financial Access</p>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-on-surface transition-colors">View Commissions</span>
                  <div className="w-9 h-5 bg-primary/40 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-[#ffffff] rounded-full"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-on-surface transition-colors">Adjust Payout Rules</span>
                  <div className="w-9 h-5 bg-surface-container-high rounded-full relative border border-outline-variant/30">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-on-surface-variant/50 rounded-full"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-on-surface transition-colors">Manual Adjustments</span>
                  <div className="w-9 h-5 bg-surface-container-high rounded-full relative border border-outline-variant/30">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-on-surface-variant/50 rounded-full"></div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-4">Reporting & Analytics</p>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-on-surface transition-colors">Export Financial Data</span>
                  <div className="w-9 h-5 bg-tertiary/40 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-[#ffffff] rounded-full shadow-[0_0_10px_rgba(129,236,255,0.5)]"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-on-surface transition-colors">Create Custom Reports</span>
                  <div className="w-9 h-5 bg-tertiary/40 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-[#ffffff] rounded-full shadow-[0_0_10px_rgba(129,236,255,0.5)]"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <button className="w-full py-3.5 rounded-xl bg-surface-bright text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-all">
              Reset to Role Default
            </button>
            <button 
              className="w-full py-3.5 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-on-primary-container font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-2"
              onClick={() => setIsDrawerOpen(false)}
            >
              Update Permissions
            </button>
          </div>
        </div>
      </aside>

      {/* Contextual FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-tertiary text-on-tertiary-container shadow-2xl shadow-tertiary/40 flex items-center justify-center hover:scale-110 transition-transform z-30">
        <span className="material-symbols-outlined text-2xl font-bold" data-icon="question_mark" style={{ fontVariationSettings: "'FILL' 1" }}>question_mark</span>
      </button>
    </div>
  );
}

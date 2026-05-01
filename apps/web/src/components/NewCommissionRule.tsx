export default function NewCommissionRule() {
  return (
    <div className="pt-28 px-8 pb-12 min-h-screen">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Breadcrumbs & Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-outline text-xs font-bold tracking-widest uppercase mb-4">
            <span>Admin</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span>Rule Engine</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary">Configure New Commission</span>
          </div>
          <h1 className="font-headline font-black text-4xl tracking-tighter text-on-surface">New Commission Rule</h1>
          <p className="text-on-surface-variant mt-2 max-w-2xl">Define institutional-grade commission structures with automated execution logic and multi-tiered overrides.</p>
        </div>

        {/* Configuration Form */}
        <div className="grid grid-cols-1 gap-8">
          {/* Section 1: Basic Info */}
          <section className="bg-surface-variant/60 backdrop-blur-xl border border-outline-variant/20 rounded-[2rem] p-8">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">description</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline font-bold text-xl text-on-surface mb-1">Basic Identification</h2>
                <p className="text-sm text-outline">Specify the internal naming and visibility parameters for this rule.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider pl-1">Rule Name</label>
                <input className="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary transition-all py-4 px-4 text-on-surface font-headline font-medium rounded-t-xl" placeholder="e.g. Institutional Tier 1" type="text" defaultValue="Q4 Global Equity Growth"/>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider pl-1">Rule ID (System Generated)</label>
                <div className="w-full bg-surface-container-lowest/50 border border-outline-variant/20 rounded-xl py-4 px-4 text-outline font-mono text-sm">
                  ACC-RULE-2024-X992
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-outline uppercase tracking-wider pl-1">Description</label>
                <textarea className="w-full bg-surface-container-low border-b border-outline-variant focus:border-primary transition-all py-4 px-4 text-on-surface rounded-t-xl" placeholder="Detailed purpose of this commission structure..." rows={3}></textarea>
              </div>
            </div>
          </section>

          {/* Section 2 & 3: Rule Logic */}
          <section className="bg-surface-variant/60 backdrop-blur-xl border-l-4 border-l-primary border-y border-y-outline-variant/20 border-r border-r-outline-variant/20 rounded-[2rem] p-8">
            <div className="flex items-start gap-6 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">account_tree</span>
              </div>
              <div className="flex-1">
                <h2 className="font-headline font-bold text-xl text-on-surface mb-1">Execution Logic</h2>
                <p className="text-sm text-outline">Configure how the commission value is calculated based on transaction volume.</p>
              </div>
              <div className="flex items-center gap-2 p-1 bg-surface-container-lowest rounded-xl">
                <button className="px-6 py-2 rounded-lg text-xs font-bold transition-all bg-primary text-on-primary">Tiered</button>
                <button className="px-6 py-2 rounded-lg text-xs font-bold transition-all text-outline hover:text-on-surface">Flat</button>
              </div>
            </div>

            {/* Dynamic Tier List */}
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-xs font-bold text-outline uppercase tracking-wider px-6 mb-2">
                <div className="col-span-5">Trading Volume Range (USD)</div>
                <div className="col-span-4 text-center">Commission (%)</div>
                <div className="col-span-3"></div>
              </div>

              {/* Tier 1 */}
              <div className="grid grid-cols-12 gap-4 items-center bg-surface-container/30 p-2 rounded-2xl group hover:bg-surface-container/50 transition-colors">
                <div className="col-span-5 flex items-center gap-3 pl-4">
                  <span className="text-xs font-bold text-primary tabular-nums">01</span>
                  <div className="flex items-center gap-2 w-full">
                    <input className="w-full bg-transparent outline-none ring-0 border-none text-on-surface font-headline font-bold tabular-nums" type="text" defaultValue="$0"/>
                    <span className="text-outline text-xs">TO</span>
                    <input className="w-full bg-transparent outline-none ring-0 border-none text-on-surface font-headline font-bold tabular-nums" type="text" defaultValue="$100,000"/>
                  </div>
                </div>
                <div className="col-span-4 flex justify-center">
                  <div className="relative w-24">
                    <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-center font-headline font-black text-primary tabular-nums" type="text" defaultValue="0.25"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-outline">%</span>
                  </div>
                </div>
                <div className="col-span-3 flex justify-end pr-4">
                  <button className="text-outline hover:text-error transition-all opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="grid grid-cols-12 gap-4 items-center bg-surface-container/30 p-2 rounded-2xl group hover:bg-surface-container/50 transition-colors">
                <div className="col-span-5 flex items-center gap-3 pl-4">
                  <span className="text-xs font-bold text-primary tabular-nums">02</span>
                  <div className="flex items-center gap-2 w-full">
                    <input className="w-full bg-transparent outline-none ring-0 border-none text-on-surface font-headline font-bold tabular-nums" type="text" defaultValue="$100,001"/>
                    <span className="text-outline text-xs">TO</span>
                    <input className="w-full bg-transparent outline-none ring-0 border-none text-on-surface font-headline font-bold tabular-nums" type="text" defaultValue="$500,000"/>
                  </div>
                </div>
                <div className="col-span-4 flex justify-center">
                  <div className="relative w-24">
                    <input className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-2 px-3 text-center font-headline font-black text-primary tabular-nums" type="text" defaultValue="0.15"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-outline">%</span>
                  </div>
                </div>
                <div className="col-span-3 flex justify-end pr-4">
                  <button className="text-outline hover:text-error transition-all"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>

              {/* Add Tier CTA */}
              <button className="w-full py-4 border-2 border-dashed border-outline-variant/20 rounded-2xl flex items-center justify-center gap-3 text-outline hover:text-primary hover:border-primary/50 transition-all group">
                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                <span className="text-sm font-bold uppercase tracking-widest">Add Calculation Tier</span>
              </button>
            </div>
          </section>

          {/* Section 4: Advanced Overrides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-variant/60 backdrop-blur-xl border border-outline-variant/20 rounded-[2rem] p-6 col-span-2">
              <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">security_update_good</span>
                Asset Eligibility
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">US Equities</span>
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">EU Equities</span>
                <span className="px-4 py-2 rounded-full bg-surface-container-highest text-outline text-xs font-bold border border-outline-variant/20 cursor-pointer hover:bg-surface-container-high transition-colors">+ Add Asset Class</span>
              </div>
            </div>

            <div className="rounded-[2rem] p-6 bg-gradient-to-br from-surface-container to-surface-container-low border border-outline-variant/20">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="font-headline font-bold text-lg mb-2">Simulated Outcome</h3>
                  <p className="text-xs text-outline mb-6">Estimated effective rate based on historical avg. volume.</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-headline font-black text-primary tabular-nums">0.182<span className="text-xl text-outline">%</span></div>
                  <div className="text-[10px] font-bold text-tertiary uppercase tracking-tighter mt-1">Institutional Optimal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Actions */}
          <div className="flex items-center justify-end gap-6 mt-4">
            <button className="px-8 py-4 text-outline font-headline font-bold hover:text-on-surface transition-colors">Cancel Changes</button>
            <button className="px-12 py-4 bg-primary text-on-primary font-headline font-black rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-[1.05]">Save Commission Rule</button>
          </div>
        </div>
      </div>

      {/* AI Chat Overlay (Glassmorphism Contextual FAB) */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-surface-variant/60 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 shadow-2xl border border-tertiary/30">
          <div className="relative">
            <img alt="AI Agent" className="w-12 h-12 rounded-xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0j3w4Mh7RBbycjo5V8jq46CvYh_HeqYmZaZnFSRvdqGPHC3k6q6MxwlkwxfyxhPPvIxqCG43H1zK1rxNcnYulvAbkIXTacnsBzgpO2fCmTRzBVpWB7XRjBpdhq4Ae1mk-hyyZ6Tc8UKcatZ5NaHnEfBgDTiuLXl03Vk4gD2ASKtXbOIyqvD-Ir0J4eI2B3ZGcgHIZFDYcmYzk1H5x-DfzpMfd9uYx0-hqRz2ULESvQ3hY4tswJnJYek5KHsXiOgJ57cxs4XbrhFAS" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full border-2 border-[rgb(6,14,32)] shadow-[0_0_10px_#81ecff]"></div>
          </div>
          <div>
            <div className="text-xs font-headline font-bold text-tertiary uppercase tracking-tighter">AutoComm AI</div>
            <div className="text-[13px] text-on-surface font-medium">Ready to validate tiered logic...</div>
          </div>
          <button className="bg-surface-container-highest p-2 rounded-lg text-tertiary hover:bg-tertiary hover:text-[rgb(0,77,87)] transition-colors">
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}

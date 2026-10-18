export default function NewCommissionRule() {
  return (
    <div className="min-h-screen px-5 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Breadcrumbs & Header */}
        <div className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#727c72]">
            <span>Administrasi</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span>Komisi</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#176b52]">Aturan baru</span>
          </div>
          <h1 className="text-2xl font-bold text-[#18231d]">Aturan komisi baru</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#536158]">Tentukan skema perhitungan komisi dan tingkatan berdasarkan nilai transaksi.</p>
        </div>

        {/* Configuration Form */}
        <div className="grid grid-cols-1 gap-8">
          {/* Section 1: Basic Info */}
          <section className="border-y border-[#d0d6cc] bg-transparent p-5 sm:p-6">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#d9e6d8] text-[#176b52]">
                <span className="material-symbols-outlined text-2xl">description</span>
              </div>
              <div className="flex-1">
                <h2 className="mb-1 text-base font-semibold text-[#18231d]">Informasi aturan</h2>
                <p className="text-sm text-[#536158]">Isi nama dan keterangan untuk skema komisi ini.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="pl-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">Nama aturan</label>
                <input className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 text-sm text-[#18231d] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" placeholder="Contoh: Komisi tingkat 1" type="text" defaultValue="Q4 Global Equity Growth"/>
              </div>

              <div className="space-y-2">
                <label className="pl-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">ID aturan</label>
                <div className="w-full rounded-sm border border-[#d0d6cc] bg-[#e9ece5] px-3 py-3 font-mono text-xs text-[#536158]">
                  ACC-RULE-2024-X992
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="pl-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">Keterangan</label>
                <textarea className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 text-sm text-[#18231d] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" placeholder="Tujuan dan ketentuan skema komisi..." rows={3}></textarea>
              </div>
            </div>
          </section>

          {/* Section 2 & 3: Rule Logic */}
          <section className="border-y border-[#d0d6cc] bg-transparent p-5 sm:p-6">
            <div className="mb-7 flex flex-col items-start gap-4 sm:flex-row">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#f4e2b8] text-[#80601d]">
                <span className="material-symbols-outlined text-2xl">account_tree</span>
              </div>
              <div className="flex-1">
                <h2 className="mb-1 text-base font-semibold text-[#18231d]">Perhitungan komisi</h2>
                <p className="text-sm text-[#536158]">Atur nilai komisi berdasarkan rentang nilai transaksi.</p>
              </div>
              <div className="flex items-center border border-[#c8d0c7] bg-white p-1 sm:ml-auto">
                <button className="bg-[#176b52] px-4 py-2 text-xs font-semibold text-white transition-colors">Bertingkat</button>
                <button className="px-4 py-2 text-xs font-semibold text-[#536158] transition-colors hover:bg-[#e9ece5]">Tetap</button>
              </div>
            </div>

            {/* Dynamic Tier List */}
            <div className="space-y-4">
              <div className="mb-2 hidden grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#536158] sm:grid">
                <div className="col-span-5">Rentang transaksi</div>
                <div className="col-span-4 text-center">Komisi (%)</div>
                <div className="col-span-3"></div>
              </div>

              {/* Tier 1 */}
              <div className="group grid grid-cols-1 items-center gap-3 border border-[#d0d6cc] bg-[#fbfcf8] p-3 transition-colors sm:grid-cols-12 sm:gap-4">
                <div className="flex items-center gap-3 sm:col-span-5 sm:pl-2">
                  <span className="font-mono text-xs font-semibold tabular-nums text-[#176b52]">01</span>
                  <div className="flex items-center gap-2 w-full">
                    <input className="w-full bg-transparent outline-none ring-0 border-none text-on-surface font-headline font-bold tabular-nums" type="text" defaultValue="$0"/>
                    <span className="text-xs text-[#727c72]">s.d.</span>
                    <input className="w-full bg-transparent outline-none ring-0 border-none text-on-surface font-headline font-bold tabular-nums" type="text" defaultValue="$100,000"/>
                  </div>
                </div>
                <div className="flex justify-start sm:col-span-4 sm:justify-center">
                  <div className="relative w-24">
                    <input className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-2 text-center font-mono text-sm font-semibold tabular-nums text-[#176b52]" type="text" defaultValue="0.25"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#727c72]">%</span>
                  </div>
                </div>
                <div className="flex justify-end sm:col-span-3 sm:pr-2">
                  <button aria-label="Hapus tingkatan 1" className="text-[#727c72] transition-colors hover:text-[#a63d2d] sm:opacity-0 sm:group-hover:opacity-100"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="group grid grid-cols-1 items-center gap-3 border border-[#d0d6cc] bg-[#fbfcf8] p-3 transition-colors sm:grid-cols-12 sm:gap-4">
                <div className="flex items-center gap-3 sm:col-span-5 sm:pl-2">
                  <span className="font-mono text-xs font-semibold tabular-nums text-[#176b52]">02</span>
                  <div className="flex items-center gap-2 w-full">
                    <input className="w-full bg-transparent outline-none ring-0 border-none text-on-surface font-headline font-bold tabular-nums" type="text" defaultValue="$100,001"/>
                    <span className="text-xs text-[#727c72]">s.d.</span>
                    <input className="w-full bg-transparent outline-none ring-0 border-none text-on-surface font-headline font-bold tabular-nums" type="text" defaultValue="$500,000"/>
                  </div>
                </div>
                <div className="flex justify-start sm:col-span-4 sm:justify-center">
                  <div className="relative w-24">
                    <input className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-2 text-center font-mono text-sm font-semibold tabular-nums text-[#176b52]" type="text" defaultValue="0.15"/>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#727c72]">%</span>
                  </div>
                </div>
                <div className="flex justify-end sm:col-span-3 sm:pr-2">
                  <button aria-label="Hapus tingkatan 2" className="text-[#727c72] transition-colors hover:text-[#a63d2d]"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>

              {/* Add Tier CTA */}
              <button className="flex w-full items-center justify-center gap-3 border border-dashed border-[#c8d0c7] py-3 text-sm font-semibold text-[#536158] transition-colors hover:border-[#176b52] hover:text-[#176b52]">
                <span className="material-symbols-outlined">add</span>
                <span>Tambah tingkatan</span>
              </button>
            </div>
          </section>

          {/* Section 4: Advanced Overrides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 border-y border-[#d0d6cc] bg-transparent p-5 md:col-span-2 sm:p-6">
              <h3 className="mb-4 flex items-center gap-3 text-base font-semibold text-[#18231d]">
                <span className="material-symbols-outlined text-tertiary">security_update_good</span>
                Kelayakan produk
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="border border-[#bfd3c3] bg-[#e5eee5] px-3 py-1.5 text-xs font-medium text-[#315744]">US Equities</span>
                <span className="border border-[#bfd3c3] bg-[#e5eee5] px-3 py-1.5 text-xs font-medium text-[#315744]">EU Equities</span>
                <span className="cursor-pointer border border-dashed border-[#c8d0c7] px-3 py-1.5 text-xs font-medium text-[#536158] transition-colors hover:border-[#176b52] hover:text-[#176b52]">+ Tambah produk</span>
              </div>
            </div>

            <div className="border-y border-[#d0d6cc] bg-[#e9ece5] p-5 sm:p-6">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="mb-2 text-base font-semibold text-[#18231d]">Simulasi hasil</h3>
                  <p className="mb-6 text-xs text-[#536158]">Perkiraan tarif efektif berdasarkan rata-rata transaksi.</p>
                </div>
                <div className="text-center">
                  <div className="font-mono text-3xl font-semibold tabular-nums text-[#176b52]">0.182<span className="text-xl text-[#536158]">%</span></div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#80601d]">Tarif optimal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Actions */}
          <div className="mt-4 flex flex-col-reverse justify-end gap-2 border-t border-[#d0d6cc] pt-4 sm:flex-row sm:items-center sm:gap-4">
            <button className="px-4 py-3 text-sm font-medium text-[#536158] transition-colors hover:text-[#18231d]">Batalkan</button>
            <button className="bg-[#176b52] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f513f] sm:px-8">Simpan aturan</button>
          </div>
        </div>
      </div>

    </div>
  );
}

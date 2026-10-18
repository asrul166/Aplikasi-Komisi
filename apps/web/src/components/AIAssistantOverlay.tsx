interface AIAssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistantOverlay({ isOpen, onClose }: AIAssistantOverlayProps) {
  if (!isOpen) return null;

  return (
    <aside aria-label="Asisten AutoComm" className="fixed inset-0 z-[70] flex h-[100dvh] w-full flex-col overflow-hidden border border-[#d0d6cc] bg-[#f3f4ef] p-4 text-[#18231d] shadow-xl md:inset-auto md:bottom-6 md:right-6 md:h-[min(580px,calc(100vh-3rem))] md:max-h-[580px] md:w-[380px] md:rounded-sm md:bg-[#fbfcf8] md:p-5">
      <div className="mb-4 flex shrink-0 items-center justify-between border-b border-[#d0d6cc] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#d9e6d8] text-[#176b52]">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <h4 className="font-semibold text-[#18231d]">Asisten AutoComm</h4>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#39835f]"></span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#536158]">Aktif</span>
            </div>
          </div>
        </div>
        <button aria-label="Tutup asisten" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-sm text-[#536158] transition-colors hover:bg-[#e9ece5] hover:text-[#18231d]">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <div className="max-w-[92%] border border-[#d0d6cc] bg-white p-4">
          <p className="text-sm leading-relaxed text-[#34443a]">
            Selamat siang. Berdasarkan tren saat ini, pencapaian target komisi bulan ini berpotensi melampaui target sebesar <span className="font-semibold text-[#176b52]">12%</span>. Perlu saya rangkum prospek dengan peluang konversi tertinggi?
          </p>
        </div>
        
        <div className="ml-auto max-w-[88%] border border-[#bfd3c3] bg-[#e5eee5] p-4">
          <p className="text-sm leading-relaxed text-[#315744]">Tampilkan tiga prospek teratas minggu ini.</p>
        </div>
        
        <div className="max-w-[92%] border border-[#d0d6cc] bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#536158]">Peluang konversi</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 border-t border-[#e1e5dd] py-2">
              <span className="text-xs text-[#34443a]">Quantum Leap LLC</span>
              <span className="font-mono text-xs font-semibold text-[#176b52]">92%</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#e1e5dd] py-2">
              <span className="text-xs text-[#34443a]">Stellar Logistics</span>
              <span className="font-mono text-xs font-semibold text-[#176b52]">85%</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#e1e5dd] py-2">
              <span className="text-xs text-[#34443a]">Horizon Venture</span>
              <span className="font-mono text-xs font-semibold text-[#98641f]">78%</span>
            </div>
          </div>
        </div>
      </div>
      
      <form className="relative mt-4 shrink-0 border-t border-[#d0d6cc] pt-4" onSubmit={(event) => event.preventDefault()}>
        <input 
          aria-label="Tulis pesan untuk asisten"
          className="w-full rounded-sm border border-[#c8d0c7] bg-white py-3 pl-3 pr-12 text-sm text-[#18231d] placeholder:text-[#727c72] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]"
          placeholder="Tulis pesan..."
          type="text"
        />
        <button aria-label="Kirim pesan" className="absolute right-1 top-[calc(50%+0.5rem)] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-sm bg-[#176b52] text-white transition-colors hover:bg-[#0f513f]">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </aside>
  )
}

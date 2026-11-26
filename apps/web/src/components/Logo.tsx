export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return <img src="/favicon.svg" alt="" className={className} />
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className={`h-9 w-9 ${light ? 'rounded-lg ring-1 ring-white/25' : ''}`} />
      <span>
        <span className="block text-lg font-bold leading-tight">Komisia</span>
        <span
          className={`block text-[10px] uppercase tracking-[0.14em] ${light ? 'text-mint-strong' : 'text-ink-faint'}`}
        >
          Komisi & pembukuan
        </span>
      </span>
    </span>
  )
}

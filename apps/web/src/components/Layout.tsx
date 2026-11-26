import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth, useUser } from '../lib/auth'
import { initials, ROLE_LABEL } from '../lib/format'
import { NAV } from '../lib/nav'
import { Icon } from './Icon'
import { Logo, LogoMark } from './Logo'
import { IconButton } from './ui'

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const user = useUser()
  const { logout } = useAuth()

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-forest px-4 py-6 text-white">
      <div className="px-2">
        <Logo light />
      </div>
      <nav aria-label="Navigasi utama" className="mt-8 space-y-1">
        {NAV.filter((item) => item.roles.includes(user.role)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${isActive ? 'bg-mint font-semibold text-forest' : 'text-mint hover:bg-white/10'}`
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-white/15 px-2 pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-strong text-xs font-bold text-forest">
          {initials(user.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{user.name}</span>
          <span className="block text-xs text-mint-strong">{ROLE_LABEL[user.role]}</span>
        </span>
        <button
          type="button"
          onClick={logout}
          aria-label="Keluar"
          title="Keluar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-mint hover:bg-white/10"
        >
          <Icon name="logout" />
        </button>
      </div>
    </div>
  )
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const title = NAV.find((item) => item.path === pathname)?.label ?? 'Komisia'

  return (
    <div className="min-h-screen md:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 md:block">
        <Navigation />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-64">
            <Navigation onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-canvas/95 px-4 backdrop-blur md:hidden">
        <IconButton icon="menu" label="Buka menu" onClick={() => setOpen(true)} />
        <LogoMark className="h-7 w-7" />
        <span className="font-semibold">{title}</span>
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}

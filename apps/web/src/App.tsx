import type { ComponentType } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { State } from './components/ui'
import { useAuth } from './lib/auth'
import { NAV } from './lib/nav'
import Approvals from './pages/Approvals'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Reports from './pages/Reports'
import Rules from './pages/Rules'
import Settings from './pages/Settings'
import Team from './pages/Team'
import Transactions from './pages/Transactions'

const PAGES: Record<string, ComponentType> = {
  '/': Dashboard,
  '/transaksi': Transactions,
  '/persetujuan': Approvals,
  '/tim': Team,
  '/aturan': Rules,
  '/laporan': Reports,
  '/pengaturan': Settings,
}

export default function App() {
  const { user, ready } = useAuth()

  if (!ready) return <State loading />
  if (!user) return <Login />

  return (
    <Routes>
      <Route element={<Layout />}>
        {NAV.filter((item) => item.roles.includes(user.role)).map(({ path }) => {
          const Page = PAGES[path]
          return <Route key={path} path={path} element={<Page />} />
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

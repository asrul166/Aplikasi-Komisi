import type { Role } from './types'

const everyone: Role[] = ['admin', 'manager', 'sales']
const leads: Role[] = ['admin', 'manager']

export const NAV = [
  { path: '/', label: 'Ringkasan', icon: 'space_dashboard', roles: everyone },
  { path: '/transaksi', label: 'Transaksi', icon: 'receipt_long', roles: everyone },
  { path: '/persetujuan', label: 'Persetujuan', icon: 'task_alt', roles: leads },
  { path: '/tim', label: 'Tim sales', icon: 'groups', roles: leads },
  { path: '/aturan', label: 'Aturan komisi', icon: 'percent', roles: leads },
  { path: '/laporan', label: 'Laporan', icon: 'summarize', roles: everyone },
  { path: '/pengaturan', label: 'Pengaturan', icon: 'settings', roles: everyone },
]

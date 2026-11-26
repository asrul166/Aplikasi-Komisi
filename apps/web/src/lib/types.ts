export type Role = 'admin' | 'manager' | 'sales'
export type TxStatus = 'pending' | 'success' | 'cancelled' | 'failed'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  jobTitle: string | null
  isActive?: boolean
}

export interface Transaction {
  id: string
  transactionCode: string
  date: string
  customerName: string
  salesAgentId: string
  salesAgentName: string
  productName: string | null
  quantity: number
  unitPrice: string
  totalSales: string
  commissionPercent: string | null
  commissionAmount: string | null
  status: TxStatus
  notes: string | null
}

export interface Page<T> {
  data: T[]
  pagination: { page: number; totalPages: number; totalItems: number }
}

export interface Summary {
  month: string
  totalSales: number
  totalCommission: number
  approvedCount: number
  pendingCount: number
  pendingValue: number
  target: number
  daysInMonth: number
  daysLeft: number
  daily: { date: string; commission: number; sales: number }[]
  recent: Transaction[]
}

export interface TeamMember {
  id: string
  name: string
  role: Role
  totalSales: number
  totalCommission: number
  approvedCount: number
  pendingCount: number
  target: number
}

export interface Rule {
  id: string
  name: string
  description: string | null
  type: 'flat' | 'tiered'
  flatRate: string
  status: 'operational' | 'staging' | 'archived'
  tiers: { id: string; minVolume: string; commissionRate: string }[]
}

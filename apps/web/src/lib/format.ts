const rupiahFormat = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})
const compactFormat = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const rupiah = (value: number | string) => rupiahFormat.format(Number(value))
export const compact = (value: number) => compactFormat.format(value)
export const percent = (fraction: number | string) =>
  `${(Number(fraction) * 100).toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`

export const shortDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

export function today() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const thisMonth = () => today().slice(0, 7)

export const ROLE_LABEL = { admin: 'Admin', manager: 'Manager', sales: 'Sales' } as const

export const STATUS_LABEL = {
  pending: 'Menunggu',
  success: 'Disetujui',
  cancelled: 'Ditolak',
  failed: 'Gagal',
} as const

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

/** Build and download a CSV that Excel opens correctly. */
export function downloadCsv(fileName: string, rows: (string | number)[][]) {
  const cell = (value: string | number) => {
    let text = String(value)
    // Stop spreadsheet apps from treating user input as a formula.
    if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = `'${text}`
    return /[",\n;]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
  }
  const content = '﻿' + rows.map((row) => row.map(cell).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

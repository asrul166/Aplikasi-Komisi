import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { STATUS_LABEL } from '../lib/format'
import type { TxStatus } from '../lib/types'
import { Icon } from './Icon'

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-line-strong bg-white text-ink hover:bg-canvas',
  ghost: 'text-ink-soft hover:bg-brand-soft hover:text-ink',
  danger: 'border border-line-strong bg-white text-danger hover:bg-danger-soft',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS
  icon?: string
  busy?: boolean
}

export function Button({
  variant = 'secondary',
  icon,
  busy,
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || busy}
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {busy ? (
        <Icon name="progress_activity" className="animate-spin" />
      ) : (
        icon && <Icon name={icon} />
      )}
      {children}
    </button>
  )
}

export function IconButton({
  icon,
  label,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-brand-soft hover:text-ink disabled:opacity-40 ${className}`}
      {...props}
    >
      <Icon name={icon} />
    </button>
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-faint">{hint}</span>}
    </label>
  )
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-ink-soft">{description}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  )
}

export function StatCard({
  label,
  value,
  note,
  icon,
}: {
  label: string
  value: string
  note: string
  icon: string
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-ink-soft">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Icon name={icon} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-ink-faint">{note}</p>
    </div>
  )
}

const STATUS_STYLE = {
  pending: ['schedule', 'bg-warn-soft text-warn'],
  success: ['check_circle', 'bg-brand-soft text-brand-dark'],
  cancelled: ['cancel', 'bg-danger-soft text-danger'],
  failed: ['error', 'bg-danger-soft text-danger'],
} as const

export function StatusBadge({ status }: { status: TxStatus }) {
  const [icon, tone] = STATUS_STYLE[status]
  return (
    <Badge tone={tone}>
      <Icon name={icon} className="!text-[14px]" />
      {STATUS_LABEL[status]}
    </Badge>
  )
}

export function Badge({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      {children}
    </span>
  )
}

export function Progress({ value, target }: { value: number; target: number }) {
  const ratio = target > 0 ? value / target : 0
  return (
    <div
      role="progressbar"
      aria-label="Capaian target"
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-mint"
    >
      <div
        className="h-full rounded-full bg-brand"
        style={{ width: `${Math.min(ratio, 1) * 100}%` }}
      />
    </div>
  )
}

/** Loading, error and empty states for anything that comes from the server. */
export function State({
  loading,
  error,
  empty,
  emptyText = 'Belum ada data',
  onRetry,
}: {
  loading?: boolean
  error?: string
  empty?: boolean
  emptyText?: string
  onRetry?: () => void
}) {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
        <Icon name="cloud_off" className="!text-[32px] text-danger" />
        <p>{error}</p>
        {onRetry && <Button onClick={onRetry}>Coba lagi</Button>}
      </div>
    )
  }
  if (!loading && !empty) return null
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center text-ink-faint">
      <Icon
        name={loading ? 'progress_activity' : 'inbox'}
        className={`!text-[32px] ${loading ? 'animate-spin' : ''}`}
      />
      <p>{loading ? 'Memuat…' : emptyText}</p>
    </div>
  )
}

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3">
        <thead>
          <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {head.map((cell, i) => (
              <th key={i} scope="col" className="whitespace-nowrap">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line [&_tr:hover]:bg-canvas/60">{children}</tbody>
      </table>
    </div>
  )
}

/** Native dialog: focus trapping and Escape come for free. */
export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    if (!dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className={`m-auto max-h-[90dvh] w-[calc(100%-2rem)] rounded-2xl p-0 text-ink shadow-2xl backdrop:bg-ink/40 ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-base font-bold">{title}</h2>
        <IconButton icon="close" label="Tutup" onClick={onClose} />
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  )
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-danger">
      {message}
    </p>
  )
}

import { useEffect, useState } from 'react'
import { Confirm } from '../components/Confirm'
import { CsvImport } from '../components/CsvImport'
import { useToast } from '../components/toast'
import { TransactionForm } from '../components/TransactionForm'
import { Button, IconButton, PageHeader, State, StatusBadge, Table } from '../components/ui'
import { api, query } from '../lib/api'
import { useUser } from '../lib/auth'
import { percent, rupiah, shortDate } from '../lib/format'
import type { Page, Transaction, User } from '../lib/types'
import { useData } from '../lib/useData'

export default function Transactions() {
  const { role } = useUser()
  const canEdit = role !== 'sales'
  const notify = useToast()

  const [typed, setTyped] = useState('')
  const [filters, setFilters] = useState({ search: '', status: '', salesAgentId: '', page: 1 })
  const [editing, setEditing] = useState<Transaction | 'new'>()
  const [deleting, setDeleting] = useState<Transaction>()
  const [importing, setImporting] = useState(false)

  // Changing a filter always goes back to the first page.
  const filter = (patch: Partial<typeof filters>) =>
    setFilters((f) => ({ ...f, page: 1, ...patch }))

  useEffect(() => {
    const timer = setTimeout(() => {
      const search = typed.trim()
      setFilters((f) => (f.search === search ? f : { ...f, search, page: 1 }))
    }, 300)
    return () => clearTimeout(timer)
  }, [typed])

  const { data, error, loading, reload } = useData<Page<Transaction>>(
    `/transactions${query({ ...filters, limit: 15, sort: 'date' })}`,
  )
  const { data: users } = useData<User[]>(canEdit ? '/users' : null)

  // Deleting the last row of the last page would otherwise leave an empty page.
  const totalPages = data?.pagination.totalPages ?? 0
  if (!loading && totalPages > 0 && filters.page > totalPages) {
    setFilters({ ...filters, page: totalPages })
  }

  async function reopen(t: Transaction) {
    try {
      await api.patch(`/transactions/${t.id}/status`, { status: 'pending' })
      notify(`${t.transactionCode} dikembalikan ke Menunggu`)
      reload()
    } catch (e) {
      notify((e as Error).message, 'error')
    }
  }

  const head = ['Transaksi', 'Pelanggan', 'Sales', 'Nilai', 'Komisi', 'Status']

  return (
    <>
      <PageHeader title="Transaksi" description="Catatan penjualan beserta komisinya.">
        {role === 'admin' && (
          <Button icon="upload_file" onClick={() => setImporting(true)}>
            Impor CSV
          </Button>
        )}
        {canEdit && (
          <Button variant="primary" icon="add" onClick={() => setEditing('new')}>
            Tambah transaksi
          </Button>
        )}
      </PageHeader>

      <section className="card">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <input
            type="search"
            aria-label="Cari transaksi"
            placeholder="Cari pelanggan atau ID transaksi"
            className="field sm:max-w-xs"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
          />
          <select
            aria-label="Status"
            className="field sm:w-44"
            value={filters.status}
            onChange={(e) => filter({ status: e.target.value })}
          >
            <option value="">Semua status</option>
            <option value="pending">Menunggu</option>
            <option value="success">Disetujui</option>
            <option value="cancelled">Ditolak</option>
          </select>
          {canEdit && (
            <select
              aria-label="Sales"
              className="field sm:w-52"
              value={filters.salesAgentId}
              onChange={(e) => filter({ salesAgentId: e.target.value })}
            >
              <option value="">Semua sales</option>
              {users
                ?.filter((u) => u.role === 'sales')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
          )}
        </div>

        <State
          loading={loading && !data}
          error={error}
          onRetry={reload}
          empty={!loading && data?.data.length === 0}
          emptyText="Tidak ada transaksi yang cocok"
        />

        {!error && !!data?.data.length && (
          <div className={loading ? 'opacity-50' : ''}>
            <Table head={canEdit ? [...head, ''] : head}>
              {data.data.map((t) => (
                <tr key={t.id}>
                  <td className="whitespace-nowrap">
                    <span className="block font-mono text-xs">{t.transactionCode}</span>
                    <span className="text-xs text-ink-faint">{shortDate(t.date)}</span>
                  </td>
                  <td>
                    <span className="block font-medium">{t.customerName}</span>
                    <span className="text-xs text-ink-faint">
                      {t.quantity} × {t.productName}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">{t.salesAgentName}</td>
                  <td className="whitespace-nowrap tabular-nums">{rupiah(t.totalSales)}</td>
                  <td className="whitespace-nowrap tabular-nums">
                    {t.commissionAmount ? (
                      <>
                        <span className="block">{rupiah(t.commissionAmount)}</span>
                        <span className="text-xs text-ink-faint">
                          {percent(t.commissionPercent ?? 0)}
                        </span>
                      </>
                    ) : (
                      '–'
                    )}
                  </td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  {canEdit && (
                    <td className="whitespace-nowrap text-right">
                      {t.status === 'pending' ? (
                        <IconButton icon="edit" label="Ubah" onClick={() => setEditing(t)} />
                      ) : (
                        <IconButton
                          icon="undo"
                          label="Kembalikan ke Menunggu"
                          onClick={() => reopen(t)}
                        />
                      )}
                      {role === 'admin' && (
                        <IconButton icon="delete" label="Hapus" onClick={() => setDeleting(t)} />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </Table>
            <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
              <p className="text-xs text-ink-faint">
                {data.pagination.totalItems} transaksi · halaman {data.pagination.page} dari{' '}
                {data.pagination.totalPages}
              </p>
              <div>
                <IconButton
                  icon="chevron_left"
                  label="Halaman sebelumnya"
                  disabled={filters.page <= 1}
                  onClick={() => filter({ page: filters.page - 1 })}
                />
                <IconButton
                  icon="chevron_right"
                  label="Halaman berikutnya"
                  disabled={filters.page >= data.pagination.totalPages}
                  onClick={() => filter({ page: filters.page + 1 })}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {editing && (
        <TransactionForm
          transaction={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(undefined)}
          onSaved={reload}
        />
      )}
      {importing && <CsvImport onClose={() => setImporting(false)} onImported={reload} />}
      {deleting && (
        <Confirm
          title="Hapus transaksi"
          message={`Transaksi ${deleting.transactionCode} (${deleting.customerName}) akan dihapus permanen.`}
          action="Hapus"
          onClose={() => setDeleting(undefined)}
          onConfirm={async () => {
            await api.delete(`/transactions/${deleting.id}`)
            notify('Transaksi dihapus')
            reload()
          }}
        />
      )}
    </>
  )
}

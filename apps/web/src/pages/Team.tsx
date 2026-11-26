import { useState, type FormEvent } from 'react'
import { useToast } from '../components/toast'
import {
  Button,
  Field,
  FormError,
  IconButton,
  Modal,
  PageHeader,
  Progress,
  State,
  Table,
} from '../components/ui'
import { api } from '../lib/api'
import { initials, monthLabel, rupiah, thisMonth } from '../lib/format'
import type { TeamMember } from '../lib/types'
import { useData } from '../lib/useData'

function GoalForm({
  member,
  month,
  onClose,
  onSaved,
}: {
  member: TeamMember
  month: string
  onClose: () => void
  onSaved: () => void
}) {
  const notify = useToast()
  const [target, setTarget] = useState(String(member.target || ''))
  const [error, setError] = useState<string>()

  async function submit(event: FormEvent) {
    event.preventDefault()
    try {
      await api.put('/dashboard/goals', { userId: member.id, month, targetAmount: Number(target) })
      notify('Target disimpan')
      onSaved()
      onClose()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <Modal title={`Target ${member.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field
          label={`Target penjualan ${monthLabel(month)} (Rp)`}
          hint={rupiah(Number(target) || 0)}
        >
          <input
            className="field"
            type="number"
            min={0}
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </Field>
        <FormError message={error} />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Batal</Button>
          <Button type="submit" variant="primary">
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Team() {
  const [month, setMonth] = useState(thisMonth)
  const [editing, setEditing] = useState<TeamMember>()
  const { data, error, loading, reload } = useData<TeamMember[]>(`/dashboard/team?month=${month}`)

  return (
    <>
      <PageHeader title="Tim sales" description="Penjualan, komisi, dan capaian target per orang.">
        <input
          aria-label="Periode"
          type="month"
          className="field w-48"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
        />
      </PageHeader>

      <section className="card">
        <State
          loading={loading}
          error={error}
          onRetry={reload}
          empty={!loading && data?.length === 0}
          emptyText="Belum ada anggota sales"
        />
        {!loading && !error && !!data?.length && (
          <Table head={['Sales', 'Penjualan', 'Komisi', 'Transaksi', 'Capaian target', '']}>
            {data.map((m) => (
              <tr key={m.id}>
                <td>
                  <span className="flex items-center gap-3 whitespace-nowrap font-medium">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-xs font-bold text-forest">
                      {initials(m.name)}
                    </span>
                    {m.name}
                  </span>
                </td>
                <td className="whitespace-nowrap font-semibold tabular-nums">
                  {rupiah(m.totalSales)}
                </td>
                <td className="whitespace-nowrap tabular-nums">{rupiah(m.totalCommission)}</td>
                <td className="whitespace-nowrap">
                  {m.approvedCount} disetujui
                  {m.pendingCount > 0 && (
                    <span className="block text-xs text-warn">{m.pendingCount} menunggu</span>
                  )}
                </td>
                <td className="w-64">
                  {m.target > 0 ? (
                    <>
                      <Progress value={m.totalSales} target={m.target} />
                      <span className="mt-1 block text-xs text-ink-faint">
                        {Math.round((m.totalSales / m.target) * 100)}% dari {rupiah(m.target)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-ink-faint">Belum ada target</span>
                  )}
                </td>
                <td className="text-right">
                  <IconButton
                    icon="flag"
                    label={`Atur target ${m.name}`}
                    onClick={() => setEditing(m)}
                  />
                </td>
              </tr>
            ))}
          </Table>
        )}
      </section>

      {editing && (
        <GoalForm
          member={editing}
          month={month}
          onClose={() => setEditing(undefined)}
          onSaved={reload}
        />
      )}
    </>
  )
}

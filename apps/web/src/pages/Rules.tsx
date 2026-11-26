import { useState } from 'react'
import { Confirm } from '../components/Confirm'
import { RuleForm } from '../components/RuleForm'
import { useToast } from '../components/toast'
import { Badge, Button, IconButton, PageHeader, State } from '../components/ui'
import { api } from '../lib/api'
import { useUser } from '../lib/auth'
import { percent, rupiah } from '../lib/format'
import type { Rule } from '../lib/types'
import { useData } from '../lib/useData'

export default function Rules() {
  const isAdmin = useUser().role === 'admin'
  const notify = useToast()
  const { data, error, loading, reload } = useData<Rule[]>('/commissions/rules')
  const [editing, setEditing] = useState<Rule | 'new'>()
  const [deleting, setDeleting] = useState<Rule>()

  async function activate(rule: Rule) {
    try {
      await api.post(`/commissions/rules/${rule.id}/activate`)
      notify(`"${rule.name}" sekarang aktif`)
      reload()
    } catch (e) {
      notify((e as Error).message, 'error')
    }
  }

  return (
    <>
      <PageHeader
        title="Aturan komisi"
        description="Satu aturan aktif dipakai untuk persetujuan berikutnya. Komisi lama tidak berubah."
      >
        {isAdmin && (
          <Button variant="primary" icon="add" onClick={() => setEditing('new')}>
            Aturan baru
          </Button>
        )}
      </PageHeader>

      {!data || error || data.length === 0 ? (
        <div className="card">
          <State
            loading={loading}
            error={error}
            onRetry={reload}
            empty={data?.length === 0}
            emptyText="Belum ada aturan komisi"
          />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((rule) => {
            const active = rule.status === 'operational'
            return (
              <article
                key={rule.id}
                className={`card flex flex-col p-5 ${active ? 'ring-2 ring-brand' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold">{rule.name}</h2>
                    <p className="text-ink-soft">{rule.description}</p>
                  </div>
                  <Badge tone={active ? 'bg-brand text-white' : 'bg-canvas text-ink-soft'}>
                    {active ? 'Aktif' : 'Draf'}
                  </Badge>
                </div>

                <dl className="my-4 divide-y divide-line rounded-lg border border-line">
                  <div className="flex justify-between gap-3 px-3 py-2">
                    <dt>Komisi dasar</dt>
                    <dd className="font-semibold">{percent(rule.flatRate)}</dd>
                  </div>
                  {rule.tiers.map((tier) => (
                    <div key={tier.id} className="flex justify-between gap-3 px-3 py-2">
                      <dt className="text-ink-soft">Mulai {rupiah(tier.minVolume)} / bulan</dt>
                      <dd className="font-semibold">+{percent(tier.commissionRate)}</dd>
                    </div>
                  ))}
                </dl>

                {isAdmin && (
                  <div className="mt-auto flex items-center justify-end gap-2">
                    {!active && (
                      <>
                        <IconButton
                          icon="delete"
                          label="Hapus aturan"
                          onClick={() => setDeleting(rule)}
                        />
                        <Button onClick={() => activate(rule)}>Aktifkan</Button>
                      </>
                    )}
                    <Button icon="edit" onClick={() => setEditing(rule)}>
                      Ubah
                    </Button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      {editing && (
        <RuleForm
          rule={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(undefined)}
          onSaved={reload}
        />
      )}
      {deleting && (
        <Confirm
          title="Hapus aturan"
          message={`Aturan "${deleting.name}" akan dihapus.`}
          action="Hapus"
          onClose={() => setDeleting(undefined)}
          onConfirm={async () => {
            await api.delete(`/commissions/rules/${deleting.id}`)
            notify('Aturan dihapus')
            reload()
          }}
        />
      )}
    </>
  )
}

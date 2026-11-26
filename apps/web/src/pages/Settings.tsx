import { useState, type FormEvent, type ReactNode } from 'react'
import { TeamAccess } from '../components/TeamAccess'
import { useToast } from '../components/toast'
import { Button, Field, FormError, PageHeader } from '../components/ui'
import { api } from '../lib/api'
import { useAuth, useUser } from '../lib/auth'
import { useData } from '../lib/useData'

/** A small card form that reports success or failure on its own. */
function SettingsForm({
  title,
  onSubmit,
  done,
  children,
}: {
  title: string
  onSubmit: () => Promise<unknown>
  done: string
  children: ReactNode
}) {
  const notify = useToast()
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      await onSubmit()
      notify(done)
    } catch (e) {
      setError((e as Error).message)
    }
    setBusy(false)
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-5">
      <h2 className="text-base font-bold">{title}</h2>
      {children}
      <FormError message={error} />
      <Button type="submit" variant="primary" busy={busy}>
        Simpan
      </Button>
    </form>
  )
}

function Profile() {
  const user = useUser()
  const { refresh } = useAuth()
  const [name, setName] = useState(user.name)
  const [jobTitle, setJobTitle] = useState(user.jobTitle ?? '')

  return (
    <SettingsForm
      title="Profil"
      done="Profil disimpan"
      onSubmit={async () => {
        await api.patch('/users/me', { name, jobTitle })
        await refresh()
      }}
    >
      <Field label="Nama">
        <input className="field" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Jabatan">
        <input className="field" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
      </Field>
      <Field label="Email">
        <input className="field" value={user.email} disabled />
      </Field>
    </SettingsForm>
  )
}

function Password() {
  const [currentPassword, setCurrent] = useState('')
  const [newPassword, setNext] = useState('')

  return (
    <SettingsForm
      title="Ganti password"
      done="Password diganti"
      onSubmit={async () => {
        await api.post('/auth/change-password', {
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        })
        setCurrent('')
        setNext('')
      }}
    >
      <Field label="Password saat ini">
        <input
          className="field"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </Field>
      <Field label="Password baru" hint="Minimal 8 karakter">
        <input
          className="field"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNext(e.target.value)}
        />
      </Field>
    </SettingsForm>
  )
}

function WorkspaceName({ initial }: { initial: string }) {
  const [name, setName] = useState(initial)
  return (
    <SettingsForm
      title="Ruang kerja"
      done="Nama ruang kerja disimpan"
      onSubmit={() => api.put('/workspaces/current', { name })}
    >
      <Field label="Nama perusahaan">
        <input className="field" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
    </SettingsForm>
  )
}

export default function Settings() {
  const isAdmin = useUser().role === 'admin'
  const { data: workspace } = useData<{ name: string }>(isAdmin ? '/workspaces/current' : null)

  return (
    <>
      <PageHeader title="Pengaturan" description="Akun Anda dan akses tim." />
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Profile />
        <Password />
      </div>
      {isAdmin && (
        <>
          <TeamAccess />
          <div className="grid lg:grid-cols-2">
            {workspace && <WorkspaceName initial={workspace.name} />}
          </div>
        </>
      )}
    </>
  )
}

import { useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { useUser } from '../lib/auth'
import { ROLE_LABEL } from '../lib/format'
import type { Role, User } from '../lib/types'
import { useData } from '../lib/useData'
import { useToast } from './toast'
import { Badge, Button, Field, FormError, Modal, State, Table } from './ui'

const roleOptions = Object.entries(ROLE_LABEL).map(([value, label]) => (
  <option key={value} value={value}>
    {label}
  </option>
))

function NewUser({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const notify = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales',
    jobTitle: '',
  })
  const [error, setError] = useState<string>()
  const bind = (key: keyof typeof form) => ({
    className: 'field',
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value }),
  })

  async function submit(event: FormEvent) {
    event.preventDefault()
    try {
      await api.post('/users', form)
      notify('Pengguna ditambahkan')
      onSaved()
      onClose()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <Modal title="Tambah pengguna" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nama">
          <input {...bind('name')} required />
        </Field>
        <Field label="Email">
          <input {...bind('email')} type="email" required autoComplete="off" />
        </Field>
        <Field label="Password awal" hint="Minimal 8 karakter. Sampaikan langsung ke pengguna.">
          <input
            {...bind('password')}
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Peran">
          <select {...bind('role')}>{roleOptions}</select>
        </Field>
        <Field label="Jabatan">
          <input {...bind('jobTitle')} />
        </Field>
        <FormError message={error} />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Batal</Button>
          <Button type="submit" variant="primary">
            Tambah
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function TeamAccess() {
  const me = useUser()
  const notify = useToast()
  const { data, error, loading, reload } = useData<User[]>('/users')
  const [adding, setAdding] = useState(false)

  async function update(user: User, patch: { role?: Role; isActive?: boolean }) {
    try {
      await api.patch(`/users/${user.id}`, patch)
      notify(`${user.name} diperbarui`)
      reload()
    } catch (e) {
      notify((e as Error).message, 'error')
    }
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 className="text-base font-bold">Pengguna dan peran</h2>
        <Button icon="person_add" onClick={() => setAdding(true)}>
          Tambah pengguna
        </Button>
      </div>
      <State loading={loading && !data} error={error} onRetry={reload} />
      {data && (
        <Table head={['Nama', 'Peran', 'Status', '']}>
          {data.map((user) => (
            <tr key={user.id}>
              <td>
                <span className="block font-medium">{user.name}</span>
                <span className="text-xs text-ink-faint">{user.email}</span>
              </td>
              <td>
                <select
                  aria-label={`Peran ${user.name}`}
                  className="field w-36"
                  value={user.role}
                  disabled={user.id === me.id}
                  onChange={(e) => update(user, { role: e.target.value as Role })}
                >
                  {roleOptions}
                </select>
              </td>
              <td>
                <Badge
                  tone={
                    user.isActive ? 'bg-brand-soft text-brand-dark' : 'bg-danger-soft text-danger'
                  }
                >
                  {user.isActive ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </td>
              <td className="text-right">
                {user.id !== me.id && (
                  <Button variant="ghost" onClick={() => update(user, { isActive: !user.isActive })}>
                    {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
      {adding && <NewUser onClose={() => setAdding(false)} onSaved={reload} />}
    </section>
  )
}

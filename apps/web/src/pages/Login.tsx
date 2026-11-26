import { useState, type FormEvent } from 'react'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { Button, Field, FormError } from '../components/ui'
import { useAuth } from '../lib/auth'

const FEATURES = [
  ['calculate', 'Komisi flat dan bertingkat dihitung otomatis saat transaksi disetujui'],
  ['task_alt', 'Alur persetujuan dengan hak akses per peran'],
  ['upload_file', 'Impor transaksi dari CSV, ekspor rekap komisi'],
]

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    try {
      await login(email, password)
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-between gap-8 bg-forest px-6 py-8 text-white sm:px-12 lg:px-16 lg:py-12">
        <Logo light />
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            Angka yang rapi.
            <br />
            Tim yang fokus.
          </h1>
          <ul className="mt-8 hidden space-y-4 text-mint sm:block">
            {FEATURES.map(([icon, text]) => (
              <li key={icon} className="flex items-start gap-3">
                <Icon name={icon} className="text-mint-strong" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="hidden text-xs text-mint-strong lg:block">Ruang kerja internal · Komisia</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h2 className="text-2xl font-bold">Selamat datang kembali</h2>
            <p className="mt-1 text-ink-soft">Masuk dengan akun kerja Anda.</p>
          </div>
          <Field label="Email">
            <input
              className="field"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.co.id"
            />
          </Field>
          <Field label="Password">
            <input
              className="field"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <FormError message={error} />
          <Button type="submit" variant="primary" busy={busy} className="w-full py-2.5">
            Masuk
          </Button>
          <p className="border-t border-line pt-5 text-xs text-ink-faint">
            Akun dibuat oleh administrator ruang kerja Anda.
          </p>
        </form>
      </section>
    </main>
  )
}

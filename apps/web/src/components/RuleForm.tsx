import { useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { percent, rupiah } from '../lib/format'
import type { Rule } from '../lib/types'
import { useToast } from './toast'
import { Button, Field, FormError, IconButton, Modal } from './ui'

// Rates are stored as fractions but edited as percentages.
const toPercent = (fraction: string) => String(Number((Number(fraction) * 100).toFixed(2)))
const toFraction = (text: string) => Number((Number(text) / 100).toFixed(4))

interface Simulation {
  flatCommission: number
  tieredBonus: number
  totalCommission: number
  effectiveRate: number
}

export function RuleForm({
  rule,
  onClose,
  onSaved,
}: {
  rule?: Rule
  onClose: () => void
  onSaved: () => void
}) {
  const notify = useToast()
  const [name, setName] = useState(rule?.name ?? '')
  const [description, setDescription] = useState(rule?.description ?? '')
  const [type, setType] = useState<Rule['type']>(rule?.type ?? 'tiered')
  const [flat, setFlat] = useState(rule ? toPercent(rule.flatRate) : '3')
  const [tiers, setTiers] = useState(
    () =>
      rule?.tiers.map((t, i) => ({
        key: i,
        min: String(Number(t.minVolume)),
        rate: toPercent(t.commissionRate),
      })) ?? [{ key: 0, min: '100000000', rate: '1' }],
  )
  const [sale, setSale] = useState('50000000')
  const [previous, setPrevious] = useState('80000000')
  const [simulation, setSimulation] = useState<Simulation>()
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)

  const definition = () => ({
    type,
    flatRate: toFraction(flat),
    tiers:
      type === 'tiered'
        ? tiers.map((t) => ({ minVolume: Number(t.min), commissionRate: toFraction(t.rate) }))
        : [],
  })

  const setTier = (key: number, patch: { min?: string; rate?: string }) =>
    setTiers(tiers.map((t) => (t.key === key ? { ...t, ...patch } : t)))

  async function simulate() {
    setError(undefined)
    try {
      setSimulation(
        await api.post<Simulation>('/commissions/simulate', {
          ...definition(),
          totalSales: Number(sale),
          cumulativeSales: Number(previous) + Number(sale),
        }),
      )
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    const body = { name, description: description || undefined, ...definition() }
    try {
      if (rule) await api.put(`/commissions/rules/${rule.id}`, body)
      else await api.post('/commissions/rules', body)
      notify('Aturan komisi disimpan')
      onSaved()
      onClose()
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <Modal title={rule ? 'Ubah aturan komisi' : 'Aturan komisi baru'} onClose={onClose} wide>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nama aturan">
          <input className="field" required value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Keterangan">
          <textarea
            className="field"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Jenis">
            <select
              className="field"
              value={type}
              onChange={(e) => setType(e.target.value as Rule['type'])}
            >
              <option value="flat">Tetap (flat)</option>
              <option value="tiered">Bertingkat</option>
            </select>
          </Field>
          <Field label="Komisi dasar (%)">
            <input
              className="field"
              type="number"
              min={0}
              max={50}
              step={0.01}
              required
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
            />
          </Field>
        </div>

        {type === 'tiered' && (
          <fieldset className="space-y-2">
            <legend className="mb-1 font-medium">Bonus tingkatan</legend>
            <p className="text-xs text-ink-faint">
              Berlaku bila total penjualan disetujui seorang sales dalam sebulan mencapai batas.
              Hanya tingkatan tertinggi yang dipakai.
            </p>
            {tiers.map((tier) => (
              <div key={tier.key} className="flex items-end gap-2">
                <div className="flex-1">
                  <Field label="Mulai dari (Rp)">
                    <input
                      className="field"
                      type="number"
                      min={0}
                      required
                      value={tier.min}
                      onChange={(e) => setTier(tier.key, { min: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="w-28">
                  <Field label="Bonus (%)">
                    <input
                      className="field"
                      type="number"
                      min={0}
                      max={50}
                      step={0.01}
                      required
                      value={tier.rate}
                      onChange={(e) => setTier(tier.key, { rate: e.target.value })}
                    />
                  </Field>
                </div>
                <IconButton
                  icon="delete"
                  label="Hapus tingkatan"
                  className="mb-1"
                  onClick={() => setTiers(tiers.filter((t) => t.key !== tier.key))}
                />
              </div>
            ))}
            <Button
              icon="add"
              variant="ghost"
              disabled={tiers.length >= 10}
              onClick={() => setTiers([...tiers, { key: Date.now(), min: '', rate: '' }])}
            >
              Tambah tingkatan
            </Button>
          </fieldset>
        )}

        <div className="rounded-xl bg-canvas p-4">
          <p className="mb-3 font-bold">Simulasi</p>
          <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Field label="Nilai transaksi (Rp)">
              <input
                className="field"
                type="number"
                min={1}
                value={sale}
                onChange={(e) => setSale(e.target.value)}
              />
            </Field>
            <Field label="Penjualan sebelumnya (Rp)">
              <input
                className="field"
                type="number"
                min={0}
                value={previous}
                onChange={(e) => setPrevious(e.target.value)}
              />
            </Field>
            <Button onClick={simulate}>Hitung</Button>
          </div>
          {simulation && (
            <p className="mt-3">
              Komisi <span className="font-bold">{rupiah(simulation.totalCommission)}</span> (
              {percent(simulation.effectiveRate)}) = dasar {rupiah(simulation.flatCommission)} +
              bonus {rupiah(simulation.tieredBonus)}
            </p>
          )}
        </div>

        <FormError message={error} />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Batal</Button>
          <Button type="submit" variant="primary" busy={busy}>
            Simpan aturan
          </Button>
        </div>
      </form>
    </Modal>
  )
}

import { useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { rupiah, today } from '../lib/format'
import type { Transaction, User } from '../lib/types'
import { useData } from '../lib/useData'
import { useToast } from './toast'
import { Button, Field, FormError, Modal } from './ui'

export function TransactionForm({
  transaction,
  onClose,
  onSaved,
}: {
  transaction?: Transaction
  onClose: () => void
  onSaved: () => void
}) {
  const notify = useToast()
  const { data: users } = useData<User[]>('/users')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [form, setForm] = useState({
    transactionCode: transaction?.transactionCode ?? '',
    date: transaction?.date ?? today(),
    customerName: transaction?.customerName ?? '',
    salesAgentId: transaction?.salesAgentId ?? '',
    productName: transaction?.productName ?? '',
    quantity: String(transaction?.quantity ?? 1),
    unitPrice: transaction ? String(Number(transaction.unitPrice)) : '',
    notes: transaction?.notes ?? '',
  })

  const bind = (key: keyof typeof form) => ({
    className: 'field',
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value }),
  })
  const total = Number(form.quantity) * Number(form.unitPrice)
  const agents = users?.filter(
    (u) => u.id === form.salesAgentId || (u.isActive && u.role === 'sales'),
  )

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(undefined)
    const body = {
      ...form,
      transactionCode: form.transactionCode || undefined,
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
      notes: form.notes || undefined,
    }
    try {
      if (transaction) await api.put(`/transactions/${transaction.id}`, body)
      else await api.post('/transactions', body)
      notify(transaction ? 'Transaksi diperbarui' : 'Transaksi ditambahkan')
      onSaved()
      onClose()
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <Modal title={transaction ? 'Ubah transaksi' : 'Tambah transaksi'} onClose={onClose} wide>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Tanggal">
          <input {...bind('date')} type="date" required />
        </Field>
        <Field
          label="ID transaksi"
          hint={transaction ? 'ID tidak bisa diubah' : 'Kosongkan untuk dibuat otomatis'}
        >
          <input {...bind('transactionCode')} maxLength={50} disabled={!!transaction} />
        </Field>
        <Field label="Pelanggan">
          <input {...bind('customerName')} required maxLength={255} />
        </Field>
        <Field label="Sales">
          <select {...bind('salesAgentId')} required>
            <option value="">Pilih sales</option>
            {agents?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Produk" hint="Produk baru otomatis tersimpan">
            <input {...bind('productName')} required maxLength={255} />
          </Field>
        </div>
        <Field label="Jumlah">
          <input {...bind('quantity')} type="number" min={1} step={1} required />
        </Field>
        <Field label="Harga satuan (Rp)">
          <input {...bind('unitPrice')} type="number" min={1} step="any" required />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Catatan">
            <textarea {...bind('notes')} rows={2} maxLength={2000} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <FormError message={error} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 sm:col-span-2">
          <p className="text-ink-soft">
            Total <span className="font-bold text-ink">{rupiah(total || 0)}</span>
          </p>
          <div className="flex gap-2">
            <Button onClick={onClose}>Batal</Button>
            <Button type="submit" variant="primary" busy={busy}>
              Simpan
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

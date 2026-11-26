import { useState } from 'react'
import { api } from '../lib/api'
import { Icon } from './Icon'
import { Button, FormError, Modal } from './ui'

const TARGETS: Record<string, string> = {
  transactionCode: 'ID transaksi',
  date: 'Tanggal *',
  customerName: 'Pelanggan',
  salesAgentName: 'Sales (nama/email) *',
  productName: 'Produk *',
  productCategory: 'Kategori',
  quantity: 'Jumlah *',
  unitPrice: 'Harga satuan *',
  status: 'Status',
  notes: 'Catatan',
}

interface Upload {
  jobId: string
  headers: string[]
  mapping: Record<string, string>
  totalRows: number
  sampleRows: Record<string, string>[]
}

interface Result {
  imported: number
  totalRows: number
  errors: { row: number; error: string }[]
}

export function CsvImport({
  onClose,
  onImported,
}: {
  onClose: () => void
  onImported: () => void
}) {
  const [upload, setUpload] = useState<Upload>()
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [result, setResult] = useState<Result>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  async function run(task: () => Promise<void>) {
    setBusy(true)
    setError(undefined)
    try {
      await task()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const choose = (file: File) =>
    run(async () => {
      const body = new FormData()
      body.append('file', file)
      const data = await api.post<Upload>('/csv/upload', body)
      setUpload(data)
      setMapping(data.mapping)
    })

  const execute = () =>
    run(async () => {
      const chosen = Object.fromEntries(Object.entries(mapping).filter(([, target]) => target))
      setResult(await api.post<Result>(`/csv/${upload!.jobId}/import`, { mapping: chosen }))
      onImported()
    })

  function content() {
    if (result) {
      return (
        <>
          <p className="flex items-center gap-2 font-semibold">
            <Icon name="task_alt" className="text-brand" />
            {result.imported} dari {result.totalRows} baris berhasil diimpor
          </p>
          {result.errors.length > 0 && (
            <ul className="max-h-60 space-y-1 overflow-y-auto rounded-lg bg-danger-soft p-3 text-danger">
              {result.errors.map((e) => (
                <li key={e.row}>
                  Baris {e.row}: {e.error}
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-end">
            <Button variant="primary" onClick={onClose}>
              Selesai
            </Button>
          </div>
        </>
      )
    }

    if (upload) {
      return (
        <>
          <p className="text-ink-soft">
            {upload.totalRows} baris ditemukan. Periksa pasangan kolom sebelum mengimpor.
          </p>
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {upload.headers.map((header) => (
              <label key={header} className="grid grid-cols-2 items-center gap-3">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{header}</span>
                  <span className="block truncate text-xs text-ink-faint">
                    Contoh: {upload.sampleRows[0]?.[header] || '(kosong)'}
                  </span>
                </span>
                <select
                  className="field"
                  value={mapping[header] ?? ''}
                  onChange={(e) => setMapping({ ...mapping, [header]: e.target.value })}
                >
                  <option value="">Abaikan</option>
                  {Object.entries(TARGETS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <FormError message={error} />
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Batal</Button>
            <Button variant="primary" busy={busy} onClick={execute}>
              Impor {upload.totalRows} baris
            </Button>
          </div>
        </>
      )
    }

    return (
      <>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line-strong px-4 py-10 text-center focus-within:border-brand hover:border-brand hover:bg-brand-soft">
          <Icon
            name={busy ? 'progress_activity' : 'upload_file'}
            className={`!text-[32px] text-brand ${busy ? 'animate-spin' : ''}`}
          />
          <span className="font-semibold">Pilih file CSV</span>
          <span className="text-xs text-ink-faint">Maksimal 2 MB dan 2.000 baris</span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            disabled={busy}
            onChange={(e) => e.target.files?.[0] && choose(e.target.files[0])}
          />
        </label>
        <FormError message={error} />
        <a href="/api/csv/template" className="inline-block font-semibold text-brand hover:underline">
          Unduh template CSV
        </a>
      </>
    )
  }

  return (
    <Modal title="Impor transaksi dari CSV" onClose={onClose} wide>
      <div className="space-y-4">{content()}</div>
    </Modal>
  )
}

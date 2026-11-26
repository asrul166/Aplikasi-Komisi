import { useState } from 'react'
import { Button, FormError, Modal } from './ui'

export function Confirm({
  title,
  message,
  action,
  onConfirm,
  onClose,
}: {
  title: string
  message: string
  action: string
  onConfirm: () => Promise<unknown>
  onClose: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  async function run() {
    setBusy(true)
    try {
      await onConfirm()
      onClose()
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-ink-soft">{message}</p>
        <FormError message={error} />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Batal</Button>
          <Button variant="danger" busy={busy} onClick={run}>
            {action}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

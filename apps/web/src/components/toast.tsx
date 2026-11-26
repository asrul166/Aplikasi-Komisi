/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

type Notify = (message: string, tone?: 'success' | 'error') => void
const ToastContext = createContext<Notify>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string; tone: string }[]>([])

  const notify = useCallback<Notify>((message, tone = 'success') => {
    const id = Date.now() + Math.random()
    setItems((list) => [...list, { id, message, tone }])
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 4500)
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div role="status" className="fixed bottom-4 right-4 z-[90] flex max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} className="card flex items-start gap-3 px-4 py-3 shadow-lg">
            <Icon
              name={t.tone === 'error' ? 'error' : 'check_circle'}
              className={t.tone === 'error' ? 'text-danger' : 'text-brand'}
            />
            <p>{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

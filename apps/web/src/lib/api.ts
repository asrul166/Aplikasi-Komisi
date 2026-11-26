export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Better Auth answers in English; translate the cases a user can hit.
const AUTH_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Email atau password salah',
  INVALID_EMAIL: 'Email tidak valid',
  INVALID_PASSWORD: 'Password saat ini salah',
  PASSWORD_TOO_SHORT: 'Password minimal 8 karakter',
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData
  const response = await fetch(`/api${path}`, {
    method,
    headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  }).catch(() => {
    throw new ApiError('Tidak bisa terhubung ke server', 0)
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const detail = data?.details?.[0]
    const message =
      (detail && `${detail.path}: ${detail.message}`) ||
      data?.error ||
      AUTH_MESSAGES[data?.code] ||
      (response.status === 429 ? 'Terlalu banyak percobaan, coba lagi sebentar' : null) ||
      data?.message ||
      'Server tidak merespons dengan benar'
    throw new ApiError(message, response.status)
  }
  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown = {}) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}

export function query(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}

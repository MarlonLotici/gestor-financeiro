function resolveBase() {
  // Resolvida em build-time quando VITE_API_URL está definida nas env vars da Railway
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL

  // Fallback de runtime: em produção (fora do localhost) assume que a API
  // está na mesma origem que o frontend (mesmo serviço Railway)
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return window.location.origin
  }

  // Dev local: proxy do Vite encaminha /api/* → localhost:3001
  return ''
}

export const API_BASE_URL = resolveBase()

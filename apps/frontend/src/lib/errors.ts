import { isAxiosError } from 'axios'

const DEFAULT_SERVER_MESSAGE = 'Serverdə xəta baş verdi. Bir az sonra yenidən yoxla.'

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
  serverMessage = DEFAULT_SERVER_MESSAGE,
): string {
  if (!isAxiosError(error)) return fallback

  if (!error.response) return 'Serverə qoşulmaq mümkün olmadı. Bağlantını yoxla.'

  const { status } = error.response
  if (status === 429) return 'Çox sayda cəhd edildi. Bir az gözləyib yenidən yoxla.'
  if (status >= 500) return serverMessage

  return fallback
}

export const getAuthErrorMessage = getApiErrorMessage
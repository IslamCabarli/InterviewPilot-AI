import { isAxiosError } from 'axios'

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback

  if (!error.response) return 'Serverə qoşulmaq mümkün olmadı. Bağlantını yoxla.'

  const { status } = error.response
  if (status === 429) return 'Çox sayda cəhd edildi. Bir az gözləyib yenidən yoxla.'
  if (status >= 500) return 'Serverdə xəta baş verdi. Bir az sonra yenidən yoxla.'

  return fallback
}
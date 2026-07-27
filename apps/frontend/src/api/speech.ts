import { api } from '../lib/axios'

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  const res = await api.post<{ text: string }>('/speech/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data.text
}
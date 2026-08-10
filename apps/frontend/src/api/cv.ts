import { api } from '../lib/axios'

export const uploadCv = async (file: File) => {
  const formData = new FormData()
  formData.append('cv', file)

  const res = await api.post<{ message: string; preview: string }>('/cv/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const getCvStatus = async () => {
  const res = await api.get<{ hasCv: boolean; uploadedAt: string | null }>('/cv/status')
  return res.data
}

export const deleteCv = async () => {
  const res = await api.delete('/cv')
  return res.data
}
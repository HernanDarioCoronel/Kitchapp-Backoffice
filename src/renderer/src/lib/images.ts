import apiClient from './api-client'

export interface ImageUploadResponse {
  filename: string
  url: string
  contentType: string
  size: number
}

export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<ImageUploadResponse>('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

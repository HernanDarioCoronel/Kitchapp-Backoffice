import placeholderImg from '@resources/placeholder.jpg'
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return placeholderImg
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return `${API_BASE}/images/${imageUrl}`
}

export default getImageUrl

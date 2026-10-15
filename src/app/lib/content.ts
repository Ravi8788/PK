export interface PortfolioItem {
  id: string
  title?: string
  category?: string
  image?: string
  image_url?: string
  thumbnail_url?: string
  description?: string
  media_type?: 'image' | 'video'
  created_at?: number
}

export interface ReelItem {
  id: string
  title?: string
  thumbnail?: string
  thumbnail_url?: string
  views?: string
  description?: string
  videoUrl?: string
  video_url?: string
  instagram_url?: string
}

export interface TestimonialItem {
  id: string
  name?: string
  client_name?: string
  role?: string
  project_type?: string
  image?: string
  client_image?: string
  rating?: number
  text?: string
}

export interface LightboxItem {
  id: string
  type: 'image' | 'video'
  src: string
  poster?: string
  title: string
  category?: string
  description?: string
  alt: string
}

export function loadApi() {
  return import('@/app/utils/api')
}

export function isVideoUrl(url: string) {
  if (!url) return false
  return (
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) ||
    /\/video\/upload\//i.test(url) ||
    /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
  )
}

export function portfolioSrc(item: PortfolioItem) {
  return item.image_url || item.image || ''
}

export function portfolioType(item: PortfolioItem): 'image' | 'video' {
  const src = portfolioSrc(item)
  if (item.media_type === 'video' || isVideoUrl(src)) return 'video'
  return 'image'
}

export function portfolioAlt(item: PortfolioItem, index: number) {
  return item.title || `${item.category || 'Frame'} ${String(index + 1).padStart(2, '0')}`
}

export function toLightboxItem(item: PortfolioItem, index: number): LightboxItem {
  const type = portfolioType(item)
  return {
    id: item.id,
    type,
    src: portfolioSrc(item),
    poster: item.thumbnail_url,
    title: item.title || portfolioAlt(item, index),
    category: item.category,
    description: item.description,
    alt: portfolioAlt(item, index),
  }
}

export function reelVideo(reel: ReelItem) {
  return reel.video_url || reel.videoUrl || ''
}

export function reelPoster(reel: ReelItem) {
  return reel.thumbnail_url || reel.thumbnail || ''
}

export function reelInstagram(reel: ReelItem) {
  if (reel.instagram_url) return reel.instagram_url
  const video = reelVideo(reel)
  return /instagram\.com/i.test(video) ? video : ''
}

function withId<T extends { id?: string }>(data: unknown): T[] {
  if (!Array.isArray(data)) return []
  return data.filter((item): item is T => Boolean(item && typeof item === 'object' && 'id' in item))
}

export const asPortfolio = (data: unknown) => withId<PortfolioItem>(data)
export const asReels = (data: unknown) => withId<ReelItem>(data)
export const asTestimonials = (data: unknown) => withId<TestimonialItem>(data)

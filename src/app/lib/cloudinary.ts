const UPLOAD_TOKEN = '/upload/'

export function isCloudinaryUrl(url: string | undefined | null): url is string {
  return Boolean(url && url.includes('res.cloudinary.com') && url.includes(UPLOAD_TOKEN))
}

export function cloudinaryUrl(url: string, options: { width?: number; blur?: boolean } = {}) {
  if (!isCloudinaryUrl(url)) return url
  const parts = options.blur
    ? ['e_blur:1000', 'q_auto', 'f_auto', 'w_32']
    : ['f_auto', 'q_auto', 'c_limit', options.width ? `w_${options.width}` : ''].filter(Boolean)
  return url.replace(UPLOAD_TOKEN, `${UPLOAD_TOKEN}${parts.join(',')}/`)
}

export function cloudinarySrcSet(url: string, widths: number[]) {
  if (!isCloudinaryUrl(url)) return undefined
  return widths.map((width) => `${cloudinaryUrl(url, { width })} ${width}w`).join(', ')
}

export function textureUrl(url: string) {
  return cloudinaryUrl(url, { width: 1024 })
}

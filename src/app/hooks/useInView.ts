import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const rootMargin = options?.rootMargin
  const threshold = options?.threshold

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: options?.root, rootMargin, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [options?.root, rootMargin, threshold])

  return { ref, inView }
}

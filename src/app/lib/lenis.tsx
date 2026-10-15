import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from '@/app/lib/gsap'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function scrollToTarget(target: string | HTMLElement, lenis: Lenis | null) {
  const node = typeof target === 'string' ? document.querySelector(target) : target
  if (!node) return
  if (lenis) {
    lenis.scrollTo(node as HTMLElement, { offset: -12 })
    return
  }
  node.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduced) {
      setLenis(null)
      return
    }

    const instance = new Lenis({
      autoRaf: false,
      syncTouch: false,
      lerp: 0.085,
      smoothWheel: true,
    })

    instance.on('scroll', ScrollTrigger.update)
    const onTick = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh).catch(() => undefined)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(onTick)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

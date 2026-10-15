import { useEffect, useRef, useState } from 'react'
import { useMedia } from '@/app/hooks/useMedia'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'

export function CustomCursor() {
  const fine = useMedia('(pointer: fine)')
  const reduced = useReducedMotion()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const enabled = fine && !reduced

  useEffect(() => {
    document.documentElement.classList.toggle('pk-cursor-ready', enabled)
    const root = document.querySelector('.pk-public')
    root?.classList.toggle('pk-fine-cursor', enabled)
    return () => {
      document.documentElement.classList.remove('pk-cursor-ready')
      root?.classList.remove('pk-fine-cursor')
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    const pos = { x: 0, y: 0 }
    const ringPos = { x: 0, y: 0 }
    let frame = 0

    const onMove = (event: PointerEvent) => {
      pos.x = event.clientX
      pos.y = event.clientY
      const target = event.target instanceof Element ? event.target.closest('[data-cursor]') : null
      setLabel(target?.getAttribute('data-cursor') || '')
    }

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={dot} className="pk-cursor" aria-hidden="true" />
      <div ref={ring} className={`pk-cursor-ring ${label ? 'is-hot' : ''}`} aria-hidden="true">
        <span>{label}</span>
      </div>
    </>
  )
}

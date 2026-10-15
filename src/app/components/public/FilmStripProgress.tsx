import { useEffect, useState } from 'react'
import { publicSections } from '@/app/content/siteCopy'
import { useMedia } from '@/app/hooks/useMedia'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'

export function FilmStripProgress() {
  const desktop = useMedia('(min-width: 1024px)')
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const nodes = publicSections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const next = publicSections.findIndex((section) => section.id === visible.target.id)
        if (next >= 0) setIndex(next)
      },
      { threshold: [0.3, 0.5] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) return
    setFlash(true)
    const timer = window.setTimeout(() => setFlash(false), 160)
    return () => window.clearTimeout(timer)
  }, [index, reduced])

  if (!desktop) return null

  return (
    <>
      <div className="pointer-events-none fixed top-1/2 right-4 z-40 -translate-y-1/2" aria-hidden="true">
        <p className="font-meta text-[10px] tracking-[0.2em] text-paper-dim uppercase [writing-mode:vertical-rl]">
          Frame {String(index + 1).padStart(2, '0')} / {String(publicSections.length).padStart(2, '0')}
        </p>
      </div>
      {flash && <div className="pointer-events-none fixed inset-0 z-30 bg-paper/10" />}
    </>
  )
}

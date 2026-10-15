import { useState } from 'react'
import { siteCopy } from '@/app/content/siteCopy'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'

export function Marquee() {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const labels = [...siteCopy.marquee, ...siteCopy.marquee]

  if (reduced) {
    return (
      <div className="border-y border-hair bg-ink py-4">
        <p className="font-meta px-5 text-center text-[11px] tracking-[0.18em] text-paper uppercase">
          {siteCopy.marquee.join(' · ')}
        </p>
      </div>
    )
  }

  return (
    <div
      className={`pk-marquee overflow-hidden border-y border-hair bg-ink py-3 ${paused ? 'is-paused' : ''}`}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerCancel={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="pk-marquee-track">
        {labels.map((label, index) => (
          <span key={`${label}-${index}`} className="font-meta px-4 text-[11px] tracking-[0.22em] text-paper uppercase">
            {label}
            <span className="px-4 text-acid">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

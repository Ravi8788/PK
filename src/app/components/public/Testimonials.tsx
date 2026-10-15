import { useState } from 'react'
import { Star, User } from 'lucide-react'
import { siteCopy } from '@/app/content/siteCopy'
import { useTestimonialsData } from '@/app/lib/publicData'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'
import type { TestimonialItem } from '@/app/lib/content'
import { ShareExperience } from './ShareExperience'
import { MagneticButton } from './MagneticButton'

export function Testimonials() {
  const { items, status, usingDemo, reload } = useTestimonialsData()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const rowA = items
  const rowB = items.length > 1 ? [...items].reverse() : items

  return (
    <section id="testimonials" className="pk-section overflow-hidden bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <p className="font-meta text-[11px] tracking-[0.24em] text-acid uppercase">
          {siteCopy.testimonials.index} / {siteCopy.testimonials.eyebrow}
        </p>
        <h2 className="font-display mt-3 text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase">
          {siteCopy.testimonials.title}
        </h2>
        <p className="mt-4 max-w-xl text-paper-dim">{siteCopy.testimonials.text}</p>
        {usingDemo && (
          <p className="font-meta mt-3 text-[11px] tracking-[0.16em] text-acid uppercase">{siteCopy.emptyDevNote}</p>
        )}
      </div>
      {status === 'loading' && <div className="mx-5 mt-8 h-40 animate-pulse bg-ink-2" />}
      {status === 'error' && (
        <div className="px-5">
          <p className="text-paper-dim">{siteCopy.testimonials.error}</p>
          <button type="button" className="mt-4 min-h-11 rounded-full border border-hair px-5" onClick={reload}>
            Retry
          </button>
        </div>
      )}
      {status !== 'loading' && status !== 'error' && items.length === 0 && (
        <p className="mt-10 px-5 font-display text-3xl tracking-[-0.04em] uppercase">{siteCopy.testimonials.empty}</p>
      )}
      {items.length > 0 && (
        <div
          className={`mt-10 space-y-4 ${paused ? 'is-paused' : ''}`}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
        >
          <TestimonialRow items={rowA} paused={paused || reduced} />
          <TestimonialRow items={rowB} reverse paused={paused || reduced} />
        </div>
      )}
      <div className="mx-auto mt-10 max-w-[1600px] px-5 sm:px-8">
        <MagneticButton
          className="min-h-11 rounded-full bg-acid px-6 font-meta text-[12px] tracking-[0.14em] text-ink uppercase"
          onClick={() => setOpen(true)}
        >
          {siteCopy.testimonials.share}
        </MagneticButton>
        <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {siteCopy.testimonials.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-display text-4xl text-acid">{stat.value}</dt>
              <dd className="text-sm text-paper-dim">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <ShareExperience open={open} onClose={() => setOpen(false)} onSuccess={reload} />
    </section>
  )
}

function TestimonialRow({ items, reverse = false, paused }: { items: TestimonialItem[]; reverse?: boolean; paused: boolean }) {
  const loop = [...items, ...items]
  return (
    <div className={`pk-marquee overflow-hidden ${paused ? 'is-paused' : ''}`}>
      <div className={`pk-marquee-track ${reverse ? 'is-reverse' : ''}`}>
        {loop.map((item, index) => (
          <Card key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}

function Card({ item }: { item: TestimonialItem }) {
  const name = item.client_name || item.name || 'Client'
  const role = item.project_type || item.role || ''
  const image = item.client_image || item.image
  const rating = item.rating || 0
  return (
    <article className="mx-2 w-[min(78vw,360px)] border border-hair bg-[var(--glass)] p-5 backdrop-blur-md">
      <div className="flex gap-1" aria-label={`${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} size={14} className={index < rating ? 'fill-acid text-acid' : 'text-paper-faint'} />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed">“{item.text}”</p>
      <div className="mt-5 flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-ink">
          {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <User size={16} />}
        </span>
        <span>
          <span className="block font-semibold">{name}</span>
          <span className="font-meta text-[10px] tracking-[0.14em] text-paper-dim uppercase">{role}</span>
        </span>
      </div>
    </article>
  )
}

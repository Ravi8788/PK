import { useEffect, useRef } from 'react'
import { siteCopy } from '@/app/content/siteCopy'
import { gsap } from '@/app/lib/gsap'
import { scrollToTarget, useLenis } from '@/app/lib/lenis'
import { useMedia } from '@/app/hooks/useMedia'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'
import { MagneticButton } from './MagneticButton'

export function Services() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const desktop = useMedia('(min-width: 768px)')
  const lenis = useLenis()
  const pin = desktop && !reduced

  useEffect(() => {
    if (!pin || !root.current) return
    const cards = Array.from(root.current.querySelectorAll<HTMLElement>('[data-service]'))
    const context = gsap.context(() => {
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return
        gsap.to(card, {
          scale: 0.94,
          opacity: 0.45,
          scrollTrigger: {
            trigger: card,
            start: 'top 14%',
            end: 'bottom 18%',
            scrub: true,
          },
        })
      })
    }, root)
    return () => context.revert()
  }, [pin])

  return (
    <section id="services" ref={root} className="pk-section bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <p className="font-meta text-[11px] tracking-[0.24em] text-acid uppercase">
          {siteCopy.services.index} / {siteCopy.services.eyebrow}
        </p>
        <h2 className="font-display mt-3 text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase">
          {siteCopy.services.title}
        </h2>
        <p className="mt-4 max-w-xl text-paper-dim">{siteCopy.services.text}</p>
        <div className="relative mt-10">
          {siteCopy.services.items.map((service, index) => (
            <article
              key={service.title}
              data-service
              className={`mb-4 border border-hair bg-ink-2 p-6 transition-shadow duration-500 hover:shadow-[0_0_80px_rgba(122,92,255,0.28)] md:p-10 ${pin ? 'md:sticky' : ''}`}
              style={pin ? { top: `calc(6.5rem + ${index * 14}px)` } : undefined}
            >
              <p className="font-meta text-[12px] tracking-[0.22em] text-acid">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="font-display mt-3 max-w-3xl text-[clamp(1.8rem,4vw,3.4rem)] leading-[0.95] font-semibold tracking-[-0.04em] uppercase">
                {service.title}
              </h3>
              <p className="mt-4 max-w-2xl text-paper-dim">{service.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <li key={feature} className="font-meta border border-hair px-3 py-2 text-[10px] tracking-[0.14em] uppercase">
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <p className="text-paper-dim">{siteCopy.services.ctaNote}</p>
          <MagneticButton
            className="mt-4 min-h-11 rounded-full bg-acid px-6 font-meta text-[12px] tracking-[0.14em] text-ink uppercase"
            onClick={() => scrollToTarget('#contact', lenis)}
          >
            {siteCopy.services.cta}
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

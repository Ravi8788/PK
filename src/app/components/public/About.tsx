import { useEffect, useRef, useState } from 'react'
import { siteCopy } from '@/app/content/siteCopy'
import { gsap } from '@/app/lib/gsap'
import { useInView } from '@/app/hooks/useInView'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.6 })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setCurrent(value)
      return
    }
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900)
      setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value])

  return (
    <span ref={ref}>
      {current}
      {suffix}
    </span>
  )
}

export function About() {
  const copy = siteCopy.about
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const words = copy.paragraphs[0].split(' ')

  useEffect(() => {
    const section = root.current
    if (!section || reduced) return
    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.04,
          scrollTrigger: {
            trigger: '[data-statement]',
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: true,
          },
        },
      )
      gsap.fromTo(
        '[data-portrait]',
        { clipPath: 'inset(12% 12% 12% 12%)', yPercent: 8 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-portrait]',
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
          },
        },
      )
    }, section)
    return () => context.revert()
  }, [reduced])

  return (
    <section id="about" ref={root} className="pk-section bg-ink py-20 md:py-28">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
        <div className="relative overflow-hidden">
          <img
            data-portrait
            src={copy.portrait}
            alt={copy.portraitAlt}
            width={900}
            height={1200}
            className="aspect-[3/4] w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-6">
            <p className="font-meta text-[11px] tracking-[0.2em] text-acid uppercase">{copy.role}</p>
            <p className="font-display text-3xl tracking-[-0.04em] uppercase">{copy.name}</p>
          </div>
        </div>
        <div>
          <p className="font-meta text-[11px] tracking-[0.24em] text-acid uppercase">
            {copy.index} / {copy.eyebrow}
          </p>
          <h2 className="font-display mt-3 text-[clamp(2.4rem,6vw,5rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase">
            {copy.title}
          </h2>
          <p data-statement className="mt-6 text-xl leading-snug text-paper md:text-2xl">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} data-word className={reduced ? undefined : 'opacity-20'}>
                {word}{' '}
              </span>
            ))}
          </p>
          {copy.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-4 text-paper-dim">
              {paragraph}
            </p>
          ))}
          <p className="mt-8 font-semibold">{copy.specializationsLabel}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {copy.specializations.map((skill) => (
              <li key={skill} className="border border-hair px-3 py-2 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <dl className="mx-auto mt-14 grid max-w-[1600px] grid-cols-2 gap-4 px-5 sm:px-8 lg:grid-cols-4">
        {copy.stats.map((stat) => (
          <div key={stat.label} className="border border-hair bg-ink-2 p-5">
            <dt className="font-display text-4xl tracking-[-0.04em]">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </dt>
            <dd className="mt-2 text-sm text-paper-dim">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

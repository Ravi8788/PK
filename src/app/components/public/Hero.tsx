import { ArrowRight } from 'lucide-react'
import { siteCopy } from '@/app/content/siteCopy'
import { scrollToTarget, useLenis } from '@/app/lib/lenis'
import { MagneticButton } from './MagneticButton'
import { Viewfinder } from './Viewfinder'

export function Hero() {
  const lenis = useLenis()

  return (
    <section id="home" className="pk-section relative bg-ink">
      <div className="relative h-[100svh] overflow-hidden">
        <img
          src="/images/hero-camera.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70" aria-hidden="true" />
        <Viewfinder tone="acid" />
        <div className="pointer-events-none relative z-30 flex h-full items-center justify-center px-5 pt-20 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
          <div className="mx-auto w-full max-w-4xl text-center">
            <img
              src="/images/logo.png"
              alt="PK Graphics"
              className="mx-auto h-auto w-36 object-contain sm:w-44 md:w-52"
            />
            <div className="mx-auto mt-3 h-0.5 w-16 bg-acid" />
            <h1 className="font-display mt-5 text-[clamp(2rem,4.8vw,3.5rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-paper">
              {siteCopy.hero.line1}
              <span className="mt-1 block text-acid">{siteCopy.hero.line2}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper/85 sm:text-lg">
              {siteCopy.hero.support}
            </p>
            <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-acid px-8 text-base font-semibold text-ink"
                onClick={() => scrollToTarget('#portfolio', lenis)}
              >
                {siteCopy.hero.primaryCta}
                <ArrowRight size={18} />
              </MagneticButton>
              <MagneticButton
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 px-8 text-base font-semibold text-paper"
                onClick={() => scrollToTarget('#contact', lenis)}
              >
                {siteCopy.hero.secondaryCta}
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

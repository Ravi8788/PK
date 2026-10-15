import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { siteCopy } from '@/app/content/siteCopy'
import { portfolioSrc, portfolioType } from '@/app/lib/content'
import { scrollToTarget, useLenis } from '@/app/lib/lenis'
import { ScrollTrigger } from '@/app/lib/gsap'
import { useDeviceTier } from '@/app/hooks/useDeviceTier'
import { useInView } from '@/app/hooks/useInView'
import { useMedia } from '@/app/hooks/useMedia'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'
import { usePortfolioData } from '@/app/lib/publicData'
import { MagneticButton } from './MagneticButton'
import { SmartImage } from './SmartImage'
import { Viewfinder } from './Viewfinder'
import { SceneErrorBoundary } from '@/app/three/ErrorBoundary'

const HeroTunnel = lazy(() => import('@/app/three/HeroTunnel'))

function FallbackFrames({ images }: { images: string[] }) {
  const frames = images.slice(0, 4)
  if (!frames.length) {
    return (
      <div className="absolute inset-[12%] border border-hair" aria-hidden="true">
        <div className="absolute inset-8 border border-hair/70" />
        <div className="absolute inset-16 bg-[radial-gradient(circle_at_30%_20%,rgba(122,92,255,0.35),transparent_55%)]" />
      </div>
    )
  }
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {frames.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="absolute overflow-hidden border border-hair/60 shadow-2xl"
          style={{
            width: '46%',
            aspectRatio: '16 / 10',
            left: `${10 + index * 8}%`,
            top: `${18 + index * 6}%`,
            transform: `rotate(${index % 2 === 0 ? -4 : 3}deg)`,
            opacity: 0.85,
          }}
        >
          <SmartImage src={src} alt="" width={800} height={500} priority={index === 0} />
        </div>
      ))}
    </div>
  )
}

export function Hero() {
  const { items } = usePortfolioData()
  const images = items.filter((item) => portfolioType(item) === 'image' && portfolioSrc(item)).map((item) => portfolioSrc(item))
  const tier = useDeviceTier()
  const reduced = useReducedMotion()
  const desktop = useMedia('(min-width: 1024px)')
  const lenis = useLenis()
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef(0)
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ rootMargin: '200px' })
  const [load3d, setLoad3d] = useState(false)
  const pin = desktop && !reduced && tier !== 'low'

  useEffect(() => {
    if (tier === 'low') return
    const start = () => setLoad3d(true)
    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(start, { timeout: 1200 })
      return () => win.cancelIdleCallback?.(id)
    }
    const timer = window.setTimeout(start, 450)
    return () => window.clearTimeout(timer)
  }, [tier])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !pin) return
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=90%',
      pin: true,
      scrub: 0.45,
      anticipatePin: 1,
      onUpdate: (self) => {
        velocityRef.current = self.getVelocity() / 3000
        progressRef.current = self.progress
      },
    })
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('orientationchange', refresh)
    return () => {
      trigger.kill()
      window.removeEventListener('orientationchange', refresh)
    }
  }, [pin])

  return (
    <section id="home" ref={sectionRef} className="pk-section relative bg-ink">
      <div
        ref={viewRef}
        className="relative h-[100svh] overflow-hidden"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          pointerRef.current = {
            x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
            y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
          }
        }}
      >
        <img
          src="/images/hero-camera.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70" aria-hidden="true" />
        {images.length > 0 &&
          (tier === 'low' || !load3d ? (
            <FallbackFrames images={images} />
          ) : (
            <SceneErrorBoundary fallback={<FallbackFrames images={images} />}>
              <Suspense fallback={<FallbackFrames images={images} />}>
                <HeroTunnel
                  images={images}
                  progressRef={progressRef}
                  pointerRef={pointerRef}
                  velocityRef={velocityRef}
                  tier={tier}
                  autoDrift={!pin}
                  active={inView}
                />
              </Suspense>
            </SceneErrorBoundary>
          ))}
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

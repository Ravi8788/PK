import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
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

function Timecode() {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) {
      if (ref.current) ref.current.textContent = '00:00:12:08'
      return
    }
    let frames = 12 * 24 + 8
    const timer = window.setInterval(() => {
      frames += 2
      const fps = 24
      const totalSeconds = Math.floor(frames / fps)
      const ff = frames % fps
      const hh = Math.floor(totalSeconds / 3600)
      const mm = Math.floor((totalSeconds % 3600) / 60)
      const ss = totalSeconds % 60
      const pad = (value: number) => String(value).padStart(2, '0')
      if (ref.current) ref.current.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`
    }, 1000 / 12)
    return () => window.clearInterval(timer)
  }, [reduced])

  return <span ref={ref}>00:00:12:08</span>
}

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
  const saveData = useMedia('(prefers-reduced-data: reduce)')
  const lenis = useLenis()
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ rootMargin: '200px' })
  const [load3d, setLoad3d] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reduced || saveData) video.pause()
  }, [reduced, saveData, videoReady])

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
        <video
          ref={videoRef}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady && !reduced ? 'opacity-40' : 'opacity-0'
          }`}
          autoPlay={!reduced && !saveData}
          muted
          loop
          playsInline
          preload={saveData ? 'none' : 'metadata'}
          poster="/images/pk-protrait.jpeg"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src="/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(122,92,255,0.28),transparent_42%)]"
          aria-hidden="true"
        />
        {tier === 'low' || !load3d ? (
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
        )}
        <Viewfinder />
        <div className="pointer-events-none relative z-30 flex h-full flex-col justify-end px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-10 md:justify-center">
          <p className="font-meta mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-[0.22em] text-paper uppercase">
            <span className="inline-flex items-center gap-2">
              <span className="pk-rec inline-block h-2 w-2 rounded-full bg-rec" /> REC
            </span>
            <Timecode />
            <span>{siteCopy.hero.meta}</span>
          </p>
          <h1 className="font-display max-w-full text-[clamp(3.1rem,14vw,11rem)] leading-[0.82] font-semibold tracking-[-0.045em] text-paper uppercase">
            {['PK', 'GRAPHICS'].map((line) => (
              <span key={line} className="block">
                {line.split('').map((letter, index) => (
                  <span key={`${line}-${letter}-${index}`} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={reduced ? false : { y: '110%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.8, delay: 0.045 * index, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {letter}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="font-meta mt-5 text-[12px] tracking-[0.28em] text-acid uppercase sm:text-sm">
            {siteCopy.hero.subtitle}
          </p>
          <p className="mt-4 max-w-xl text-sm text-paper-dim sm:text-base">{siteCopy.hero.support}</p>
          <div className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticButton
              className="min-h-11 rounded-full bg-acid px-6 font-meta text-[12px] tracking-[0.16em] text-ink uppercase"
              onClick={() => scrollToTarget('#portfolio', lenis)}
            >
              {siteCopy.hero.primaryCta}
            </MagneticButton>
            <MagneticButton
              className="min-h-11 rounded-full border border-paper/50 px-6 font-meta text-[12px] tracking-[0.16em] text-paper uppercase"
              onClick={() => scrollToTarget('#contact', lenis)}
            >
              {siteCopy.hero.secondaryCta}
            </MagneticButton>
          </div>
          <p className="font-meta mt-10 hidden items-center gap-3 text-[10px] tracking-[0.28em] text-paper-dim uppercase md:flex">
            {siteCopy.hero.scrollHint}
            <span className="inline-block h-px w-16 bg-paper/50" />
          </p>
        </div>
      </div>
    </section>
  )
}

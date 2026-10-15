import { lazy, Suspense, useState } from 'react'
import { siteCopy } from '@/app/content/siteCopy'
import { portfolioSrc, portfolioType, toLightboxItem } from '@/app/lib/content'
import { usePortfolioData } from '@/app/lib/publicData'
import { useDeviceTier } from '@/app/hooks/useDeviceTier'
import { useInView } from '@/app/hooks/useInView'
import { useMedia } from '@/app/hooks/useMedia'
import { SceneErrorBoundary } from '@/app/three/ErrorBoundary'
import { Lightbox } from './Lightbox'
import { SmartImage } from './SmartImage'

const CurvedWall = lazy(() => import('@/app/three/CurvedWall'))

export function Featured() {
  const { items, status, usingDemo } = usePortfolioData()
  const images = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => portfolioType(item) === 'image' && portfolioSrc(item))
    .slice(0, 9)
  const tier = useDeviceTier()
  const desktop = useMedia('(min-width: 1024px)')
  const webgl = desktop && tier !== 'low' && images.length > 0
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '240px' })
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)
  const lightboxItems = images.map(({ item, index }) => toLightboxItem(item, index))

  return (
    <section id="featured" className="pk-section bg-ink py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <p className="font-meta text-[11px] tracking-[0.24em] text-acid uppercase">
          {siteCopy.featured.index} / {siteCopy.featured.eyebrow}
        </p>
        <h2 className="font-display mt-3 text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase">
          {siteCopy.featured.title}
        </h2>
        <p className="mt-4 max-w-xl text-paper-dim">{siteCopy.featured.text}</p>
        {usingDemo && <p className="font-meta mt-3 text-[11px] tracking-[0.16em] text-acid uppercase">{siteCopy.emptyDevNote}</p>}
      </div>
      <div ref={ref} className="relative mt-8">
        {status === 'loading' && <div className="mx-auto h-[52svh] max-w-[1600px] animate-pulse bg-ink-2" />}
        {status === 'error' && <p className="px-5 text-paper-dim">{siteCopy.portfolio.error}</p>}
        {(status === 'empty' || status === 'ready') && images.length === 0 && (
          <p className="px-5 text-paper-dim">{siteCopy.portfolio.empty}</p>
        )}
        {webgl && (
          <div className="relative h-[68svh]" data-cursor="DRAG">
            <SceneErrorBoundary fallback={<SnapRow images={images.map(({ item }) => portfolioSrc(item))} onOpen={(index) => { setCurrent(index); setOpen(true) }} />}>
              <Suspense fallback={<div className="h-full animate-pulse bg-ink-2" />}>
                <CurvedWall
                  images={images.map(({ item }) => portfolioSrc(item))}
                  tier={tier}
                  active={inView}
                  onSelect={(index) => {
                    setCurrent(index)
                    setOpen(true)
                  }}
                />
              </Suspense>
            </SceneErrorBoundary>
          </div>
        )}
        {!webgl && images.length > 0 && (
          <SnapRow
            images={images.map(({ item }) => portfolioSrc(item))}
            titles={images.map(({ item, index }) => item.title || `Frame ${index + 1}`)}
            onOpen={(index) => {
              setCurrent(index)
              setOpen(true)
            }}
          />
        )}
      </div>
      <Lightbox items={lightboxItems} index={current} open={open} onClose={() => setOpen(false)} onIndex={setCurrent} />
    </section>
  )
}

function SnapRow({
  images,
  titles = [],
  onOpen,
}: {
  images: string[]
  titles?: string[]
  onOpen: (index: number) => void
}) {
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8">
      {images.map((src, index) => (
        <button
          key={`${src}-${index}`}
          type="button"
          data-cursor="VIEW"
          onClick={() => onOpen(index)}
          className="relative aspect-[4/5] w-[78vw] max-w-[420px] shrink-0 snap-center overflow-hidden bg-ink-2 text-left"
        >
          <SmartImage src={src} alt={titles[index] || `Featured frame ${index + 1}`} width={800} height={1000} priority={index < 2} />
          <span className="font-meta absolute bottom-3 left-3 text-[10px] tracking-[0.18em] uppercase">
            {String(index + 1).padStart(2, '0')}
          </span>
        </button>
      ))}
    </div>
  )
}

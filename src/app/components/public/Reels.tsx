import { useEffect, useRef, useState } from 'react'
import { Instagram } from 'lucide-react'
import { siteCopy } from '@/app/content/siteCopy'
import { reelInstagram, reelPoster, reelVideo, type ReelItem } from '@/app/lib/content'
import { useReelsData } from '@/app/lib/publicData'
import { useInView } from '@/app/hooks/useInView'
import { useMedia } from '@/app/hooks/useMedia'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'
import { SmartImage } from './SmartImage'
import { ReelPlayer } from './ReelPlayer'

export function Reels() {
  const { items, status, reload } = useReelsData()
  const railRef = useRef<HTMLDivElement>(null)
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 })
  const fine = useMedia('(pointer: fine)')
  const reduced = useReducedMotion()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dot, setDot] = useState(0)
  const [player, setPlayer] = useState<ReelItem | null>(null)
  const drag = useRef({ down: false, x: 0, left: 0 })

  useEffect(() => {
    const rail = railRef.current
    if (!rail || fine || reduced) return
    const cards = Array.from(rail.querySelectorAll<HTMLElement>('[data-reel]'))
    const pick = () => {
      const railBox = rail.getBoundingClientRect()
      const center = railBox.left + railBox.width / 2
      let bestId: string | null = null
      let bestDistance = Number.POSITIVE_INFINITY
      cards.forEach((card) => {
        const box = card.getBoundingClientRect()
        const distance = Math.abs(box.left + box.width / 2 - center)
        if (distance < bestDistance) {
          bestDistance = distance
          bestId = card.dataset.reel || null
        }
      })
      setActiveId(inView ? bestId : null)
    }
    pick()
    rail.addEventListener('scroll', pick, { passive: true })
    return () => rail.removeEventListener('scroll', pick)
  }, [fine, reduced, inView, items.length])

  useEffect(() => {
    if (!inView) setActiveId(null)
  }, [inView])

  const onScroll = () => {
    const rail = railRef.current
    if (!rail) return
    const width = rail.clientWidth || 1
    setDot(Math.round(rail.scrollLeft / (width * 0.72)))
  }

  return (
    <section id="reels" ref={ref} className="pk-section bg-ink py-20 md:py-28">
      <div className="mx-auto mb-8 flex max-w-[1600px] flex-wrap items-end justify-between gap-4 px-5 sm:px-8">
        <div>
          <p className="font-meta text-[11px] tracking-[0.24em] text-acid uppercase">
            {siteCopy.reels.index} / {siteCopy.reels.eyebrow}
          </p>
          <h2 className="font-display mt-3 text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase">
            {siteCopy.reels.title}
          </h2>
          <p className="mt-4 max-w-xl text-paper-dim">{siteCopy.reels.text}</p>
        </div>
        <a
          href={siteCopy.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-hair px-5 font-meta text-[11px] tracking-[0.14em] uppercase"
        >
          <Instagram size={16} /> {siteCopy.reels.follow}
        </a>
      </div>

      {status === 'loading' && (
        <div className="flex gap-4 px-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[9/16] w-[70vw] max-w-[280px] shrink-0 animate-pulse bg-ink-2" />
          ))}
        </div>
      )}
      {status === 'error' && (
        <div className="px-5">
          <p className="text-paper-dim">{siteCopy.reels.error}</p>
          <button type="button" className="mt-4 min-h-11 rounded-full border border-hair px-5" onClick={reload}>
            Retry
          </button>
        </div>
      )}
      {status !== 'loading' && status !== 'error' && items.length === 0 && (
        <p className="px-5 font-display text-3xl tracking-[-0.04em] uppercase">{siteCopy.reels.empty}</p>
      )}

      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8"
        style={{ touchAction: 'pan-x pan-y' }}
        onScroll={onScroll}
        onPointerDown={(event) => {
          if (!fine || !railRef.current) return
          drag.current = { down: true, x: event.clientX, left: railRef.current.scrollLeft }
        }}
        onPointerMove={(event) => {
          if (!drag.current.down || !railRef.current) return
          railRef.current.scrollLeft = drag.current.left - (event.clientX - drag.current.x)
        }}
        onPointerUp={() => {
          drag.current.down = false
        }}
      >
        {items.map((reel) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            active={activeId === reel.id && inView && !reduced}
            fine={fine}
            onHover={(id) => {
              if (fine && inView) setActiveId(id)
            }}
            onOpen={() => setPlayer(reel)}
          />
        ))}
      </div>
      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
          {items.map((reel, index) => (
            <span key={reel.id} className={`h-1.5 w-6 ${index === dot ? 'bg-acid' : 'bg-hair'}`} />
          ))}
        </div>
      )}
      <ReelPlayer
        open={Boolean(player)}
        title={player?.title || 'Reel'}
        src={player ? reelVideo(player) : ''}
        onClose={() => setPlayer(null)}
      />
    </section>
  )
}

function ReelCard({
  reel,
  active,
  fine,
  onHover,
  onOpen,
}: {
  reel: ReelItem
  active: boolean
  fine: boolean
  onHover: (id: string | null) => void
  onOpen: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const poster = reelPoster(reel)
  const src = reelVideo(reel)
  const direct = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src) || /\/video\/upload\//i.test(src)
  const instagram = reelInstagram(reel)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active) {
      video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [active])

  return (
    <article
      data-reel={reel.id}
      className="relative aspect-[9/16] w-[72vw] max-w-[300px] shrink-0 snap-center overflow-hidden bg-ink-2"
      onPointerEnter={() => fine && onHover(reel.id)}
      onPointerLeave={() => fine && onHover(null)}
    >
      <button type="button" className="absolute inset-0 z-10" data-cursor="PLAY" onClick={onOpen} aria-label={`Play ${reel.title || 'reel'}`} />
      {poster ? (
        <SmartImage src={poster} alt={reel.title || 'Reel'} width={600} height={1066} className={active ? 'opacity-0' : ''} />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a1a22,#08080b)]" />
      )}
      {direct && src && (
        <video
          ref={videoRef}
          src={src}
          poster={poster || undefined}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full object-cover ${active ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink to-transparent p-4">
        <h3 className="font-display text-xl tracking-[-0.04em] uppercase">{reel.title || 'Reel'}</h3>
        {reel.views && <p className="font-meta mt-1 text-[10px] tracking-[0.16em] uppercase">{reel.views} views</p>}
      </div>
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-20 inline-flex h-11 items-center rounded-full bg-ink/70 px-3 font-meta text-[10px] tracking-[0.12em] uppercase"
          aria-label={`Open ${reel.title || 'reel'} on Instagram`}
        >
          Instagram
        </a>
      )}
    </article>
  )
}

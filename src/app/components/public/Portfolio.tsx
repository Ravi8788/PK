import { useMemo, useRef, useState } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { siteCopy } from '@/app/content/siteCopy'
import { portfolioSrc, portfolioType, toLightboxItem, type PortfolioItem } from '@/app/lib/content'
import { usePortfolioData } from '@/app/lib/publicData'
import { useMedia } from '@/app/hooks/useMedia'
import { Lightbox } from './Lightbox'
import { SmartImage } from './SmartImage'

const PAGE = 9

export function Portfolio() {
  const { items, status, reload } = usePortfolioData()
  const [filter, setFilter] = useState<(typeof siteCopy.categories)[number]>('All')
  const [visible, setVisible] = useState(PAGE)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)
  const fine = useMedia('(pointer: fine)')

  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((item) => item.category === filter)),
    [filter, items],
  )
  const shown = filtered.slice(0, visible)
  const lightboxItems = shown.map((item, index) => toLightboxItem(item, index))

  return (
    <section id="portfolio" className="pk-section bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <p className="font-meta text-[11px] tracking-[0.24em] text-acid uppercase">
          {siteCopy.portfolio.index} / {siteCopy.portfolio.eyebrow}
        </p>
        <h2 className="font-display mt-3 text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] font-semibold tracking-[-0.04em] uppercase">
          {siteCopy.portfolio.title}
        </h2>
        <p className="mt-4 max-w-xl text-paper-dim">{siteCopy.portfolio.text}</p>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Portfolio categories">
          {siteCopy.categories.map((category) => {
            const selected = filter === category
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setFilter(category)
                  setVisible(PAGE)
                }}
                className={`relative min-h-11 shrink-0 rounded-full border px-4 font-meta text-[11px] tracking-[0.14em] uppercase ${
                  selected ? 'border-acid text-ink' : 'border-hair text-paper'
                }`}
              >
                {selected && (
                  <motion.span layoutId="portfolio-filter" className="absolute inset-0 rounded-full bg-acid" />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            )
          })}
        </div>

        {status === 'loading' && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-[4/5] animate-pulse bg-ink-2" />
            ))}
          </div>
        )}
        {status === 'error' && (
          <div className="mt-10">
            <p className="text-paper-dim">{siteCopy.portfolio.error}</p>
            <button type="button" className="mt-4 min-h-11 rounded-full border border-hair px-5" onClick={reload}>
              Retry
            </button>
          </div>
        )}
        {status !== 'loading' && status !== 'error' && filtered.length === 0 && (
          <p className="mt-12 font-display text-3xl tracking-[-0.04em] uppercase">{siteCopy.portfolio.empty}</p>
        )}

        <LayoutGroup>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((item, index) => (
              <PortfolioCard
                key={item.id}
                item={item}
                index={index}
                fine={fine}
                onOpen={() => {
                  setCurrent(index)
                  setOpen(true)
                }}
              />
            ))}
          </div>
          <Lightbox items={lightboxItems} index={current} open={open} onClose={() => setOpen(false)} onIndex={setCurrent} />
        </LayoutGroup>

        {visible < filtered.length && (
          <button
            type="button"
            className="mt-8 min-h-11 rounded-full border border-hair px-6 font-meta text-[11px] tracking-[0.16em] uppercase"
            onClick={() => setVisible((value) => value + PAGE)}
          >
            {siteCopy.portfolio.loadMore}
          </button>
        )}
      </div>
    </section>
  )
}

function PortfolioCard({
  item,
  index,
  fine,
  onOpen,
}: {
  item: PortfolioItem
  index: number
  fine: boolean
  onOpen: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const tall = index % 5 === 0
  const type = portfolioType(item)
  const src = type === 'video' ? item.thumbnail_url || '' : portfolioSrc(item)
  const label = `${String(index + 1).padStart(2, '0')} · ${item.category || 'Frame'}`

  return (
    <motion.button
      ref={ref}
      layout
      type="button"
      data-cursor="VIEW"
      onClick={onOpen}
      onPointerMove={(event) => {
        if (!fine || !ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        ref.current.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
        const glare = ref.current.querySelector<HTMLElement>('[data-glare]')
        if (glare) {
          glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.38), transparent 42%)`
        }
      }}
      onPointerLeave={() => {
        if (!ref.current) return
        ref.current.style.transform = ''
      }}
      className={`group relative w-full overflow-hidden bg-ink-2 text-left ${tall ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}
    >
      {src ? (
        <motion.span layoutId={type === 'image' ? `media-${item.id}` : undefined} className="block h-full w-full">
          <SmartImage src={src} alt={item.title || label} width={900} height={1100} priority={index < 3} />
        </motion.span>
      ) : (
        <span className="flex h-full items-end bg-[linear-gradient(160deg,#16161e,#101016_60%,#1a1a10)] p-4 text-paper-dim">
          {item.title}
        </span>
      )}
      <span data-glare className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100" />
      <span className="font-meta absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/90 to-transparent p-4 text-[11px] tracking-[0.16em] uppercase opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-active:opacity-100">
        {label}
      </span>
    </motion.button>
  )
}

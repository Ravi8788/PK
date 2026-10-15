import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { LightboxItem } from '@/app/lib/content'
import { VideoPlayer } from '@/app/components/VideoPlayer'
import { Viewfinder } from './Viewfinder'

interface LightboxProps {
  items: LightboxItem[]
  index: number
  open: boolean
  onClose: () => void
  onIndex: (index: number) => void
}

export function Lightbox({ items, index, open, onClose, onIndex }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [dragX, setDragX] = useState<number | null>(null)
  const item = items[index]

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && index > 0) onIndex(index - 1)
      if (event.key === 'ArrowRight' && index < items.length - 1) onIndex(index + 1)
      if (event.key !== 'Tab' || !dialogRef.current) return
      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button, [href], video, [tabindex]:not([tabindex="-1"])'),
      ).filter((node) => !node.hasAttribute('disabled'))
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [open, index, items.length, onClose, onIndex])

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          ref={dialogRef}
          className="fixed inset-0 z-[75] flex items-center justify-center bg-ink/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Viewfinder />
          <button
            ref={closeRef}
            type="button"
            className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-hair"
            onClick={onClose}
            aria-label="Close"
          >
            <X />
          </button>
          {index > 0 && (
            <button
              type="button"
              className="absolute left-3 z-30 hidden h-11 w-11 items-center justify-center rounded-full border border-hair md:inline-flex"
              onClick={(event) => {
                event.stopPropagation()
                onIndex(index - 1)
              }}
              aria-label="Previous"
            >
              <ChevronLeft />
            </button>
          )}
          {index < items.length - 1 && (
            <button
              type="button"
              className="absolute right-3 z-30 hidden h-11 w-11 items-center justify-center rounded-full border border-hair md:inline-flex"
              onClick={(event) => {
                event.stopPropagation()
                onIndex(index + 1)
              }}
              aria-label="Next"
            >
              <ChevronRight />
            </button>
          )}
          <div
            className="relative z-10 w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => setDragX(event.clientX)}
            onPointerUp={(event) => {
              if (dragX === null) return
              const delta = event.clientX - dragX
              if (delta > 48 && index > 0) onIndex(index - 1)
              if (delta < -48 && index < items.length - 1) onIndex(index + 1)
              setDragX(null)
            }}
          >
            <p className="font-meta mb-3 text-[11px] tracking-[0.22em] text-paper-dim uppercase">
              Frame {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              {item.category ? ` · ${item.category}` : ''}
            </p>
            <div className="flex max-h-[72svh] items-center justify-center overflow-hidden bg-ink-2">
              {item.type === 'image' && item.src ? (
                <motion.img
                  layoutId={`media-${item.id}`}
                  src={item.src}
                  alt={item.alt}
                  className="max-h-[72svh] w-auto max-w-full object-contain"
                />
              ) : item.src ? (
                <VideoPlayer url={item.src} title={item.title} autoPlay controls className="max-h-[72svh] w-full" />
              ) : (
                <p className="p-10 text-paper-dim">Media unavailable</p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="font-display text-3xl tracking-[-0.04em] uppercase">{item.title}</h3>
                {item.description && <p className="mt-2 max-w-xl text-sm text-paper-dim">{item.description}</p>}
              </div>
              <p className="font-meta text-[10px] tracking-[0.18em] text-paper-faint uppercase">ISO — · 24FPS · ESC</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

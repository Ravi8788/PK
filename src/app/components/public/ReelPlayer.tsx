import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { VideoPlayer } from '@/app/components/VideoPlayer'
import { isVideoUrl } from '@/app/lib/content'

interface ReelPlayerProps {
  open: boolean
  title: string
  src: string
  onClose: () => void
}

export function ReelPlayer({ open, title, src, onClose }: ReelPlayerProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number | null>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, video, a')).filter(
        (node) => !node.hasAttribute('disabled'),
      )
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
  }, [open, onClose])

  if (!open) return null
  const direct = isVideoUrl(src) && !/youtube|youtu\.be|vimeo|instagram/i.test(src)

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      className="fixed inset-0 z-[78] flex items-center justify-center bg-ink"
      onPointerDown={(event) => {
        startY.current = event.clientY
      }}
      onPointerUp={(event) => {
        if (startY.current !== null && event.clientY - startY.current > 80) onClose()
        startY.current = null
      }}
    >
      <button
        type="button"
        className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-hair"
        onClick={onClose}
        aria-label="Close player"
      >
        <X />
      </button>
      {direct ? (
        <video src={src} className="h-[100svh] w-full object-contain" controls autoPlay playsInline />
      ) : src ? (
        <div className="w-full max-w-md">
          <VideoPlayer url={src} title={title} autoPlay controls className="aspect-[9/16] w-full" />
        </div>
      ) : (
        <p className="text-paper-dim">This reel has no playable file yet.</p>
      )}
    </div>
  )
}

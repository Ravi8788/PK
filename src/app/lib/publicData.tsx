import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  asPortfolio,
  asReels,
  asTestimonials,
  loadApi,
  type PortfolioItem,
  type ReelItem,
  type TestimonialItem,
} from '@/app/lib/content'

type Status = 'loading' | 'ready' | 'empty' | 'error'

interface ListState<T> {
  status: Status
  items: T[]
  reload: () => void
}

function useList<T>(load: () => Promise<T[]>): ListState<T> {
  const [status, setStatus] = useState<Status>('loading')
  const [items, setItems] = useState<T[]>([])
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    load()
      .then((next) => {
        if (cancelled) return
        setItems(next)
        setStatus(next.length ? 'ready' : 'empty')
      })
      .catch(() => {
        if (!cancelled) {
          setItems([])
          setStatus('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  return { status, items, reload: () => setAttempt((value) => value + 1) }
}

const PortfolioContext = createContext<ListState<PortfolioItem> | null>(null)
const ReelsContext = createContext<ListState<ReelItem> | null>(null)
const TestimonialsContext = createContext<ListState<TestimonialItem> | null>(null)

export function PublicDataProvider({ children }: { children: ReactNode }) {
  const portfolio = useList(async () => asPortfolio(await (await loadApi()).portfolioAPI.getAll()))
  const reels = useList(async () => asReels(await (await loadApi()).reelsAPI.getAll()))
  const testimonials = useList(async () => asTestimonials(await (await loadApi()).testimonialsAPI.getAll()))

  return (
    <PortfolioContext.Provider value={portfolio}>
      <ReelsContext.Provider value={reels}>
        <TestimonialsContext.Provider value={testimonials}>{children}</TestimonialsContext.Provider>
      </ReelsContext.Provider>
    </PortfolioContext.Provider>
  )
}

export function usePortfolioData() {
  const value = useContext(PortfolioContext)
  if (!value) throw new Error('Portfolio data is only available on the public site')
  return value
}

export function useReelsData() {
  const value = useContext(ReelsContext)
  if (!value) throw new Error('Reels data is only available on the public site')
  return value
}

export function useTestimonialsData() {
  const value = useContext(TestimonialsContext)
  if (!value) throw new Error('Testimonials data is only available on the public site')
  return value
}

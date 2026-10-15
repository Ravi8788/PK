import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  asPortfolio,
  asReels,
  asTestimonials,
  demoPortfolio,
  demoReels,
  demoTestimonials,
  loadApi,
  type PortfolioItem,
  type ReelItem,
  type TestimonialItem,
} from '@/app/lib/content'

type Status = 'loading' | 'ready' | 'empty' | 'error'

interface ListState<T> {
  status: Status
  items: T[]
  usingDemo: boolean
  reload: () => void
}

function useList<T>(load: () => Promise<T[]>, demo: () => T[]): ListState<T> {
  const [status, setStatus] = useState<Status>('loading')
  const [items, setItems] = useState<T[]>([])
  const [usingDemo, setUsingDemo] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    load()
      .then((next) => {
        if (cancelled) return
        if (!next.length && import.meta.env.DEV) {
          setItems(demo())
          setUsingDemo(true)
          setStatus('empty')
          return
        }
        setItems(next)
        setUsingDemo(false)
        setStatus(next.length ? 'ready' : 'empty')
      })
      .catch(() => {
        if (!cancelled) {
          setItems([])
          setUsingDemo(false)
          setStatus('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  return { status, items, usingDemo, reload: () => setAttempt((value) => value + 1) }
}

const PortfolioContext = createContext<ListState<PortfolioItem> | null>(null)
const ReelsContext = createContext<ListState<ReelItem> | null>(null)
const TestimonialsContext = createContext<ListState<TestimonialItem> | null>(null)

export function PublicDataProvider({ children }: { children: ReactNode }) {
  const portfolio = useList(async () => asPortfolio(await (await loadApi()).portfolioAPI.getAll()), demoPortfolio)
  const reels = useList(async () => asReels(await (await loadApi()).reelsAPI.getAll()), demoReels)
  const testimonials = useList(
    async () => asTestimonials(await (await loadApi()).testimonialsAPI.getAll()),
    demoTestimonials,
  )

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

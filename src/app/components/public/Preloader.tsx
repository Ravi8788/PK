import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'

const FLAG = 'splashScreenShown'

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(3)
  const [flash, setFlash] = useState(false)
  const [skip, setSkip] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.localStorage.getItem(FLAG) === 'true'
  })

  useEffect(() => {
    if (reduced) {
      setSkip(true)
      onDone()
    }
  }, [reduced, onDone])

  useEffect(() => {
    if (skip || reduced) return
    const marks = [500, 1000, 1500]
    const timers = marks.map((delay, index) =>
      window.setTimeout(() => setCount(2 - index), delay),
    )
    const flashTimer = window.setTimeout(() => setFlash(true), 1500)
    const doneTimer = window.setTimeout(() => finish(), 1800)
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      window.clearTimeout(flashTimer)
      window.clearTimeout(doneTimer)
    }
  }, [skip, reduced])

  const finish = () => {
    window.localStorage.setItem(FLAG, 'true')
    onDone()
  }

  const skipNow = () => {
    setFlash(true)
    window.setTimeout(finish, 180)
  }

  if (skip || reduced) return null

  return (
    <button
      type="button"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink text-paper"
      onClick={skipNow}
      aria-label="Skip intro"
    >
      <svg className="absolute h-40 w-40" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(244,241,234,0.15)" strokeWidth="1" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#D7FF3A"
          strokeWidth="1.5"
          strokeDasharray="264"
          strokeDashoffset="66"
          strokeLinecap="round"
          className="origin-center -rotate-90"
        />
      </svg>
      <div className="relative text-center">
        <p className="font-meta mb-3 flex items-center justify-center gap-2 text-[11px] tracking-[0.28em]">
          <span className="pk-rec inline-block h-2 w-2 rounded-full bg-rec" />
          REC
        </p>
        <p className="font-display text-7xl font-semibold leading-none">{count}</p>
      </div>
      {flash && <span className="absolute inset-0 bg-paper" aria-hidden="true" />}
    </button>
  )
}

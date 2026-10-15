import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useMedia } from '@/app/hooks/useMedia'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  strength?: number
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const fine = useMedia('(pointer: fine)')
  const reduced = useReducedMotion()

  return (
    <button
      ref={ref}
      className={`pk-magnetic ${className}`}
      onMouseMove={(event) => {
        onMouseMove?.(event)
        if (!fine || reduced || !ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = event.clientX - (rect.left + rect.width / 2)
        const y = event.clientY - (rect.top + rect.height / 2)
        ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event)
        if (ref.current) ref.current.style.transform = ''
      }}
      {...props}
    >
      {children}
    </button>
  )
}

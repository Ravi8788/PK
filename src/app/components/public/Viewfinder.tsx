export function Viewfinder({ className = '' }: { className?: string }) {
  const corner = 'absolute h-10 w-10 border-paper/80 sm:h-14 sm:w-14'
  return (
    <div className={`pointer-events-none absolute inset-4 z-20 sm:inset-6 ${className}`} aria-hidden="true">
      <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  )
}

export function Grain() {
  return (
    <>
      <div className="pk-grain" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[69]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </>
  )
}

import { useState } from 'react'
import { siteCopy } from '@/app/content/siteCopy'
import { scrollToTarget, useLenis } from '@/app/lib/lenis'
import { Socials } from './Navbar'

export function Footer() {
  const year = new Date().getFullYear()
  const lenis = useLenis()
  const [flash, setFlash] = useState(false)

  const go = (href: string) => {
    if (href.startsWith('#')) scrollToTarget(href, lenis)
  }

  return (
    <footer className="relative bg-ink px-5 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
      {flash && <div className="pointer-events-none absolute inset-0 bg-paper" aria-hidden="true" />}
      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-hair pt-6">
        <Socials />
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
          {siteCopy.footer.quickLinks.map((link) =>
            'external' in link && link.external ? (
              <a key={link.label} href={link.href} className="min-h-11 py-2 text-sm text-paper-dim">
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="min-h-11 py-2 text-sm text-paper-dim"
                onClick={(event) => {
                  event.preventDefault()
                  go(link.href)
                }}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <button
          type="button"
          className="min-h-11 rounded-full border border-hair px-5 font-meta text-[11px] tracking-[0.16em] uppercase"
          onClick={() => {
            setFlash(true)
            window.setTimeout(() => setFlash(false), 160)
            scrollToTarget('#home', lenis)
          }}
        >
          {siteCopy.footer.backToTop}
        </button>
      </div>
      <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm text-paper-dim">
        <p>
          © {year} {siteCopy.brand}. {siteCopy.footer.rights}
        </p>
        <p>{siteCopy.footer.blurb}</p>
      </div>
    </footer>
  )
}

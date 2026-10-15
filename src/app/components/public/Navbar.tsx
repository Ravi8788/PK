import { useEffect, useState } from 'react'
import { Menu, X, Instagram, Youtube, MessageCircle } from 'lucide-react'
import { siteCopy, publicSections } from '@/app/content/siteCopy'
import { scrollToTarget, useLenis } from '@/app/lib/lenis'
import { MagneticButton } from './MagneticButton'

export function Navbar() {
  const lenis = useLenis()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > last && y > 80 && !open)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  useEffect(() => {
    const nodes = publicSections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0.1, 0.25] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) lenis?.stop()
    else lenis?.start()
    return () => {
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [open, lenis])

  const go = (href: string) => {
    setOpen(false)
    window.setTimeout(() => scrollToTarget(href, lenis), 20)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div
        className={`relative z-50 mx-auto flex max-w-[1600px] items-center justify-between gap-3 rounded-full border border-hair bg-[var(--glass)] px-3 py-2 backdrop-blur-xl transition-transform duration-500 md:px-4 ${
          hidden && !open ? '-translate-y-[150%]' : 'translate-y-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <a
          href="#home"
          className="inline-flex min-h-11 items-center px-2"
          onClick={(event) => {
            event.preventDefault()
            go('#home')
          }}
        >
          <img src="/images/logo.png" alt="PK Graphics" className="h-10 w-auto object-contain sm:h-11" />
        </a>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {siteCopy.nav.links.map((item) => {
            const id = item.href.slice(1)
            const current = active === id
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={current ? 'true' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  go(item.href)
                }}
                className={`min-h-11 px-3 py-2 font-meta text-[10px] tracking-[0.16em] uppercase ${
                  current ? 'text-acid' : 'text-paper-dim'
                }`}
              >
                {current ? '● ' : ''}
                {item.label}
              </a>
            )
          })}
        </nav>
        <MagneticButton
          className="hidden min-h-11 rounded-full bg-acid px-5 font-meta text-[11px] font-medium tracking-[0.14em] text-ink uppercase lg:inline-flex lg:items-center"
          onClick={() => go('#contact')}
        >
          {siteCopy.nav.cta}
        </MagneticButton>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24"
        >
          <nav className="flex flex-1 flex-col justify-center gap-2" aria-label="Mobile">
            {siteCopy.nav.links.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault()
                  go(item.href)
                }}
                className="font-display min-h-11 text-[clamp(2.4rem,10vw,4.2rem)] leading-none font-semibold tracking-[-0.04em] uppercase"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Socials />
            <button
              type="button"
              className="ml-auto min-h-11 rounded-full bg-acid px-5 font-meta text-[11px] tracking-[0.14em] text-ink uppercase"
              onClick={() => go('#contact')}
            >
              {siteCopy.nav.cta}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export function Socials() {
  const items = [
    { href: siteCopy.contact.instagram, label: 'Instagram', icon: Instagram },
    { href: siteCopy.contact.youtube, label: 'YouTube', icon: Youtube },
    { href: siteCopy.contact.whatsapp, label: 'WhatsApp', icon: MessageCircle },
  ]
  return (
    <div className="flex gap-2">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-hair"
          >
            <Icon size={18} />
          </a>
        )
      })}
    </div>
  )
}

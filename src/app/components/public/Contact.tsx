import { useRef, useState, type PointerEvent } from 'react'
import { Instagram, Mail, MapPin, MessageCircle, Phone, Send, Youtube } from 'lucide-react'
import { motion } from 'motion/react'
import { siteCopy } from '@/app/content/siteCopy'
import { loadApi } from '@/app/lib/content'
import { useReducedMotion } from '@/app/hooks/useReducedMotion'
import { toast } from 'sonner'

const startedAt = Date.now()

export function Contact() {
  const copy = siteCopy.contact
  const reduced = useReducedMotion()
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const tiltRef = useRef<HTMLDivElement>(null)

  const validate = () => {
    const next: Record<string, string> = {}
    if (form.name.trim().length < 2) next.name = 'Please add your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (form.message.trim().length < 8) next.message = 'Tell me a little more about the shoot.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (form.company) {
      setSuccess(true)
      return
    }
    if (Date.now() - startedAt < 2500) {
      setErrors({ form: copy.tooFast })
      return
    }
    if (!validate()) return
    setSending(true)
    try {
      const api = await loadApi()
      await api.contactAPI.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })
      setSuccess(true)
      toast.success('Message sent successfully!')
      setForm({ name: '', email: '', message: '', company: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ form: copy.error })
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const onTilt = (event: PointerEvent<HTMLDivElement>) => {
    const card = tiltRef.current
    if (!card || reduced || window.matchMedia('(pointer: coarse)').matches) return
    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateZ(12px)`
  }

  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  const details = [
    { icon: Mail, label: 'Email', value: copy.email, href: `mailto:${copy.email}` },
    { icon: Phone, label: 'Phone', value: copy.phoneDisplay, href: copy.phoneHref },
    { icon: MapPin, label: 'Location', value: copy.location, href: 'https://maps.google.com/?q=Kolhapur,Maharashtra' },
  ]

  const socials = [
    { href: copy.instagram, label: 'Instagram', icon: Instagram, className: 'bg-[radial-gradient(circle_at_30%_30%,#f9ce34,#ee2a7b_55%,#6228d7)]' },
    { href: copy.youtube, label: 'YouTube', icon: Youtube, className: 'bg-[#ff0033]' },
    { href: copy.whatsapp, label: 'WhatsApp', icon: MessageCircle, className: 'bg-[#25d366]' },
  ]

  return (
    <section id="contact" className="pk-section relative overflow-hidden bg-ink pt-16 pb-6 md:pt-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-meta text-[11px] tracking-[0.28em] text-acid uppercase">{copy.eyebrow}</p>
          <h2 className="font-display mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em]">
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-paper-dim sm:text-base">{copy.text}</p>
        </motion.div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -28, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 900 }}
          >
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <ul className="mt-6 space-y-5">
              {details.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.li
                    key={item.label}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 * index, duration: 0.5 }}
                  >
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group flex items-center gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-acid text-ink transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_24px_rgba(234,88,12,0.35)]">
                        <Icon size={18} />
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{item.label}</span>
                        <span className="block text-sm text-paper-dim">{item.value}</span>
                      </span>
                    </a>
                  </motion.li>
                )
              })}
            </ul>
            <p className="mt-8 text-sm font-medium">Follow Me</p>
            <div className="mt-3 flex gap-3">
              {socials.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition duration-300 hover:-translate-y-1 hover:shadow-lg ${item.className}`}
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
            <motion.div
              className="mt-8 w-full max-w-sm rounded-2xl bg-paper px-4 py-5 text-ink"
              animate={reduced ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src="/images/parthyaxx.png" alt="PARTHYAXX" className="mx-auto h-auto w-full max-w-[16rem] brightness-0" />
              <p className="mt-2 text-center text-[11px] font-semibold tracking-[0.28em]">CINEMATIC EDITZ</p>
              <span className="mx-auto mt-2 block h-2 w-24 bg-ink" />
            </motion.div>
          </motion.div>

          <div className="[perspective:1400px]">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 36, rotateX: 14 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                ref={tiltRef}
                onPointerMove={onTilt}
                onPointerLeave={resetTilt}
                className="rounded-2xl border border-white/10 bg-[#141821] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out [transform-style:preserve-3d] sm:p-7"
              >
                <form onSubmit={onSubmit} noValidate>
                  <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company}
                      onChange={(event) => setForm({ ...form, company: event.target.value })}
                    />
                  </div>
                  {success ? (
                    <p className="flex min-h-72 items-center text-lg leading-snug">{copy.success}</p>
                  ) : (
                    <>
                      <Field
                        id="name"
                        label="Your Name"
                        placeholder="John Doe"
                        value={form.name}
                        error={errors.name}
                        autoComplete="name"
                        onChange={(value) => setForm({ ...form, name: value })}
                      />
                      <Field
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="john@example.com"
                        value={form.email}
                        error={errors.email}
                        autoComplete="email"
                        onChange={(value) => setForm({ ...form, email: value })}
                      />
                      <Field
                        id="message"
                        label="Your Message"
                        placeholder="Tell me about your project..."
                        value={form.message}
                        error={errors.message}
                        multiline
                        onChange={(value) => setForm({ ...form, message: value })}
                      />
                      {errors.form && <p className="mb-3 text-sm text-rec">{errors.form}</p>}
                      <button
                        type="submit"
                        disabled={sending}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-acid text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(234,88,12,0.35)] disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
                      >
                        {sending ? copy.sending : copy.submit}
                        <Send size={16} />
                      </button>
                    </>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  multiline = false,
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder: string
  type?: string
  multiline?: boolean
  autoComplete?: string
}) {
  const className =
    'mt-1.5 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-paper outline-none transition placeholder:text-paper/35 focus:border-acid focus:shadow-[0_0_0_3px_rgba(234,88,12,0.18)]'
  return (
    <label className="mb-4 block text-sm font-medium" htmlFor={id}>
      {label} <span className="text-acid">*</span>
      {multiline ? (
        <textarea id={id} value={value} rows={5} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={className} />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      )}
      {error && <span className="mt-1 block text-xs font-normal text-rec">{error}</span>}
    </label>
  )
}

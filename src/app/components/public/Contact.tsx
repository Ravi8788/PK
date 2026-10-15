import { useRef, useState } from 'react'
import { siteCopy } from '@/app/content/siteCopy'
import { loadApi } from '@/app/lib/content'
import { toast } from 'sonner'

const startedAt = Date.now()

export function Contact() {
  const copy = siteCopy.contact
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [flash, setFlash] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

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
      setFlash(true)
      setSuccess(true)
      toast.success('Message sent successfully!')
      setForm({ name: '', email: '', message: '', company: '' })
      window.setTimeout(() => setFlash(false), 280)
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ form: copy.error })
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const rows = [
    { label: 'Email', value: copy.email, href: `mailto:${copy.email}` },
    { label: 'Phone', value: copy.phoneDisplay, href: copy.phoneHref },
    { label: 'WhatsApp', value: copy.phoneDisplay, href: copy.whatsapp },
    { label: 'Instagram', value: '@pk.graphic_', href: copy.instagram },
  ]

  return (
    <section id="contact" className="pk-section relative bg-ink py-20 md:py-28">
      {flash && <div className="pointer-events-none absolute inset-0 z-20 bg-paper/80" aria-hidden="true" />}
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-meta text-[11px] tracking-[0.24em] text-acid uppercase">
            {copy.index} / {copy.eyebrow}
          </p>
          <h2 className="font-display mt-3 text-[clamp(3.5rem,10vw,8rem)] leading-[0.85] font-semibold tracking-[-0.045em] uppercase">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-xl text-paper-dim">{copy.text}</p>
          <div className="mt-8 border-t border-hair">
            {rows.map((row) => (
              <a
                key={row.label}
                href={row.href}
                target={row.href.startsWith('http') ? '_blank' : undefined}
                rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex min-h-16 items-center justify-between border-b border-hair py-4"
              >
                <span className="font-meta text-[11px] tracking-[0.18em] text-paper-dim uppercase">{row.label}</span>
                <span className="font-display text-xl tracking-[-0.04em] transition group-hover:text-acid sm:text-3xl">
                  {row.value}
                </span>
              </a>
            ))}
            <p className="mt-4 text-paper-dim">{copy.location}</p>
          </div>
        </div>
        <form ref={formRef} onSubmit={onSubmit} className="relative border border-hair bg-ink-2 p-5 sm:p-8" noValidate>
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
            <div className="flex min-h-80 flex-col justify-center">
              <p className="font-meta text-[11px] tracking-[0.2em] text-acid uppercase">Shutter</p>
              <p className="font-display mt-3 text-4xl tracking-[-0.04em] uppercase">{copy.success}</p>
            </div>
          ) : (
            <>
              <FloatField
                id="name"
                label="Your name"
                value={form.name}
                error={errors.name}
                onChange={(value) => setForm({ ...form, name: value })}
              />
              <FloatField
                id="email"
                type="email"
                label="Email address"
                value={form.email}
                error={errors.email}
                onChange={(value) => setForm({ ...form, email: value })}
              />
              <FloatField
                id="message"
                label="Your message"
                value={form.message}
                error={errors.message}
                multiline
                onChange={(value) => setForm({ ...form, message: value })}
              />
              {errors.form && <p className="mb-3 text-sm text-rec">{errors.form}</p>}
              <button
                type="submit"
                disabled={sending}
                className="min-h-12 w-full rounded-full bg-acid font-meta text-[12px] tracking-[0.16em] text-ink uppercase disabled:opacity-50"
              >
                {sending ? copy.sending : copy.submit}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}

function FloatField({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  multiline = false,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  multiline?: boolean
}) {
  const className =
    'peer min-h-14 w-full border border-hair bg-transparent px-4 pt-6 pb-2 text-paper outline-none focus:border-acid'
  return (
    <label className="relative mb-4 block" htmlFor={id}>
      {multiline ? (
        <textarea id={id} value={value} rows={5} placeholder=" " onChange={(event) => onChange(event.target.value)} className={className} />
      ) : (
        <input id={id} type={type} value={value} placeholder=" " onChange={(event) => onChange(event.target.value)} className={className} />
      )}
      <span className="pointer-events-none absolute top-4 left-4 text-paper-dim transition peer-focus:-translate-y-2 peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[10px]">
        {label}
      </span>
      {error && <span className="mt-1 block text-sm text-rec">{error}</span>}
    </label>
  )
}

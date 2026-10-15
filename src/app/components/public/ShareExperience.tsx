import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { siteCopy } from '@/app/content/siteCopy'
import { loadApi } from '@/app/lib/content'
import { toast } from 'sonner'

interface ShareExperienceProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ShareExperience({ open, onClose, onSuccess }: ShareExperienceProps) {
  const [formData, setFormData] = useState({ name: '', role: '', text: '', rating: 5 })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file')
  const [uploading, setUploading] = useState(false)

  if (!open) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setUploading(true)
    try {
      let finalImageUrl = ''
      const api = await loadApi()
      if (uploadMethod === 'url') {
        finalImageUrl = imageUrl.trim()
        if (!finalImageUrl) throw new Error('Please enter an image URL')
      } else if (imageFile) {
        finalImageUrl = await api.storageAPI.uploadFile(imageFile, 'image')
      }
      await api.testimonialsAPI.add({
        client_name: formData.name,
        project_type: formData.role,
        text: formData.text,
        rating: formData.rating,
        client_image: finalImageUrl || '',
      })
      toast.success(siteCopy.testimonials.success)
      setFormData({ name: '', role: '', text: '', rating: 5 })
      setImageFile(null)
      setImagePreview('')
      setImageUrl('')
      onSuccess()
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit testimonial'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[72] flex items-center justify-center bg-ink/80 p-4">
      <form onSubmit={handleSubmit} className="max-h-[90svh] w-full max-w-xl overflow-y-auto border border-hair bg-ink-2 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-3xl tracking-[-0.04em] uppercase">{siteCopy.testimonials.formTitle}</h3>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center" onClick={onClose} aria-label="Close dialog">
            <X />
          </button>
        </div>
        <Field label="Your name">
          <input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="field" />
        </Field>
        <Field label="Project type / event">
          <input required value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })} className="field" />
        </Field>
        <Field label="Your review">
          <textarea required rows={4} value={formData.text} onChange={(event) => setFormData({ ...formData, text: event.target.value })} className="field resize-none" />
        </Field>
        <div className="mb-4">
          <p className="font-meta mb-2 text-[11px] tracking-[0.16em] uppercase">Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center"
                aria-label={`Set rating to ${rating} star${rating > 1 ? 's' : ''}`}
                onClick={() => setFormData({ ...formData, rating })}
              >
                <Star size={22} className={rating <= formData.rating ? 'fill-acid text-acid' : 'text-paper-faint'} />
              </button>
            ))}
          </div>
        </div>
        <Field label="Photo upload method">
          <select
            value={uploadMethod}
            onChange={(event) => setUploadMethod(event.target.value as 'url' | 'file')}
            className="field"
          >
            <option value="file">Upload your photo</option>
            <option value="url">Paste photo URL</option>
          </select>
        </Field>
        {uploadMethod === 'file' ? (
          <label className="mb-4 block">
            <span className="font-meta text-[11px] tracking-[0.16em] uppercase">Your photo (optional)</span>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                setImageFile(file)
                const reader = new FileReader()
                reader.onloadend = () => setImagePreview(String(reader.result || ''))
                reader.readAsDataURL(file)
              }}
            />
            {imagePreview && <img src={imagePreview} alt="" className="mt-3 h-32 w-full object-cover" />}
          </label>
        ) : (
          <Field label="Photo URL (optional)">
            <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="field" />
          </Field>
        )}
        <button
          type="submit"
          disabled={uploading}
          className="min-h-11 w-full rounded-full bg-acid font-meta text-[12px] tracking-[0.14em] text-ink uppercase disabled:opacity-50"
        >
          {uploading ? 'Submitting...' : 'Submit review'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="font-meta text-[11px] tracking-[0.16em] uppercase">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

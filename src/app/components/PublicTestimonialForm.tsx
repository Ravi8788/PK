import { useState } from 'react';
import { X, Upload, Star } from 'lucide-react';
import { storageAPI, testimonialsAPI } from '@/app/utils/api';
import { toast } from 'sonner';

interface PublicTestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PublicTestimonialForm({ isOpen, onClose, onSuccess }: PublicTestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalImageUrl = '';

      if (uploadMethod === 'url') {
        finalImageUrl = imageUrl.trim();
        if (!finalImageUrl) {
          throw new Error('Please enter an image URL');
        }
      } else {
        // Upload image if file selected
        if (imageFile) {
          finalImageUrl = await storageAPI.uploadFile(imageFile, 'image');
        }
      }

      await testimonialsAPI.add({
        client_name: formData.name,
        project_type: formData.role,
        text: formData.text,
        rating: formData.rating,
        client_image: finalImageUrl || '',
      });

      toast.success('Thank you! Your testimonial has been submitted and will appear after admin approval.');
      
      // Reset form
      setFormData({ name: '', role: '', text: '', rating: 5 });
      setImageFile(null);
      setImagePreview('');
      setImageUrl('');
      
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      const message = error instanceof Error ? error.message : 'Failed to submit testimonial';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-white">Share Your Experience</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Type / Event
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="e.g., Wedding, Photoshoot, Event"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              placeholder="Share your experience with PK Graphics"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  aria-label={`Set rating to ${rating} star${rating > 1 ? 's' : ''}`}
                  className={`p-2 transition-colors ${
                    rating <= formData.rating
                      ? 'text-orange-600'
                      : 'text-gray-600'
                  }`}
                >
                  <Star size={32} fill={rating <= formData.rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="public-upload-method" className="block text-sm font-medium text-gray-300 mb-2">
              Photo Upload Method
            </label>
            <select
              id="public-upload-method"
              value={uploadMethod}
              onChange={(e) => {
                setUploadMethod(e.target.value as 'url' | 'file');
                if (e.target.value === 'url') {
                  setImageFile(null);
                  setImagePreview('');
                } else {
                  setImageUrl('');
                }
              }}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="file">Upload Your Photo</option>
              <option value="url">Paste Photo URL</option>
            </select>
          </div>

          {uploadMethod === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Photo (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="public-photo-upload"
                />
                <label
                  htmlFor="public-photo-upload"
                  className="flex flex-col items-center justify-center w-full h-48 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={48} className="text-gray-400 mb-2" />
                      <p className="text-gray-400 text-center">Click to upload your photo</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {uploadMethod === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Photo URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="https://example.com/your-photo.jpg"
              />
              {imageUrl && (
                <div className="mt-3 w-full h-40 bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

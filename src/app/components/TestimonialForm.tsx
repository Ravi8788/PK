import { useState } from 'react';
import { X, Upload, Star } from 'lucide-react';
import { storageAPI } from '@/app/utils/api';

interface TestimonialFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function TestimonialForm({ onClose, onSubmit }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
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
      let imageUrl = '';

      // Upload image if selected
      if (imageFile) {
        imageUrl = await storageAPI.uploadFile(imageFile, 'testimonials');
      }

      onSubmit({
        client_name: formData.name,
        project_type: formData.role,
        text: formData.text,
        rating: formData.rating,
        client_image: imageUrl,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-white">Add Testimonial</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="Enter client name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role/Event Type
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              placeholder="e.g., Wedding Client"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Testimonial
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
              placeholder="Enter testimonial text"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className={`p-2 transition-colors ${
                    rating <= formData.rating
                      ? 'text-amber-500'
                      : 'text-gray-600'
                  }`}
                >
                  <Star size={32} fill={rating <= formData.rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Photo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="client-image-upload"
                required
              />
              <label
                htmlFor="client-image-upload"
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
                    <p className="text-gray-400">Click to upload photo</p>
                  </div>
                )}
              </label>
            </div>
          </div>

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
              className="flex-1 px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-added"
            >
              {uploading ? 'Uploading...' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
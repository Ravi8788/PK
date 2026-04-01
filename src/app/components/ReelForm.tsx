import { useState } from 'react';
import { X } from 'lucide-react';

interface ReelFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ReelForm({ onClose, onSubmit }: ReelFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    views: '',
    description: '',
  });
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const thumbnailUrlResult = thumbnailUrl.trim();
      const videoUrlResult = videoUrl.trim();

      if (!thumbnailUrlResult) {
        throw new Error('Please enter a thumbnail URL');
      }

      if (!videoUrlResult) {
        throw new Error('Please enter a video URL');
      }

      onSubmit({
        title: formData.title,
        views: formData.views,
        description: formData.description,
        thumbnail_url: thumbnailUrlResult,
        video_url: videoUrlResult,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      const message = error instanceof Error ? error.message : 'Failed to upload files. Please try again.';
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-white">Add Reel</h2>
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
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              View Count
            </label>
            <input
              type="text"
              value={formData.views}
              onChange={(e) => setFormData({ ...formData, views: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="e.g., 100K"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Enter description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="https://example.com/thumbnail.jpg"
              required
            />
            {thumbnailUrl && (
              <div className="mt-3 w-full h-48 bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
                <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Source
            </label>
            <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300">URL only</div>
            <p className="text-gray-500 text-xs mt-2">Use public URLs only when running with Realtime Database.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="https://www.youtube.com/watch?v=... or direct .mp4 URL"
              required
            />
            <p className="text-gray-500 text-xs mt-2">
              Supported: YouTube, Vimeo, or direct video URLs (.mp4, .webm).
            </p>
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
              className="flex-1 px-4 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Add Reel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
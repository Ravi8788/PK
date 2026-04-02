import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { storageAPI } from '@/app/utils/api';

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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [uploading, setUploading] = useState(false);

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        alert('Video file is too large. Maximum size is 500MB.');
        return;
      }
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let thumbnailUrlResult = '';
      let videoUrlResult = '';
      const trimmedThumbnailUrl = thumbnailUrl.trim();
      const trimmedVideoUrl = videoUrl.trim();
      const trimmedInstagramUrl = instagramUrl.trim();

      if (trimmedThumbnailUrl) {
        thumbnailUrlResult = trimmedThumbnailUrl;
      } else if (uploadMethod === 'file' && thumbnailFile) {
        thumbnailUrlResult = await storageAPI.uploadFile(thumbnailFile, 'image');
      }

      if (uploadMethod === 'file') {
        // In file mode, always prioritize uploaded video for in-app playback.
        if (videoFile) {
          videoUrlResult = await storageAPI.uploadFile(videoFile, 'video');
        } else if (trimmedVideoUrl) {
          videoUrlResult = trimmedVideoUrl;
        } else {
          throw new Error('Please upload a video file or provide a video URL.');
        }
      } else if (trimmedVideoUrl) {
        videoUrlResult = trimmedVideoUrl;
      } else {
        throw new Error('Please provide a video URL.');
      }

      onSubmit({
        title: formData.title,
        views: formData.views,
        description: formData.description,
        thumbnail_url: thumbnailUrlResult,
        video_url: videoUrlResult,
        instagram_url: trimmedInstagramUrl || undefined,
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
            <label htmlFor="reel-upload-method" className="block text-sm font-medium text-gray-300 mb-2">
              Upload Method
            </label>
            <select
              id="reel-upload-method"
              value={uploadMethod}
              onChange={(e) => setUploadMethod(e.target.value as 'url' | 'file')}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              required
            >
              <option value="url">Enter URL</option>
              <option value="file">Upload File</option>
            </select>
          </div>

          <div className="rounded-lg border border-gray-700 p-4 space-y-3">
            <p className="text-sm font-medium text-gray-300">Enter URL (always available)</p>
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
              />
              {thumbnailUrl && (
                <div className="mt-3 w-full h-48 bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
                  <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL (for player)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="https://www.youtube.com/watch?v=... or direct .mp4 URL"
              />
              <p className="text-gray-500 text-xs mt-2">
                Supported: YouTube, Vimeo, or direct video URLs (.mp4, .webm).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Instagram URL (for corner button)
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="https://www.instagram.com/reel/..."
              />
            </div>
          </div>

          {uploadMethod === 'file' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex flex-col items-center justify-center w-full h-48 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload size={48} className="text-gray-400 mb-2" />
                        <p className="text-gray-400">Click to upload thumbnail</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                    id="video-upload"
                    required
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center w-full h-48 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    {videoPreview ? (
                      <video
                        src={videoPreview}
                        className="w-full h-full object-cover rounded-lg"
                        controls
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload size={48} className="text-gray-400 mb-2" />
                        <p className="text-gray-400">Click to upload video</p>
                      </div>
                    )}
                  </label>
                </div>
                <p className="text-gray-500 text-xs mt-2">Maximum file size: 500MB</p>
              </div>
            </>
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
              {uploading ? 'Uploading...' : 'Add Reel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
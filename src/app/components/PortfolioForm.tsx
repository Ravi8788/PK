import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { storageAPI } from '@/app/utils/api';

interface PortfolioFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function PortfolioForm({ onClose, onSubmit }: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Wedding Shoots',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailMethod, setThumbnailMethod] = useState<'file' | 'url'>('url');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('url');
  const [imageUrl, setImageUrl] = useState('');
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

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 150MB)
      const maxSize = 150 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Video file is too large. Maximum size is 150MB.');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let mediaUrl = '';
      let thumbnailMediaUrl = '';

      if (uploadMethod === 'url') {
        // Use the URL directly
        mediaUrl = imageUrl.trim();
        if (!mediaUrl) {
          throw new Error('Please enter an image URL');
        }
      } else {
        // Upload file using Cloudinary
        const fileToUpload = mediaType === 'image' ? imageFile : videoFile;
        if (!fileToUpload) {
          throw new Error(`Please select a ${mediaType} file`);
        }
        mediaUrl = await storageAPI.uploadFile(fileToUpload, mediaType);
      }

      if (!mediaUrl) {
        throw new Error('Please provide an image');
      }

      if (mediaType === 'video') {
        if (thumbnailMethod === 'url' && thumbnailUrl.trim()) {
          thumbnailMediaUrl = thumbnailUrl.trim();
        } else if (thumbnailMethod === 'file' && thumbnailFile) {
          thumbnailMediaUrl = await storageAPI.uploadFile(thumbnailFile, 'image');
        }
      }

      onSubmit({
        ...formData,
        image_url: mediaUrl,
        image: mediaUrl,
        media_type: mediaType,
        ...(thumbnailMediaUrl ? { thumbnail_url: thumbnailMediaUrl } : {}),
      });
    } catch (error) {
      console.error('Error uploading media:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload media';
      alert(`Upload failed: ${errorMessage}\n\nTip: Use "Enter URL" method and paste an image URL from:\n- Unsplash.com\n- Your Google Drive (public link)\n- Any direct image URL`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-white">Add Portfolio Item</h2>
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
            <label htmlFor="portfolio-category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="portfolio-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              required
            >
              <option value="Wedding Shoots">Wedding Shoots</option>
              <option value="Pre-Wedding Shoots">Pre-Wedding Shoots</option>
              <option value="Reels/Short Videos">Reels/Short Videos</option>
              <option value="Creative/Commercial Shoots">Creative/Commercial Shoots</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="portfolio-media-type" className="block text-sm font-medium text-gray-300 mb-2">
              Media Type
            </label>
            <select
              id="portfolio-media-type"
              value={mediaType}
              onChange={(e) => {
                const nextType = e.target.value as 'image' | 'video';
                setMediaType(nextType);
                if (nextType === 'image') {
                  setThumbnailFile(null);
                  setThumbnailPreview('');
                  setThumbnailUrl('');
                }
              }}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              required
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label htmlFor="portfolio-upload-method" className="block text-sm font-medium text-gray-300 mb-2">
              Upload Method
            </label>
            <select
              id="portfolio-upload-method"
              value={uploadMethod}
              onChange={(e) => setUploadMethod(e.target.value as 'file' | 'url')}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              required
            >
              <option value="url">Enter URL</option>
              <option value="file">Upload File</option>
            </select>
          </div>

          {uploadMethod === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mediaType === 'image' ? 'Image URL' : 'Video URL'}
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder={mediaType === 'image' ? 'Enter image URL' : 'https://www.youtube.com/watch?v=... or direct .mp4 URL'}
                required
              />
              {mediaType === 'video' && (
                <>
                  <p className="text-gray-500 text-xs mt-2">
                    ✅ YouTube, Vimeo, or direct video file URLs (.mp4, .webm)<br/>
                    ❌ Unsplash doesn't host videos - use direct video URLs only
                  </p>
                  <div className="mt-3 p-3 bg-gray-900/50 rounded-lg text-xs text-gray-400">
                    <p className="font-semibold text-orange-600 mb-2">💡 Quick tip for testing:</p>
                    <p className="mb-1">• Use this sample video URL:</p>
                    <p className="font-mono bg-gray-800 px-2 py-1 rounded break-all">
                      https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {mediaType === 'video' && (
            <div className="space-y-3 rounded-lg border border-gray-700 p-4">
              <label htmlFor="portfolio-thumbnail-method" className="block text-sm font-medium text-gray-300">
                Video Thumbnail (Optional)
              </label>

              <select
                id="portfolio-thumbnail-method"
                value={thumbnailMethod}
                onChange={(e) => setThumbnailMethod(e.target.value as 'file' | 'url')}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="url">Enter Thumbnail URL</option>
                <option value="file">Upload Thumbnail</option>
              </select>

              {thumbnailMethod === 'url' ? (
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Enter thumbnail image URL"
                  required={uploadMethod === 'url'}
                />
              ) : (
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
                    className="flex flex-col items-center justify-center w-full h-40 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload size={40} className="text-gray-400 mb-2" />
                        <p className="text-gray-400">Click to upload thumbnail</p>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>
          )}

          {uploadMethod === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mediaType === 'image' ? 'Image' : 'Video'}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept={mediaType === 'image' ? "image/*" : "video/*"}
                  onChange={mediaType === 'image' ? handleImageSelect : handleVideoSelect}
                  className="hidden"
                  id="media-upload"
                  required
                />
                <label
                  htmlFor="media-upload"
                  className="flex flex-col items-center justify-center w-full h-48 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  {mediaType === 'image' ? (
                    imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload size={48} className="text-gray-400 mb-2" />
                        <p className="text-gray-400">Click to upload image</p>
                      </div>
                    )
                  ) : (
                    videoPreview ? (
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
                    )
                  )}
                </label>
              </div>
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
              {uploading ? 'Uploading...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
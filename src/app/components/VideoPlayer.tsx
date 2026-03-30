interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  style?: React.CSSProperties;
  onError?: () => void;
}

export function VideoPlayer({ 
  url, 
  title = 'Video', 
  className = '', 
  autoPlay = false,
  controls = true,
  loop = false,
  style,
  onError
}: VideoPlayerProps) {
  // Function to detect video type from URL
  const getVideoType = (url: string) => {
    if (!url) return 'unknown';
    
    // YouTube
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      return 'youtube';
    }
    
    // Vimeo
    if (url.includes('vimeo.com/')) {
      return 'vimeo';
    }
    
    // Instagram
    if (url.includes('instagram.com/')) {
      return 'instagram';
    }
    
    // Direct video file (mp4, webm, etc.)
    if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
      return 'direct';
    }
    
    // Check if it's Unsplash (won't work for videos)
    if (url.includes('unsplash.com')) {
      return 'unsplash';
    }
    
    // Default to direct video
    return 'direct';
  };

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  // Extract Vimeo video ID
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const videoType = getVideoType(url);

  // Handle YouTube
  if (videoType === 'youtube') {
    const videoId = getYouTubeId(url);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}${autoPlay ? '?autoplay=1&mute=1' : ''}`;
      return (
        <iframe
          src={embedUrl}
          title={title}
          className={className}
          style={style}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
  }

  // Handle Vimeo
  if (videoType === 'vimeo') {
    const videoId = getVimeoId(url);
    if (videoId) {
      const embedUrl = `https://player.vimeo.com/video/${videoId}${autoPlay ? '?autoplay=1&muted=1' : ''}`;
      return (
        <iframe
          src={embedUrl}
          title={title}
          className={className}
          style={style}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }
  }

  // Handle Instagram (note: Instagram embeds are tricky and may not work in all contexts)
  if (videoType === 'instagram') {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-900 text-white p-8`} style={style}>
        <div className="text-center">
          <p className="mb-4">Instagram videos require special embedding</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full hover:shadow-lg transition-all"
          >
            Watch on Instagram
          </a>
        </div>
      </div>
    );
  }

  // Handle Unsplash error
  if (videoType === 'unsplash') {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-900 text-white p-8`} style={style}>
        <div className="text-center">
          <p className="text-red-400 mb-2">❌ Unsplash doesn't host videos</p>
          <p className="text-sm text-gray-400">Please use a direct video URL (.mp4) or a video hosting platform like YouTube or Vimeo</p>
        </div>
      </div>
    );
  }

  // Handle direct video or unknown type - try HTML5 video
  return (
    <video
      src={url}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      playsInline
      muted={autoPlay} // Auto-playing videos must be muted
      className={className}
      style={style}
      onError={(e) => {
        console.error('Video failed to load:', url);
        if (onError) onError();
      }}
    >
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <div className="text-center p-8">
          <p className="text-red-400 mb-2">❌ Video failed to load</p>
          <p className="text-sm text-gray-400 mb-4">This video URL may not be accessible or may require special embedding</p>
          <p className="text-xs text-gray-500">URL: {url}</p>
        </div>
      </div>
    </video>
  );
}

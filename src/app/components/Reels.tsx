import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Instagram } from 'lucide-react';
import { reelsAPI } from '@/app/utils/api';
import { Lightbox } from './Lightbox';

interface Reel {
  id: string;
  title: string;
  thumbnail: string;
  thumbnail_url?: string;
  views: string;
  description?: string;
  videoUrl?: string;
  video_url?: string;
}

export function Reels() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    try {
      const data = await reelsAPI.getAll();
      setReels(data || []);
    } catch (error) {
      // Error already handled in API layer, just set empty array
      setReels([]);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentReelIndex(index);
    setLightboxOpen(true);
  };

  const lightboxItems = reels.map(reel => ({
    id: reel.id,
    type: 'video' as const,
    src: reel.video_url || reel.videoUrl || reel.thumbnail_url || reel.thumbnail,
    title: reel.title,
    description: reel.description,
  }));

  return (
    <section id="reels" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-orange-600 tracking-widest text-sm uppercase mb-2">
            Video Content
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Reels & Short Videos
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Engaging vertical videos optimized for social media platforms
          </p>
        </motion.div>

        {/* Reels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              {/* Thumbnail */}
              <img
                src={reel.thumbnail_url || reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Play size={28} fill="white" className="text-white ml-1" />
                </div>
              </div>

              {/* Info at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{reel.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Instagram size={14} />
                  <span>{reel.views} views</span>
                </div>
              </div>

              {/* Instagram Icon Badge */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Instagram size={16} className="text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
          >
            <Instagram size={20} />
            Follow on Instagram
          </a>
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        items={lightboxItems}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        currentIndex={currentReelIndex}
        onNavigate={setCurrentReelIndex}
      />
    </section>
  );
}
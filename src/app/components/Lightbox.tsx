import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    id: string;
    type: 'image' | 'video';
    src: string;
    title: string;
    category?: string;
    description?: string;
  }>;
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function Lightbox({ isOpen, onClose, items, currentIndex, onNavigate }: LightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const currentItem = items[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        onNavigate(currentIndex + 1);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!currentItem) return null;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
      setIsZoomed(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      onNavigate(currentIndex + 1);
      setIsZoomed(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 group"
            aria-label="Close"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Navigation Buttons */}
          {items.length > 1 && (
            <>
              {currentIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 group"
                  aria-label="Previous"
                >
                  <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
              )}

              {currentIndex < items.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 group"
                  aria-label="Next"
                >
                  <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              )}
            </>
          )}

          {/* Zoom Button (only for images) */}
          {currentItem.type === 'image' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="absolute top-4 right-20 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>
          )}

          {/* Counter */}
          {items.length > 1 && (
            <div className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium">
              {currentIndex + 1} / {items.length}
            </div>
          )}

          {/* Content Container */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-7xl max-h-full flex flex-col items-center">
              {/* Media Content */}
              <div className={`relative ${currentItem.type === 'video' ? 'w-full max-w-2xl' : 'w-full'} max-h-[calc(100vh-200px)] flex items-center justify-center overflow-hidden rounded-lg`}>
                {currentItem.type === 'image' ? (
                  <img
                    src={currentItem.src}
                    alt={currentItem.title}
                    className={`max-w-full max-h-[calc(100vh-200px)] object-contain transition-transform duration-300 ${
                      isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                ) : (
                  <VideoPlayer
                    url={currentItem.src}
                    title={currentItem.title}
                    autoPlay
                    controls
                    loop
                    className="w-full max-h-[calc(100vh-200px)] rounded-lg"
                    style={{ aspectRatio: currentItem.src.includes('vertical') ? '9/16' : '16/9' }}
                  />
                )}
              </div>

              {/* Info Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center max-w-2xl"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {currentItem.title}
                </h3>
                {currentItem.category && (
                  <p className="text-orange-600 font-medium mb-2">
                    {currentItem.category}
                  </p>
                )}
                {currentItem.description && (
                  <p className="text-gray-300 text-sm md:text-base">
                    {currentItem.description}
                  </p>
                )}
              </motion.div>

              {/* Thumbnail Navigation (optional - for many items) */}
              {items.length > 1 && items.length <= 10 && (
                <div className="mt-6 flex gap-2 overflow-x-auto max-w-full px-4">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(index);
                        setIsZoomed(false);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentIndex
                          ? 'border-orange-500 scale-110'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Keyboard Hints */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 text-white/60 text-xs">
            <span>ESC to close</span>
            {items.length > 1 && <span>← → to navigate</span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
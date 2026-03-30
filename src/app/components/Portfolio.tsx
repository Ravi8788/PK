import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn } from 'lucide-react';
import { portfolioAPI } from '@/app/utils/api';
import { Lightbox } from './Lightbox';

type Category = 'All' | 'Wedding Shoots' | 'Pre-Wedding Shoots' | 'Reels/Short Videos' | 'Creative/Commercial Shoots';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  image_url?: string;
  description?: string;
  media_type?: 'image' | 'video';
}

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<Category>('All');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await portfolioAPI.getAll();
      setPortfolioItems(data || []);
    } catch (error) {
      // Error already handled in API layer, just set empty array
      setPortfolioItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories: Category[] = ['All', 'Wedding Shoots', 'Pre-Wedding Shoots', 'Reels/Short Videos', 'Creative/Commercial Shoots'];

  const filteredItems = activeFilter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const lightboxItems = filteredItems.map(item => ({
    id: item.id,
    type: (item.media_type === 'video' ? 'video' : 'image') as 'image' | 'video',
    src: item.image_url || item.image,
    title: item.title,
    category: item.category,
    description: item.description,
  }));

  return (
    <section id="portfolio" className="py-24 bg-[#0a0a0a] text-white">
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
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Creative Work
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore a curated collection of my best photography and videography projects
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-900 text-gray-200 border border-gray-800 hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image_url || item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <div className="text-center text-white p-6">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <span className="text-sm text-orange-500">{item.category}</span>
                  </div>
                </div>

                {/* Bottom Info Bar */}
                <div className="p-4 bg-gray-900 border-t border-gray-800">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results Message */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        items={lightboxItems}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        currentIndex={currentImageIndex}
        onNavigate={setCurrentImageIndex}
      />
    </section>
  );
}
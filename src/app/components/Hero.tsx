import { motion } from 'motion/react';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1588420635201-3a9e2a2a0a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHN0dWRpbyUyMGVxdWlwbWVudCUyMGNhbWVyYXxlbnwxfHx8fDE3Njk1MzQ2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Photography Equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto py-20 md:py-32">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block text-amber-500 tracking-widest text-xs sm:text-sm uppercase font-semibold mb-4">
            ✨ Professional Photography & Videography
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-6"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Capturing Moments.
            <br />
            <motion.span
              initial={{ opacity: 0, backgroundPosition: '200% center' }}
              animate={{ 
                opacity: 1,
                backgroundPosition: 'center'
              }}
              transition={{ delay: 0.3, duration: 1 }}
              className="inline-block text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text"
            >
              Creating Stories.
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Specializing in weddings, creative shoots, and stunning visual content that brings your vision to life
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(217, 119, 6, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('#portfolio')}
            className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
          >
            View Portfolio
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('#contact')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white font-semibold border-2 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Contact Me
          </motion.button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mt-12 md:mt-20"
        >
          <div className="inline-block">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 text-gray-400 text-sm"
            >
              <ChevronDown size={20} className="text-amber-500" />
              <span>Scroll to explore</span>
              <ChevronDown size={20} className="text-amber-500" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Background Elements */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 right-5 sm:right-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-10 pointer-events-none"
      />
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          x: [0, -20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-1/4 left-5 sm:left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none"
      />
    </section>
  );
}

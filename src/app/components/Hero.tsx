import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

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
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.62)_66%,rgba(0,0,0,0.88)_100%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,106,0,0.16)_0%,rgba(255,106,0,0.02)_35%,rgba(0,0,0,0)_60%)]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-[radial-gradient(ellipse_at_bottom,rgba(255,102,0,0.22)_0%,rgba(255,102,0,0.08)_40%,rgba(0,0,0,0)_72%)]"></div>
        </motion.div>
      </div>

      {/* Full-frame corner accents */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute top-16 left-5 w-14 h-14 border-l-2 border-t-2 border-orange-600/60" />
        <div className="absolute top-16 right-5 w-14 h-14 border-r-2 border-t-2 border-orange-600/60" />
        <div className="absolute bottom-8 left-5 w-14 h-14 border-l-2 border-b-2 border-orange-600/60" />
        <div className="absolute bottom-8 right-5 w-14 h-14 border-r-2 border-b-2 border-orange-600/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto py-20 md:py-28">

        {/* Brand Mark Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img
            src="/images/logo.png"
            alt="PK Logo"
            className="w-56 sm:w-64 md:w-72 h-auto object-contain mx-auto"
          />
          <div className="w-24 h-0.5 bg-orange-600 mx-auto mt-2" />
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-5"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 leading-[1.05] tracking-tight">
            Capturing Moments.
            <br />
            <motion.span
              initial={{ opacity: 0, backgroundPosition: '200% center' }}
              animate={{ 
                opacity: 1,
                backgroundPosition: 'center'
              }}
              transition={{ delay: 0.3, duration: 1 }}
              className="inline-block text-transparent bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text"
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
          className="text-sm sm:text-base md:text-3xl text-gray-300 mb-7 md:mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Specializing in weddings, creative shoots, and stunning visual content that brings your vision to life
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-3 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(217, 119, 6, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('#portfolio')}
            className="w-full sm:w-auto group px-7 sm:px-10 py-3 sm:py-3.5 bg-orange-500 text-black font-bold rounded-full hover:bg-orange-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 tracking-wide text-sm"
          >
            View Portfolio
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('#contact')}
            className="w-full sm:w-auto px-7 sm:px-9 py-3 sm:py-3.5 bg-transparent text-white font-bold border border-white/70 rounded-full hover:bg-white hover:text-black transition-all duration-300 tracking-wide text-sm"
          >
            Contact Me
          </motion.button>
        </motion.div>

        <div className="mt-8 md:mt-10 flex justify-center">
          <div className="w-5 h-9 border border-white/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-orange-500" />
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { Camera, Video, Heart, Clapperboard, Sparkles, Users } from 'lucide-react';

interface Service {
  icon: typeof Camera;
  title: string;
  description: string;
  features: string[];
}

export function Services() {
  const services: Service[] = [
    {
      icon: Heart,
      title: 'Wedding Photography & Videography',
      description: 'Complete wedding coverage capturing every precious moment of your special day',
      features: ['Full-day coverage', 'Edited photo album', 'Cinematic video', 'Drone footage'],
    },
    {
      icon: Clapperboard,
      title: 'Reels & Social Media Content',
      description: 'Engaging vertical videos and content optimized for Instagram, TikTok, and other platforms',
      features: ['Instagram Reels', 'TikTok videos', 'YouTube Shorts', 'Trending transitions'],
    },
    {
      icon: Users,
      title: 'Event Shoots',
      description: 'Professional coverage of corporate events, birthdays, and special occasions',
      features: ['Corporate events', 'Birthday parties', 'Anniversaries', 'Product launches'],
    },
    {
      icon: Sparkles,
      title: 'Creative & Advertisement Shoots',
      description: 'High-quality commercial photography for brands, products, and creative campaigns',
      features: ['Product photography', 'Brand campaigns', 'Fashion shoots', 'Lifestyle content'],
    },
    {
      icon: Camera,
      title: 'Pre-Wedding Shoots',
      description: 'Romantic and creative pre-wedding photography sessions at stunning locations',
      features: ['Location scouting', 'Concept planning', 'Multiple outfits', 'Same-day edits'],
    },
    {
      icon: Video,
      title: 'Cinematic Videos',
      description: 'Professional video production with storytelling that captures emotions and moments',
      features: ['Story-driven edits', 'Color grading', 'Music licensing', '4K quality'],
    },
  ];

  return (
    <section id="services" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-orange-600 tracking-widest text-sm uppercase mb-2">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What I Offer
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Comprehensive photography and videography services tailored to your unique needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:shadow-2xl hover:border-orange-500 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={28} className="text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 mb-6">
            Looking for a custom package? Let's discuss your requirements
          </p>
          <button
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
          >
            Get a Custom Quote
          </button>
        </motion.div>
      </div>
    </section>
  );
}

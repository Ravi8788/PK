import { motion } from 'motion/react';
import { Camera, Video, Award, Users } from 'lucide-react';

export function About() {
  const stats = [
    { icon: Camera, value: '500+', label: 'Projects Completed' },
    { icon: Users, value: '300+', label: 'Happy Clients' },
    { icon: Award, value: '10+', label: 'Years Experience' },
    { icon: Video, value: '1000+', label: 'Reels Created' },
  ];

  return (
    <section id="about" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/images/pk-protrait.jpeg"
                alt="Photographer Profile"
                className="w-full h-[560px] md:h-[620px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-white">
                  <p className="text-orange-600 text-sm uppercase tracking-wider mb-1">Founder & Lead Photographer</p>
                  <h3 className="text-2xl font-bold">PK Graphics</h3>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500 rounded-full -z-10 blur-3xl opacity-30"></div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <span className="inline-block text-orange-600 tracking-widest text-sm uppercase mb-2">About Me</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Passionate About Visual Storytelling</h2>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Welcome to PK Graphics, where every frame tells a story. I'm a professional photographer and videographer
                specializing in weddings, creative shoots, and compelling visual content that captures the essence of your
                special moments.
              </p>

              <p>
                With over a decade of experience in the industry, I've had the privilege of documenting countless weddings,
                creating engaging reels for social media, and producing stunning commercial content for brands and individuals
                who value quality and creativity.
              </p>

              <p>
                My approach combines technical expertise with artistic vision, ensuring that every project reflects your unique
                story. Whether it's the intimate moments of your wedding day, the energy of a pre-wedding shoot, or the polish
                of commercial photography, I bring dedication and passion to every shoot.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-white font-semibold mb-2">Specializations:</p>
              <div className="flex flex-wrap gap-2">
                {['Wedding Photography', 'Videography', 'Reels & Social Media', 'Pre-Wedding Shoots', 'Commercial Photography', 'Event Coverage'].map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-gray-900 text-gray-200 border border-gray-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

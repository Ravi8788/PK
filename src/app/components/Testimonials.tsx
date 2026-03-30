import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { testimonialsAPI } from '@/app/utils/api';

interface Testimonial {
  id: string;
  name: string;
  client_name?: string;
  role: string;
  project_type?: string;
  image: string;
  client_image?: string;
  rating: number;
  text: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await testimonialsAPI.getAll();
      setTestimonials(data || []);
    } catch (error) {
      // Error already handled in API layer, just set empty array
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-amber-500 tracking-widest text-sm uppercase mb-2">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-amber-500/20">
                <Quote size={48} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-amber-500 fill-amber-500" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={testimonial.client_image || testimonial.image}
                    alt={testimonial.client_name || testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.client_name || testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.project_type || testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-4xl font-bold text-amber-500 mb-2">98%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-amber-500 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-amber-500 mb-2">300+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-amber-500 mb-2">500+</div>
            <div className="text-gray-600">Projects Done</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
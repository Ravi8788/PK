import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { contactAPI } from '@/app/utils/api';
import { toast } from 'sonner';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      await contactAPI.submit(formData);
      setSubmitMessage('Thank you! Your message has been sent successfully. I will get back to you soon.');
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.');
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-24 bg-white">
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
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Let's Create Something Amazing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it. Send me a message and let's discuss your vision.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <a href="mailto:contact@pkgraphics.com" className="text-gray-600 hover:text-amber-500 transition-colors">
                    contact@pkgraphics.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <a href="tel:+1234567890" className="text-gray-600 hover:text-amber-500 transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-600">
                    Mumbai, Maharashtra<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Follow Me</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Youtube size={20} />
                </a>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="mt-8 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1588420635201-3a9e2a2a0a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHN0dWRpbyUyMGVxdWlwbWVudCUyMGNhbWVyYXxlbnwxfHx8fDE3Njk1MzQ2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Studio"
                className="w-full h-64 object-cover"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </button>

                {submitMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                    {submitMessage}
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
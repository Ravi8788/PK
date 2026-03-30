import { Instagram, Youtube, MessageCircle, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Services', href: '#services' },
    { label: 'Admin Login', href: '/admin/login', external: true },
  ];

  const services = [
    { label: 'Wedding Photography', href: '#services' },
    { label: 'Pre-Wedding Shoots', href: '#services' },
    { label: 'Reels & Videos', href: '#services' },
    { label: 'Event Coverage', href: '#services' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-white">PK</span>
              <span className="text-amber-500"> Graphics</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Capturing moments and creating stories through professional photography and videography.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-amber-500 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="text-gray-400 hover:text-amber-500 transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.label}>
                  <a
                    href={service.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(service.href);
                    }}
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="mailto:contact@pkgraphics.com" className="hover:text-amber-500 transition-colors">
                  contact@pkgraphics.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-amber-500 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                Mumbai, Maharashtra<br />
                India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} PK Graphics. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <Heart size={14} className="text-amber-500 fill-amber-500" /> for creative souls
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
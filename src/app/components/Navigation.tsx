import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Reels', href: '#reels' },
    { label: 'Services', href: '#services' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-orange-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }} className="flex items-center space-x-2">
            <div className="text-xl font-bold tracking-tight">
              <span className="text-white">PK</span>
              <span className="text-orange-600"> Graphics</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-7">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className="text-gray-300 hover:text-orange-500 transition-colors text-xs font-semibold tracking-wide"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => scrollToSection('#contact')}
              className="px-5 py-2 bg-orange-500 text-black text-xs font-bold rounded-full hover:bg-orange-400 transition-colors tracking-wide"
            >
              BOOK NOW
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className="block text-gray-300 hover:text-orange-500 transition-colors py-2"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => scrollToSection('#contact')}
              className="w-full mt-2 px-4 py-2 bg-orange-500 text-black text-sm font-bold rounded-full hover:bg-orange-400 transition-colors"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

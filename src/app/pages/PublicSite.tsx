import { Hero } from '@/app/components/Hero';
import { About } from '@/app/components/About';
import { Portfolio } from '@/app/components/Portfolio';
import { Reels } from '@/app/components/Reels';
import { Services } from '@/app/components/Services';
import { Testimonials } from '@/app/components/Testimonials';
import { Contact } from '@/app/components/Contact';
import { Footer } from '@/app/components/Footer';
import { Navigation } from '@/app/components/Navigation';
import { useState, useEffect } from 'react';
import { portfolioAPI } from '@/app/utils/api';

export default function PublicSite() {
  const [hasContent, setHasContent] = useState(true);

  useEffect(() => {
    checkContent();
  }, []);

  const checkContent = async () => {
    try {
      const data = await portfolioAPI.getAll();
      setHasContent((data || []).length > 0);
    } catch (error) {
      // Error already handled in API layer
      setHasContent(false);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden scroll-smooth">
      <Navigation />
      
      {/* Main scrollable container with proper overflow */}
      <main className="w-full overflow-y-auto">
        <Hero />
        <About />
        <Portfolio />
        <Reels />
        <Services />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
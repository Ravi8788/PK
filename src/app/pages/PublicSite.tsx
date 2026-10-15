import { Hero } from '@/app/components/Hero';
import { About } from '@/app/components/About';
import { Portfolio } from '@/app/components/Portfolio';
import { Reels } from '@/app/components/Reels';
import { Services } from '@/app/components/Services';
import { Testimonials } from '@/app/components/Testimonials';
import { Contact } from '@/app/components/Contact';
import { Footer } from '@/app/components/Footer';
import { Navigation } from '@/app/components/Navigation';
import { Grain } from '@/app/components/public/Grain';
import { CustomCursor } from '@/app/components/public/CustomCursor';
import { SmoothScroll } from '@/app/lib/lenis';

export default function PublicSite() {
  return (
    <SmoothScroll>
      <div className="pk-public min-h-screen overflow-x-clip">
        <a className="pk-skip" href="#content">
          Skip to content
        </a>
        <Grain />
        <CustomCursor />
        <Navigation />
        <main id="content" className="w-full">
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
    </SmoothScroll>
  );
}
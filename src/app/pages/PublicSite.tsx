import { useState } from 'react';
import { About } from '@/app/components/public/About';
import { Contact } from '@/app/components/public/Contact';
import { CustomCursor } from '@/app/components/public/CustomCursor';
import { Featured } from '@/app/components/public/Featured';
import { FilmStripProgress } from '@/app/components/public/FilmStripProgress';
import { Footer } from '@/app/components/public/Footer';
import { Grain } from '@/app/components/public/Grain';
import { Hero } from '@/app/components/public/Hero';
import { Marquee } from '@/app/components/public/Marquee';
import { Navbar } from '@/app/components/public/Navbar';
import { Portfolio } from '@/app/components/public/Portfolio';
import { Preloader } from '@/app/components/public/Preloader';
import { Reels } from '@/app/components/public/Reels';
import { Services } from '@/app/components/public/Services';
import { Testimonials } from '@/app/components/public/Testimonials';
import { SmoothScroll } from '@/app/lib/lenis';
import { PublicDataProvider } from '@/app/lib/publicData';

export default function PublicSite() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <SmoothScroll>
      <PublicDataProvider>
        <div className="pk-public min-h-[100dvh]">
          {!introDone && <Preloader onDone={() => setIntroDone(true)} />}
          <a className="pk-skip" href="#content">
            Skip to content
          </a>
          <Grain />
          <CustomCursor />
          <Navbar />
          <FilmStripProgress />
          <main id="content">
            <Hero />
            <Marquee />
            <Featured />
            <Portfolio />
            <Reels />
            <Services />
            <About />
            <Testimonials />
            <Contact />
            <Footer />
          </main>
        </div>
      </PublicDataProvider>
    </SmoothScroll>
  );
}

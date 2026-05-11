import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import StatsStrip from './components/StatsStrip.jsx';
import About from './components/About.jsx';
import Gallery from './components/Gallery.jsx';
import Process from './components/Process.jsx';
import WhyChooseUs from './components/WhyChooseUs.jsx';
import LocationSection from './components/LocationSection.jsx';
import ContactForm from './components/ContactForm.jsx';
import CTASection from './components/CTASection.jsx';
import Footer from './components/Footer.jsx';

function App() {
  useEffect(() => {
    const scrollToHash = () => {
      const sectionId = window.location.hash.replace('#', '');
      if (!sectionId) return;
      const section = document.getElementById(sectionId);
      if (!section) return;
      window.scrollTo({ top: Math.max(section.offsetTop - 88, 0), behavior: 'auto' });
    };

    const timeoutIds = [80, 300, 800, 1500].map((delay) => window.setTimeout(scrollToHash, delay));
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <div className="min-h-screen bg-graphite text-cream">
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <About />
        <Process />
        <Gallery />
        <WhyChooseUs />
        <LocationSection />
        <ContactForm />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;

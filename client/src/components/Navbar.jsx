import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import logo from '../assets/logo/nsv-logo-uploaded-cropped.png';
import { companyData, navLinks } from '../data/companyData.js';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let frameId = 0;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 132;
      const sections = navLinks
        .map((link) => document.querySelector(link.href))
        .filter(Boolean);

      if (window.scrollY < 80) {
        setActiveSection('home');
        return;
      }

      const currentSection = sections.reduce((current, section) => {
        if (section.offsetTop <= scrollPosition) return section;
        return current;
      }, sections[0]);

      if (currentSection?.id) setActiveSection(currentSection.id);
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleNavClick = (event, href) => {
    event?.preventDefault();
    const sectionId = href.slice(1);
    const section = document.getElementById(sectionId);
    setActiveSection(sectionId);
    setIsOpen(false);
    if (section) {
      const top = section.offsetTop - 88;
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
      window.history.replaceState(null, '', href);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-line/80 bg-ink/88 shadow-premium backdrop-blur-xl'
          : 'border-b border-transparent bg-graphite/20'
      }`}
    >
      <nav className="section-shell flex h-20 items-center justify-between gap-4">
        <a href="#home" onClick={(event) => handleNavClick(event, '#home')} className="group flex min-w-0 items-center" aria-label="Go to home">
          <img
            src={logo}
            alt="NSV Engineering Works"
            className="h-12 w-[176px] rounded-md bg-ink object-contain object-center shadow-premium sm:w-[204px]"
            draggable="false"
          />
        </a>

        <div className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-panel text-gold shadow-copper' : 'text-smoke hover:bg-panel/70 hover:text-cream'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <a
            className="premium-button border border-copper/55 bg-copper text-ink shadow-copper hover:border-gold hover:bg-gold"
            href="#contact"
            onClick={(event) => handleNavClick(event, '#contact')}
          >
            <Phone size={18} aria-hidden="true" />
            Get Quote
          </a>
        </div>

        <button
          className="icon-button xl:hidden"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-line bg-ink/96 px-4 py-4 shadow-premium backdrop-blur-xl xl:hidden"
          >
            <div className="mx-auto flex max-w-md flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  className={`rounded-md px-4 py-3 text-sm font-semibold ${
                    activeSection === link.href.slice(1)
                      ? 'bg-panel text-gold'
                      : 'text-smoke hover:bg-panel hover:text-cream'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                className="premium-button mt-2 border border-copper/55 bg-copper text-ink hover:border-gold hover:bg-gold"
                href="#contact"
                onClick={(event) => handleNavClick(event, '#contact')}
              >
                <Phone size={18} aria-hidden="true" />
                Get Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;

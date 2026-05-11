import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { galleryItems } from '../data/galleryData.js';
import { fadeUp, staggerContainer } from '../utils/motion.js';

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [missingImages, setMissingImages] = useState({});
  const activeItem = useMemo(
    () => (activeIndex === null ? null : galleryItems[activeIndex]),
    [activeIndex],
  );

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current === null ? 0 : (current + 1) % galleryItems.length));
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === null ? galleryItems.length - 1 : (current - 1 + galleryItems.length) % galleryItems.length,
        );
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex]);

  const showPrevious = () =>
    setActiveIndex((current) => (current === null ? galleryItems.length - 1 : (current - 1 + galleryItems.length) % galleryItems.length));
  const showNext = () => setActiveIndex((current) => (current === null ? 0 : (current + 1) % galleryItems.length));

  return (
    <section id="gallery" className="bg-graphite py-24 md:py-32">
      <div className="section-shell">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-bold uppercase text-copper">Workshop portfolio</p>
          <h2 className="text-balance text-4xl font-black leading-tight text-cream md:text-5xl">
            Workshop & Job-Work Gallery
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {galleryItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              variants={fadeUp}
              onClick={() => setActiveIndex(index)}
              className="group relative overflow-hidden rounded-lg border border-line bg-panel text-left shadow-premium"
              aria-label={`Open gallery image: ${item.title}`}
            >
              {missingImages[item.id] ? (
                <div className="flex aspect-[1.18/1] w-full items-center justify-center bg-ink px-6 text-center">
                  <div>
                    <p className="text-sm font-black uppercase text-copper">Photo pending</p>
                    <p className="mt-3 text-sm leading-6 text-smoke">
                      Add this uploaded image as <span className="font-bold text-cream">{item.image.replace('/gallery/', '')}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src={item.image}
                  alt={item.alt}
                  className="aspect-[1.18/1] w-full object-cover brightness-105 contrast-105 saturate-110 transition duration-500 group-hover:scale-105 group-hover:brightness-110"
                  loading="lazy"
                  onError={() => setMissingImages((current) => ({ ...current, [item.id]: true }))}
                />
              )}
              <div className="absolute inset-0 bg-ink/0 transition duration-300 group-hover:bg-ink/5" />
              <span className="absolute right-4 top-4 flex h-10 w-10 shrink-0 translate-y-1 items-center justify-center rounded-md border border-line bg-ink/78 text-smoke opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:border-copper group-hover:text-gold group-hover:opacity-100">
                <Maximize2 size={18} aria-hidden="true" />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeItem.title} gallery preview`}
            onMouseDown={() => setActiveIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.28 }}
              className="relative w-full max-w-5xl rounded-lg border border-line bg-panel p-3 shadow-premium"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button type="button" className="icon-button absolute right-4 top-4 z-10 bg-ink/88" onClick={() => setActiveIndex(null)} aria-label="Close gallery preview">
                <X size={21} aria-hidden="true" />
              </button>
              {missingImages[activeItem.id] ? (
                <div className="flex min-h-[420px] w-full items-center justify-center rounded-md bg-ink px-6 text-center">
                  <div>
                    <p className="text-sm font-black uppercase text-copper">Photo pending</p>
                    <p className="mt-3 text-sm leading-6 text-smoke">
                      Add the uploaded image to <span className="font-bold text-cream">client/public/gallery/{activeItem.image.replace('/gallery/', '')}</span>.
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src={activeItem.image}
                  alt={activeItem.alt}
                  className="max-h-[72vh] w-full rounded-md object-contain brightness-105 contrast-105 saturate-110"
                  onError={() => setMissingImages((current) => ({ ...current, [activeItem.id]: true }))}
                />
              )}
              <div className="flex justify-end gap-2 border-t border-line px-2 py-4">
                  <button type="button" className="icon-button" onClick={showPrevious} aria-label="Previous image">
                    <ChevronLeft size={22} aria-hidden="true" />
                  </button>
                  <button type="button" className="icon-button" onClick={showNext} aria-label="Next image">
                    <ChevronRight size={22} aria-hidden="true" />
                  </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Gallery;

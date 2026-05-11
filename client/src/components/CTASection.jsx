import { motion } from 'framer-motion';
import { Phone, Send } from 'lucide-react';
import { companyData } from '../data/companyData.js';
import { fadeUp } from '../utils/motion.js';

function CTASection() {
  return (
    <section className="bg-graphite pb-24">
      <motion.div
        className="section-shell overflow-hidden rounded-lg border border-line bg-panel p-7 shadow-premium md:p-10"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="mb-8 h-1 w-24 bg-copper" />
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-balance text-3xl font-black leading-tight text-cream md:text-5xl">
              {companyData.cta.heading}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-smoke md:text-lg">{companyData.cta.text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <a className="premium-button border border-gold bg-gold px-6 text-ink hover:border-copper hover:bg-copper" href="#contact">
              <Send size={18} aria-hidden="true" />
              Get Quote
            </a>
            <a className="premium-button border border-line bg-ink px-6 text-cream hover:border-copper hover:bg-elevated" href="tel:+919080561615">
              <Phone size={18} aria-hidden="true" />
              Call Now
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default CTASection;

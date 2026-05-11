import { motion } from 'framer-motion';
import { companyData } from '../data/companyData.js';
import { fadeUp, staggerContainer } from '../utils/motion.js';

function StatsStrip() {
  return (
    <section id="stats" className="border-y border-line bg-ink py-8">
      <motion.div
        className="section-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {companyData.stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-lg border border-line bg-panel p-5 shadow-premium"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-copper transition-colors group-hover:bg-gold" />
            <p className="text-sm font-semibold text-muted">{stat.label}</p>
            <p className="mt-3 text-2xl font-black text-cream md:text-3xl">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default StatsStrip;

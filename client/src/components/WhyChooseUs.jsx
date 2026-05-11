import { motion } from 'framer-motion';
import { Clock3, Handshake, MapPinned, ShieldCheck, Star, Wrench } from 'lucide-react';
import { companyData } from '../data/companyData.js';
import { fadeUp, staggerContainer } from '../utils/motion.js';

const reasons = [
  {
    title: `Established Since ${companyData.establishedYear}`,
    text: 'A steady local engineering presence for CNC machining, finishing, and industrial job-work support.',
    icon: ShieldCheck,
  },
  {
    title: 'Coimbatore-Based Access',
    text: 'Located in Kannampalayam for practical access to local industrial requirements.',
    icon: MapPinned,
  },
  {
    title: 'Clear Call Hours',
    text: `${companyData.callHours} for enquiries, coordination, and visit planning.`,
    icon: Clock3,
  },
  {
    title: 'Customer-First Approach',
    text: 'Focused on clear communication, dependable service, and long-term relationships.',
    icon: Handshake,
  },
  {
    title: 'Practical Engineering Support',
    text: 'Support for real-world machining, cast component finishing, polishing, and job-work needs.',
    icon: Wrench,
  },
  {
    title: 'Trusted by Customers',
    text: 'Rated positively by local customers with 16 ratings.',
    icon: Star,
  },
];

function WhyChooseUs() {
  return (
    <section className="bg-graphite py-24 md:py-32">
      <div className="section-shell">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-bold uppercase text-copper">Why clients choose us</p>
          <h2 className="text-4xl font-black leading-tight text-cream md:text-5xl">
            <span className="block">Why Choose</span>
            <span className="block whitespace-nowrap text-[clamp(1.35rem,7vw,2.9rem)] md:text-[0.86em]">NSV Engineering Works</span>
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          {reasons.map(({ title, text, icon: Icon }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              className="group rounded-lg border border-line bg-panel p-6 shadow-premium transition duration-300 hover:-translate-y-1 hover:border-copper/60"
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md border border-line bg-ink text-copper transition group-hover:border-copper/60 group-hover:text-gold">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-black text-cream">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-smoke">{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default WhyChooseUs;

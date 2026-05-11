import { motion } from 'framer-motion';
import { Building2, CheckCircle2 } from 'lucide-react';
import { companyData } from '../data/companyData.js';
import { fadeUp } from '../utils/motion.js';

const profileRows = [
  ['Company Name', companyData.name],
  ['Work Focus', companyData.category],
  ['Established', companyData.establishedYear],
  ['Location', companyData.area],
  ['Call Hours', companyData.callHours],
  ['Rating', companyData.rating],
];

function About() {
  return (
    <section id="about" className="bg-graphite py-24 md:py-32">
      <div className="section-shell grid gap-12 lg:grid-cols-[1.05fr_0.75fr] lg:items-start">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
          <p className="mb-4 text-sm font-bold uppercase text-copper">About the company</p>
          <h2 className="text-4xl font-black leading-tight text-cream md:text-5xl">
            <span className="block">About</span>
            <span className="block whitespace-nowrap text-[clamp(1.35rem,7vw,2.9rem)] md:text-[0.86em]">NSV Engineering Works</span>
          </h2>
          <div className="mt-7 space-y-5 text-base leading-8 text-smoke md:text-lg">
            <p>
              NSV Engineering Works delivers precision CNC machining, cast component finishing,
              polishing, and industrial job-work support from Kannampalayam, Coimbatore. Since{' '}
              {companyData.establishedYear}, the company has focused on reliable workmanship for
              customers who value consistency, surface finish, and responsive service.
            </p>
            <p>
              With a customer-first approach and a practical quality mindset, the workshop supports
              industrial clients through clear communication, careful handling of requirements, and
              dependable finishing and machining work.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {['CNC machining support', 'Cast component finishing', 'Precision polishing', 'Kannampalayam, Coimbatore'].map(
              (item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-smoke">
                  <CheckCircle2 size={18} className="text-copper" aria-hidden="true" />
                  {item}
                </div>
              ),
            )}
          </div>
        </motion.div>

        <motion.aside
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-lg border border-line bg-panel p-6 shadow-premium"
          aria-label="Company profile"
        >
          <div className="mb-7 flex items-center gap-4 border-b border-line pb-6">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-md border border-copper/40 bg-ink text-gold">
              <Building2 size={26} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted">Company Profile</p>
              <h3 className="mt-1 text-2xl font-black text-cream">Workshop Profile</h3>
            </div>
          </div>

          <dl className="space-y-0">
            {profileRows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[0.85fr_1fr] gap-4 border-b border-line/70 py-4 last:border-b-0">
                <dt className="text-sm font-semibold text-muted">{label}</dt>
                <dd className="text-sm font-bold leading-6 text-cream">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.aside>
      </div>
    </section>
  );
}

export default About;

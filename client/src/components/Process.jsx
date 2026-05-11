import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ClipboardList, Hammer, PackageCheck, Ruler, ShieldCheck } from 'lucide-react';
import { fadeUp, staggerContainer } from '../utils/motion.js';

const steps = [
  {
    title: 'Requirement Discussion',
    text: 'We understand drawings, samples, finish requirements, quantity, and delivery expectations.',
    icon: ClipboardList,
  },
  {
    title: 'Planning & Method Selection',
    text: 'The process is planned based on material, casting condition, tolerance needs, and finishing requirement.',
    icon: Ruler,
  },
  {
    title: 'CNC Machining / Finishing',
    text: 'Machining, polishing, and finishing work is carried out with attention to consistency and surface quality.',
    icon: Hammer,
  },
  {
    title: 'Quality Review',
    text: 'Completed components are checked for finish, dimensions, and customer requirements.',
    icon: ShieldCheck,
  },
  {
    title: 'Delivery / Dispatch Support',
    text: 'Finished components are packed and prepared for pickup or dispatch as agreed.',
    icon: PackageCheck,
  },
];

function Process() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 78%', 'end 58%'],
  });
  const progressX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const progressY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="border-y border-line bg-ink py-24 md:py-32">
      <div className="section-shell">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-bold uppercase text-copper">Production flow</p>
          <h2 className="text-balance text-4xl font-black leading-tight text-cream md:text-5xl">
            From Requirement to Finished Component
          </h2>
        </motion.div>

        <div ref={timelineRef} className="relative mt-14">
          <div className="absolute left-6 top-0 h-full w-px bg-line xl:left-0 xl:top-8 xl:h-px xl:w-full" />
          <motion.div
            className="absolute left-6 top-0 hidden h-full w-px origin-top bg-copper xl:hidden"
            style={{ scaleY: progressY }}
          />
          <motion.div
            className="absolute left-0 top-8 hidden h-px origin-left bg-copper xl:block"
            style={{ scaleX: progressX, width: '100%' }}
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-5"
          >
            {steps.map(({ title, text, icon: Icon }, index) => (
              <motion.article
                variants={fadeUp}
                key={title}
                className="relative grid grid-cols-[48px_1fr] gap-4 rounded-lg border border-line bg-panel p-5 shadow-premium xl:block xl:pt-16"
              >
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-md border border-copper/50 bg-ink text-gold xl:absolute xl:left-5 xl:top-2">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-black text-copper">0{index + 1}</p>
                  <h3 className="mt-2 text-lg font-black leading-snug text-cream">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-smoke">{text}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Process;

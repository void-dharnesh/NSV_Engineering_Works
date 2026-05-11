import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, CalendarDays, Clock, Factory, MapPin, Send, Workflow } from 'lucide-react';
import closedMachine from '../assets/hero/cnc-closed.png';
import openMachine from '../assets/hero/cnc-open.png';
import SmartCallLink from './SmartCallLink.jsx';
import { companyData } from '../data/companyData.js';

const heroDetails = [
  { icon: CalendarDays, label: 'Established', value: companyData.establishedYear },
  { icon: Clock, label: 'Call Hours', value: companyData.callHours },
  { icon: MapPin, label: 'Area', value: companyData.area },
  { icon: Factory, label: 'Work', value: 'CNC Machining & Job Work' },
];

function Hero() {
  const heroRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  const closedOpacity = useTransform(scrollYProgress, [0, 0.18, 0.48, 0.76], [0.36, 0.3, 0.12, 0]);
  const openOpacity = useTransform(scrollYProgress, [0.12, 0.46, 0.76], [0, 0.22, 0.38]);
  const machineY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const machineScale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 42]);

  return (
    <section id="home" ref={heroRef} className="relative min-h-[190vh] overflow-clip bg-graphite">
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <motion.div
          className="technical-grid absolute inset-0 opacity-80"
          style={{ y: gridY }}
          aria-hidden="true"
        />
        <div className="hero-vignette absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink/85 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-graphite to-transparent" aria-hidden="true" />

        <div className="section-shell relative z-20 flex min-h-screen flex-col items-center justify-start pt-32 text-center md:pt-28">
          <div className="hero-copy-shield pointer-events-none absolute left-1/2 top-16 h-[430px] w-[min(1180px,100vw)] -translate-x-1/2" aria-hidden="true" />
          <div
            className="relative z-30 mx-auto max-w-[min(96vw,1320px)]"
          >
            <p
              className="mb-5 text-sm font-bold uppercase text-copper md:text-base"
            >
              Precision engineering job work
            </p>

            <h1
              className="hero-title-shadow text-balance text-5xl font-black leading-none text-cream sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              {companyData.name}
            </h1>

            <p
              className="brand-tagline hero-title-shadow mx-auto mt-5 whitespace-nowrap text-[clamp(1.05rem,3.1vw,2.7rem)] leading-none"
            >
              {companyData.tagline.toUpperCase()}
            </p>

            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <a
                href="#contact"
                className="premium-button border border-gold bg-gold px-6 text-ink hover:border-copper hover:bg-copper"
              >
                <Send size={18} aria-hidden="true" />
                Get a Quote
              </a>
              <a
                href="#process"
                className="premium-button border border-line bg-panel/70 px-6 text-cream hover:border-copper hover:bg-elevated"
              >
                <Workflow size={18} aria-hidden="true" />
                View Process
              </a>
              <SmartCallLink
                phoneNumber={companyData.phoneNumbers[0]}
                className="premium-button border border-line bg-ink/70 px-6 text-cream hover:border-copper hover:bg-elevated"
              >
                Call Now
              </SmartCallLink>
            </div>

            <motion.div
              className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } },
              }}
            >
              {heroDetails.map(({ icon: Icon, label, value }) => (
                <motion.div
                  key={`${label}-${value}`}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
                  }}
                  whileHover={{ y: -4, borderColor: 'rgba(242, 162, 13, 0.72)' }}
                  className="flex min-h-24 items-center gap-4 rounded-md border border-copper/30 bg-ink/86 px-5 py-4 text-left shadow-premium backdrop-blur-xl"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-copper/30 bg-panel/80 text-copper">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase text-muted">{label}</span>
                    <span className="mt-1 block text-sm font-black leading-snug text-cream">{value}</span>
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.a
            href="#stats"
            aria-label="Scroll to business stats"
            className="absolute bottom-7 left-1/2 z-30 hidden -translate-x-1/2 text-muted transition-colors hover:text-gold md:inline-flex"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={25} aria-hidden="true" />
          </motion.a>
        </div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[-2vh] z-10 mx-auto w-[min(1240px,116vw)] md:bottom-[-6vh] xl:bottom-[-4vh]"
          style={{
            y: prefersReducedMotion ? 0 : machineY,
            scale: prefersReducedMotion ? 1 : machineScale,
          }}
          aria-hidden="true"
        >
          <div className="relative aspect-[16/9] w-full">
            <motion.img
              src={openMachine}
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              style={{ opacity: prefersReducedMotion ? 0.58 : openOpacity }}
              draggable="false"
            />
            <motion.img
              src={closedMachine}
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              style={{ opacity: prefersReducedMotion ? 0.28 : closedOpacity }}
              draggable="false"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;

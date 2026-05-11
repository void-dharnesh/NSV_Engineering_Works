import { motion } from 'framer-motion';
import { ExternalLink, MapPin, MessageCircle, Phone } from 'lucide-react';
import { companyData } from '../data/companyData.js';
import { fadeUp } from '../utils/motion.js';

const googleMapsUrl = companyData.googleMapsUrl;
const whatsappUrl = `https://wa.me/919080561615?text=${encodeURIComponent(
  'Hello NSV Engineering Works, I would like to enquire about CNC machining or component finishing work.',
)}`;

function LocationSection() {
  return (
    <section id="visit" className="border-y border-line bg-ink py-24 md:py-32">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          className="rounded-lg border border-line bg-panel p-6 shadow-premium"
        >
          <p className="mb-4 text-sm font-bold uppercase text-copper">Location and contact</p>
          <h2 className="text-4xl font-black leading-tight text-cream md:text-5xl">
            <span className="block">Visit</span>
            <span className="block whitespace-nowrap text-[clamp(1.35rem,7vw,2.9rem)] md:text-[0.86em]">NSV Engineering Works</span>
          </h2>

          <div className="mt-8 space-y-5 text-sm leading-7 text-smoke">
            <div>
              <p className="font-bold text-cream">Address</p>
              <p>{companyData.address}</p>
            </div>
            <div>
              <p className="font-bold text-cream">Alternative Address</p>
              <p>{companyData.alternateAddress}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-bold text-cream">Area</p>
                <p>{companyData.area}</p>
              </div>
              <div>
                <p className="font-bold text-cream">Call Hours</p>
                <p>{companyData.callHours}</p>
              </div>
              <div>
                <p className="font-bold text-cream">Visit Note</p>
                <p>{companyData.visitNote}</p>
              </div>
              <div>
                <p className="font-bold text-cream">Contact Person</p>
                <p>
                  {companyData.contactPerson}, {companyData.role}
                </p>
              </div>
              <div>
                <p className="font-bold text-cream">Phone</p>
                <p>{companyData.phoneNumbers.join(' / ')}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a className="premium-button border border-copper bg-copper text-ink hover:border-gold hover:bg-gold" href="tel:+919080561615">
              <Phone size={18} aria-hidden="true" />
              Call +91 9080561615
            </a>
            <a className="premium-button border border-line bg-ink text-cream hover:border-copper hover:bg-elevated" href="tel:+918973496858">
              <Phone size={18} aria-hidden="true" />
              Call +91 8973496858
            </a>
            <a className="premium-button border border-line bg-ink text-cream hover:border-copper hover:bg-elevated" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp Enquiry
            </a>
            <a className="premium-button border border-line bg-ink text-cream hover:border-copper hover:bg-elevated" href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={18} aria-hidden="true" />
              Open in Google Maps
            </a>
          </div>
        </motion.div>

        <motion.a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          className="group relative min-h-[520px] overflow-hidden rounded-lg border border-line bg-panel shadow-premium transition duration-300 hover:border-copper/70"
          aria-label="Open NSV Engineering Works location in Google Maps"
        >
          <div className="technical-grid absolute inset-0 opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-graphite/45 to-ink/95" />
          <div className="absolute left-[16%] top-[22%] h-px w-[68%] bg-line" />
          <div className="absolute left-[26%] top-[62%] h-px w-[58%] bg-line" />
          <div className="absolute left-[36%] top-[12%] h-[76%] w-px bg-line" />
          <div className="absolute left-[66%] top-[16%] h-[70%] w-px bg-line" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-copper/70 bg-ink text-gold shadow-copper transition group-hover:scale-[1.03]">
              <MapPin size={36} aria-hidden="true" />
            </div>
            <div className="mt-5 max-w-md px-6">
              <p className="text-lg font-black text-cream">Find us on Google Maps</p>
              <p className="mt-2 text-sm leading-7 text-smoke">{companyData.landmark}</p>
              <p className="mt-1 text-sm leading-7 text-smoke">{companyData.area}</p>
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-line bg-ink/82 p-4 backdrop-blur-md">
            <p className="text-sm font-bold text-cream">Click to open location</p>
            <p className="mt-1 text-sm leading-6 text-muted">{companyData.visitNote}</p>
          </div>
        </motion.a>
      </div>
    </section>
  );
}

export default LocationSection;

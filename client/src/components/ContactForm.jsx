import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Loader2, MailCheck, MapPin, Phone, UserRound } from 'lucide-react';
import { companyData } from '../data/companyData.js';
import { fadeUp } from '../utils/motion.js';

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  requirementType: 'CNC Machining',
  message: '',
};

const requirementTypes = [
  'CNC Machining',
  'Cast Component Finishing',
  'Precision Polishing',
  'Industrial Job Work',
  'General Enquiry',
];

const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

function validateForm(form) {
  if (!form.fullName.trim()) return 'Please enter your full name.';
  if (!/^[0-9+\-\s()]{8,18}$/.test(form.phone.trim())) return 'Please enter a valid phone number.';
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address.';
  if (!form.requirementType) return 'Please select a requirement type.';
  if (!form.message.trim() || form.message.trim().length < 10) return 'Please add a few details about your requirement.';
  return '';
}

function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status.type !== 'idle') setStatus({ type: 'idle', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm(form);
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    setStatus({ type: 'loading', message: 'Sending your enquiry...' });

    try {
      const response = await fetch(`${apiBaseUrl}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit enquiry right now.');
      }

      setForm(initialForm);
      setStatus({
        type: 'success',
        message: 'Your enquiry has been received. NSV Engineering Works can follow up with you shortly.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to submit enquiry. Please call the manager directly.',
      });
    }
  };

  return (
    <section id="contact" className="bg-graphite py-24 md:py-32">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.75fr_1.1fr]">
        <motion.aside
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.24 }}
          className="rounded-lg border border-line bg-panel p-6 shadow-premium"
        >
          <p className="mb-4 text-sm font-bold uppercase text-copper">Direct contact</p>
          <h2 className="text-4xl font-black leading-tight text-cream">Send an Enquiry</h2>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-4 border-b border-line pb-4">
              <UserRound size={21} className="mt-1 text-copper" aria-hidden="true" />
              <div>
                <p className="font-black text-cream">{companyData.contactPerson}</p>
                <p className="text-sm text-smoke">{companyData.role}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 border-b border-line pb-4">
              <Phone size={21} className="mt-1 text-copper" aria-hidden="true" />
              <div>
                {companyData.phoneNumbers.map((phoneNumber, index) => (
                  <a
                    key={phoneNumber}
                    className={`${index > 0 ? 'mt-1 ' : ''}block font-bold text-cream hover:text-gold`}
                    href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}
                  >
                    {phoneNumber}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-4 border-b border-line pb-4">
              <Clock size={21} className="mt-1 text-copper" aria-hidden="true" />
              <div>
                <p className="font-bold text-cream">{companyData.businessHours}</p>
                <p className="mt-1 text-sm leading-6 text-smoke">{companyData.visitNote}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin size={21} className="mt-1 text-copper" aria-hidden="true" />
              <p className="text-sm leading-7 text-smoke">{companyData.area}</p>
            </div>
          </div>
        </motion.aside>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          onSubmit={handleSubmit}
          className="rounded-lg border border-line bg-panel p-6 shadow-premium md:p-8"
          noValidate
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-cream">Full Name</span>
              <input
                className="form-field"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-cream">Phone Number</span>
              <input
                className="form-field"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91"
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-cream">Email</span>
              <input
                className="form-field"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                autoComplete="email"
                inputMode="email"
                type="email"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-cream">Requirement Type</span>
              <select className="form-field" name="requirementType" value={form.requirementType} onChange={handleChange} required>
                {requirementTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-cream">Message / Requirement Details</span>
            <textarea
              className="form-field min-h-40 resize-y"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Share drawings, samples, casting condition, finish requirement, quantity, or delivery expectations."
              required
            />
          </label>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="premium-button border border-gold bg-gold px-6 text-ink hover:border-copper hover:bg-copper disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status.type === 'loading' ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <MailCheck size={18} aria-hidden="true" />}
              {status.type === 'loading' ? 'Sending...' : 'Submit Enquiry'}
            </button>

            <p
              className={`min-h-6 text-sm font-semibold ${
                status.type === 'success' ? 'text-gold' : status.type === 'error' ? 'text-red-300' : 'text-muted'
              }`}
              role={status.type === 'error' ? 'alert' : 'status'}
            >
              {status.message}
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

export default ContactForm;

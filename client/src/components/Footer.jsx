import { companyData } from '../data/companyData.js';
import logo from '../assets/logo/nsv-logo-uploaded-cropped.png';

function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="section-shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center">
              <img
                src={logo}
                alt="NSV Engineering Works"
                className="h-20 w-[286px] max-w-full rounded-md bg-ink object-contain object-center"
                draggable="false"
              />
            </div>
            <p className="max-w-sm text-sm font-semibold leading-7 text-copper">{companyData.category}</p>
            <p className="max-w-sm text-sm leading-7 text-muted">{companyData.address}</p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase text-cream">Contact</h3>
            <p className="mt-4 text-sm leading-7 text-smoke">
              {companyData.contactPerson}, {companyData.role}
            </p>
            <a className="mt-3 block text-sm font-bold text-smoke hover:text-gold" href="tel:+919080561615">
              +91 9080561615
            </a>
            <a className="mt-2 block text-sm font-bold text-smoke hover:text-gold" href="tel:+918973496858">
              +91 8973496858
            </a>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase text-cream">Services</h3>
            <div className="mt-4 flex flex-col gap-3">
              {companyData.services.slice(0, 5).map((service) => (
                <span key={service} className="text-sm font-semibold text-smoke">
                  {service}
                </span>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-10 border-t border-line pt-6 text-sm text-muted">
          &copy; 2026 NSV Engineering Works. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

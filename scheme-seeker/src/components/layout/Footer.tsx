import { Link } from 'react-router-dom';
import { ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="font-bold text-accent-foreground text-lg">Y</span>
              </div>
              <span className="font-heading font-bold text-xl">YojnaDarshan</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Empowering every Indian citizen to discover and access government welfare schemes they deserve.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs">
                Atmanirbhar Bharat
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs">
                Digital India
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Browse Schemes
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Check Eligibility
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Government Resources */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Government Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-flex items-center gap-1">
                  India.gov.in <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-flex items-center gap-1">
                  MyScheme Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://digilocker.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-flex items-center gap-1">
                  DigiLocker <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://uidai.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-flex items-center gap-1">
                  UIDAI / Aadhaar <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <Mail className="w-4 h-4 mt-0.5" />
                <span>support@yojnadarshan.gov.in</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <Phone className="w-4 h-4 mt-0.5" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© 2026 YojnaDarshan. A citizen-centric initiative.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-foreground transition-colors">
                Terms of Use
              </Link>
              <Link to="/accessibility" className="hover:text-primary-foreground transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

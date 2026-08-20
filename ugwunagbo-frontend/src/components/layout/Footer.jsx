import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube, 
  FaMapMarkerAlt, FaPhone, FaEnvelope 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#006400] text-white">
      <div className="container-custom px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
          {/* Column 1 - About */}
          <div className="footer-column">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b-2 border-[#ffcc00] pb-2 inline-block">Ugwunagbo LGA</h3>
            <p className="text-gray-200 text-sm leading-relaxed mt-2 sm:mt-3">
              Committed to serving our community with integrity, transparency,
              and excellence.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4 mt-3 sm:mt-4">
              <a 
                href="https://web.facebook.com/p/Ugwunagbo-L-G-A-100078652665899/?_rdc=1&_rdr#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#ffcc00] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>
              <a 
                href="https://x.com/UgwunagboCarn" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#ffcc00] transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="https://www.instagram.com/ugwunagbocarnival/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#ffcc00] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://www.youtube.com/watch?v=_avhi4oZEQ0" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#ffcc00] transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 - Departments */}
          <div className="footer-column">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b-2 border-[#ffcc00] pb-2 inline-block">Departments</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm mt-2 sm:mt-3">
              <li>
                <Link to="/department/admin" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Administration
                </Link>
              </li>
              <li>
                <Link to="/department/finance" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Finance
                </Link>
              </li>
              <li>
                <Link to="/department/planning" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Planning
                </Link>
              </li>
              <li>
                <Link to="/department/health" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link to="/department/judiciary" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Judiciary
                </Link>
              </li>
              <li>
                <Link to="/department/inec" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  INEC
                </Link>
              </li>
              <li>
                <Link to="/department/security" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div className="footer-column">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b-2 border-[#ffcc00] pb-2 inline-block">Services</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm mt-2 sm:mt-3">
              <li>
                <Link to="/apply-for-service" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Birth Registration
                </Link>
              </li>
              <li>
                <Link to="/apply-for-service" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Revenue Collection
                </Link>
              </li>
              <li>
                <Link to="/apply-for-service" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Business Permits
                </Link>
              </li>
              <li>
                <Link to="/apply-for-service" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Health Services
                </Link>
              </li>
              <li>
                <Link to="/apply-for-service" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Social Welfare
                </Link>
              </li>
              <li>
                <Link to="/department/budget-planning" className="text-gray-200 hover:text-[#ffcc00] transition-colors">
                  Budget & Planning
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div className="footer-column">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b-2 border-[#ffcc00] pb-2 inline-block">Contact Info</h3>
            <ul className="space-y-3 text-sm mt-2 sm:mt-3">
              <li className="flex items-start justify-center sm:justify-start space-x-3 text-gray-200">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-[#ffcc00]" />
                <span className="text-left">Ugwunagbo LGA Secretariat</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-3 text-gray-200">
                <FaPhone className="text-[#ffcc00]" />
                <span>+234 123 456 7890</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-3 text-gray-200">
                <FaEnvelope className="text-[#ffcc00]" />
                <span className="break-all">info@ugwunagbolga.gov.ng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Links Bottom */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 text-center">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm text-gray-400">
            <Link to="/privacy-policy" className="hover:text-[#ffcc00] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/terms-of-service" className="hover:text-[#ffcc00] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 pt-4 border-t border-[#ffcc00]/30 text-xs sm:text-sm text-gray-300">
          <p>Courtesy Of SmartDevTechs</p>
          <p className="mt-1">
            &copy; {currentYear} Ugwunagbo Local Government Area. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { FaShieldAlt, FaClock, FaPhoneAlt } from 'react-icons/fa';
import WheelLogo from './WheelLogo';

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content mt-16 border-t border-base-200">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <WheelLogo size="md" />
            <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              WheelShare
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Affordable, reliable, and verified car and bike rentals across Mumbai and Pune. Zero hidden charges, 100% verified vehicles.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FaPhoneAlt className="text-primary" /> +91 98765 43210 (24x7 Helpline)
          </div>
        </div>

        <div>
          <h4 className="footer-title text-base-content font-bold mb-3">Vehicle Categories</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Compact Sedans & Hatchbacks</li>
            <li>Premium SUVs & 4x4 Offroaders</li>
            <li>Cruiser & Adventure Motorcycles</li>
            <li>City Scooters for Daily Commutes</li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title text-base-content font-bold mb-3">Rental Highlights</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><FaShieldAlt className="text-success" /> Verified Driving Licenses</li>
            <li className="flex items-center gap-2"><FaClock className="text-primary" /> Flexible Hourly & Daily Rates</li>
            <li className="flex items-center gap-2">📍 Hub Pickups & Doorstep Returns</li>
            <li className="flex items-center gap-2">⭐ Real User Reviews & Ratings</li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title text-base-content font-bold mb-3">TYCS MERN Project</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Full-Stack Final Year Project built with Node.js, Express, MongoDB Atlas, React, Tailwind CSS & DaisyUI. Complete with 15 Core Features.
          </p>
          <div className="mt-3 text-xs text-gray-400">
            © 2026 WheelShare Car & Bike Rental. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

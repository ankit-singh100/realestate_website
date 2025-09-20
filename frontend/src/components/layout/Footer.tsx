import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-white">BiratEstate</h2>
          <p className="mt-3 text-gray-400">
            Your trusted real estate partner.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/property" className="hover:text-blue-400">
                Property
              </Link>
            </li>
          </ul>
        </div>

        {/* contact /social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact us</h3>
          <p className="text-gray-400">Biratnagar, Nepal</p>
          <p className="text-gray-400">+977 980000000</p>
          <p className="text-gray-400">support@biratEstate.com</p>

          {/* Social icons */}
          <div className="flex space-x-4 mt-4">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 "
            >
              <Facebook />
            </a>
            <a className="hover:text-blue-400 ">
              <Linkedin />
            </a>
            <a className="hover:text-blue-400 ">
              <Instagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center">
        ©{new Date().getFullYear()} BiratEstate. All right reserved.
      </div>
    </footer>
  );
}

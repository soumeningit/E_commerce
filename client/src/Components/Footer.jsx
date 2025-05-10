import { ChevronRight } from "lucide-react";
import React from "react";
import { MdOutlineKeyboardControlKey } from "react-icons/md";
import { NavLink } from "react-router-dom";
import logo from "../image/logo.png";

function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="w-full mt-16 bg-gradient-to-t from-gray-800 to-gray-900 text-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <NavLink to="/">
              <img
                src={logo}
                alt="Organic Harvest Logo"
                className="h-16 w-16 rounded-full transform hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </NavLink>
            <p className="mt-4 text-lg font-semibold text-gray-300 text-center md:text-left">
              © {new Date().getFullYear()} Organic Harvest
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Company Links */}
            <div>
              <h3 className="text-xl font-bold text-gray-100 mb-6">Company</h3>
              <ul className="flex flex-col space-y-3 text-sm font-medium">
                <li>
                  <NavLink
                    to="/about"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    About us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/history"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Company History
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/team"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Our Team
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/vision"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Our Vision
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/press"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Press Release
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-xl font-bold text-gray-100 mb-6">Legal</h3>
              <ul className="flex flex-col space-y-3 text-sm font-medium">
                <li>
                  <NavLink
                    to="/privacy"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Privacy Policy
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/terms"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Terms of Service
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cookie-policy"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Cookie Policy
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/disclaimer"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Disclaimer
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/media-policy"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Media Policy
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold text-gray-100 mb-6">
                Social Links
              </h3>
              <ul className="flex flex-col space-y-3 text-sm font-medium">
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-green-400 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div
          className="absolute right-4 bottom-4 bg-green-500 text-white rounded-full p-3 cursor-pointer hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
          onClick={scrollToTop}
        >
          <MdOutlineKeyboardControlKey className="text-2xl" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;

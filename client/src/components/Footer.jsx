// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Logo */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <img src="images/rarelogo.png" alt="Footer Logo" className="h-10" />
        </div>

        {/* Right Side: Navigation Links and Social Media Icons */}
        <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-4 text-center md:text-right">
          <a href="#" className="text-teal-400 hover:text-teal-300">Home</a>
          <a href="#" className="text-teal-400 hover:text-teal-300">Explore</a>
          <a href="#" className="text-teal-400 hover:text-teal-300">About Us</a>
          <a href="#" className="text-teal-400 hover:text-teal-300">Contact</a>
        </div>
      </div>

      {/* Social Media Icons (Centered) */}
      <div className="text-center mt-4">
        <a href="#" className="text-teal-400 hover:text-teal-300">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" className="text-teal-400 hover:text-teal-300">
          <i className="fab fa-github"></i>
        </a>
        <a href="#" className="text-teal-400 hover:text-teal-300">
          <i className="fab fa-medium"></i>
        </a>
        {/* Add more social media icons as needed */}
      </div>

      {/* Bottom Section: Copyright */}
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} RARE by Vyom Padalia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

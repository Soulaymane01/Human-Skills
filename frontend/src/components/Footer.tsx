import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4">

        {/* Copyright */}
        <div className="pt-4 text-center text-sm">
          © {new Date().getFullYear()} Human Skills. All rights reserved.
        </div>
    </footer>
  );
}

export default Footer;
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">AffiliateHub</h3>
            <p className="text-gray-400">The ultimate platform for affiliate marketers to discover, manage, and promote products.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-accent transition">Browse Products</a></li>
              <li><a href="/add-product" className="hover:text-accent transition">Add Product</a></li>
              <li><a href="/dashboard" className="hover:text-accent transition">My Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-accent transition"><FaFacebook /></a>
              <a href="#" className="hover:text-accent transition"><FaTwitter /></a>
              <a href="#" className="hover:text-accent transition"><FaInstagram /></a>
              <a href="#" className="hover:text-accent transition"><FaLinkedin /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} AffiliateHub. All rights reserved. | Powered by Next.js & DevOps Agent</p>
        </div>
      </div>
    </footer>
  );
}

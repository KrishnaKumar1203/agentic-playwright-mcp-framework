import React from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaPlus, FaTrophy } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition">
          <FaShoppingCart className="text-accent" />
          <span>AffiliateHub</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-accent transition font-semibold">
            Products
          </Link>
          <Link href="/add-product" className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold">
            <FaPlus /> Add Product
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 text-accent hover:text-yellow-300 transition">
            <FaTrophy /> Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

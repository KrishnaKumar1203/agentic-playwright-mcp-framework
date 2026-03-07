import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="py-16 md:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-dark mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Earn Money with Affiliate Marketing
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover amazing products, share affiliate links, and earn passive income. 
          Join thousands of successful affiliate marketers today!
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/add-product"
            className="bg-accent text-primary px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition shadow-lg"
          >
            Start Earning Now
          </a>
          <a
            href="#products"
            className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition"
          >
            Browse Products
          </a>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {[
          { number: '1000+', label: 'Products' },
          { number: '5000+', label: 'Affiliates' },
          { number: '$2.5M+', label: 'Earned' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
            <p className="text-gray-600 font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

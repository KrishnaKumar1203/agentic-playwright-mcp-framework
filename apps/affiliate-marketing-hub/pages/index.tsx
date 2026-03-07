import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/productStore';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
  const products = useProductStore((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <Layout>
      <Hero />

      {/* Filters & Search */}
      <section id="products" className="py-12">
        <h2 className="text-4xl font-bold text-dark mb-8">Featured Products</h2>

        {/* Search Bar */}
        <div className="mb-8 flex items-center bg-white rounded-xl shadow-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-dark"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products found. Try adjusting your filters!</p>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Showing <span className="font-bold text-primary">{filteredProducts.length}</span> of{' '}
            <span className="font-bold text-primary">{products.length}</span> products
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-12 my-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Earn More?</h2>
        <p className="text-lg mb-6 opacity-90">Add your own products and start building your affiliate network today!</p>
        <a
          href="/add-product"
          className="inline-block bg-accent text-primary px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
        >
          List Your Product Now
        </a>
      </section>
    </Layout>
  );
}

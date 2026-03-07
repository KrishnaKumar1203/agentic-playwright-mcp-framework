import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useProductStore } from '../store/productStore';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaImage } from 'react-icons/fa';

export default function AddProduct() {
  const addProduct = useProductStore((state) => state.addProduct);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    commission: '',
    category: 'Software',
    image: '',
    affiliateLink: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.commission ||
      !formData.image ||
      !formData.affiliateLink
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      addProduct({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        commission: formData.commission,
        category: formData.category,
        image: formData.image,
        affiliateLink: formData.affiliateLink,
      });

      toast.success('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        commission: '',
        category: 'Software',
        image: '',
        affiliateLink: '',
      });
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Add New Product</h1>
          <p className="text-gray-600">
            Share an amazing product with our affiliate network and start earning commissions!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., ProVideo Editor Pro"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
            />
          </div>

          {/* Price & Commission */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Price *</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., $79.99"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Commission *</label>
              <input
                type="text"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                placeholder="e.g., 30%"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
            >
              <option value="Software">Software</option>
              <option value="Cloud Storage">Cloud Storage</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              <FaImage className="inline mr-2" />
              Product Image URL *
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
            />
            {formData.image && (
              <div className="mt-3 rounded-lg overflow-hidden h-48">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => toast.error('Image URL is invalid')}
                />
              </div>
            )}
          </div>

          {/* Affiliate Link */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Affiliate Link *</label>
            <input
              type="url"
              name="affiliateLink"
              value={formData.affiliateLink}
              onChange={handleChange}
              placeholder="https://example.com?ref=your-affiliate-id"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
            <a
              href="/"
              className="flex-1 bg-gray-100 text-dark py-3 rounded-lg font-bold hover:bg-gray-200 transition text-center"
            >
              Cancel
            </a>
          </div>
        </form>
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}

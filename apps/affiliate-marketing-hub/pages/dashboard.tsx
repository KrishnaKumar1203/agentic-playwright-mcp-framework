import React, { useMemo } from 'react';
import Layout from '../components/Layout';
import { useProductStore } from '../store/productStore';
import { FaTrash, FaEdit, FaChartBar, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { products, deleteProduct } = useProductStore((state) => ({
    products: state.products,
    deleteProduct: state.deleteProduct,
  }));

  const stats = useMemo(() => {
    const totalClicks = products.reduce((sum, p) => sum + p.clicks, 0);
    const totalDownloads = products.reduce((sum, p) => sum + p.downloads, 0);
    const avgCVR =
      totalClicks > 0
        ? ((totalDownloads / totalClicks) * 100).toFixed(2)
        : '0.00';
    const topProduct = products.reduce((top, p) => (p.clicks > top.clicks ? p : top), products[0]);

    return {
      totalProducts: products.length,
      totalClicks,
      totalDownloads,
      avgCVR,
      topProduct,
    };
  }, [products]);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold text-dark mb-8">Your Affiliate Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Products</p>
            <p className="text-4xl font-bold text-primary">{stats.totalProducts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Clicks</p>
            <p className="text-4xl font-bold text-secondary">{stats.totalClicks.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <p className="text-gray-600 text-sm font-semibold mb-2">Downloads</p>
            <p className="text-4xl font-bold text-green-600">{stats.totalDownloads.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <p className="text-gray-600 text-sm font-semibold mb-2">Avg CVR</p>
            <p className="text-4xl font-bold text-blue-600">{stats.avgCVR}%</p>
          </motion.div>
        </div>

        {/* Top Performer */}
        {stats.topProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-accent to-yellow-400 rounded-xl p-8 mb-12 text-dark"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaTrophy className="text-2xl" />
              <h2 className="text-2xl font-bold">Top Performer</h2>
            </div>
            <p className="text-lg font-semibold mb-2">{stats.topProduct.name}</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-80">Clicks</p>
                <p className="text-2xl font-bold">{stats.topProduct.clicks}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Downloads</p>
                <p className="text-2xl font-bold">{stats.topProduct.downloads}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">CVR</p>
                <p className="text-2xl font-bold">
                  {stats.topProduct.clicks > 0
                    ? ((stats.topProduct.downloads / stats.topProduct.clicks) * 100).toFixed(1)
                    : '0'}
                  %
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FaChartBar className="text-primary" />
              <h2 className="text-2xl font-bold text-dark">Your Products</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Clicks</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Downloads</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">CVR</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Commission</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="font-semibold text-dark">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-center font-semibold text-dark">
                      {product.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-dark">
                      {product.downloads.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-primary">
                      {product.clicks > 0
                        ? ((product.downloads / product.clicks) * 100).toFixed(1)
                        : '0'}
                      %
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-secondary">
                      {product.commission}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 transition font-semibold inline-flex items-center gap-1"
                      >
                        <FaTrash className="text-sm" /> Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No products yet. Start by adding your first product!</p>
              <a
                href="/add-product"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Add Your First Product
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}

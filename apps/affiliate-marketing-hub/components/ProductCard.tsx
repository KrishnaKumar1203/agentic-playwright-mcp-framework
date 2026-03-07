import React from 'react';
import { FaStar, FaLink, FaEye, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  commission: string;
  category: string;
  image: string;
  rating: number;
  clicks: number;
  downloads: number;
  affiliateLink: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  commission,
  category,
  image,
  rating,
  clicks,
  downloads,
  affiliateLink,
}: ProductCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary to-blue-600 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-dark flex-1">{name}</h3>
          <div className="flex items-center gap-1 text-accent">
            <FaStar className="text-sm" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        {/* Price & Commission */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase">Price</p>
            <p className="text-primary text-xl font-bold">{price}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase">Commission</p>
            <p className="text-secondary text-xl font-bold">{commission}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="bg-blue-50 p-2 rounded text-center">
            <FaEye className="text-primary mx-auto mb-1" />
            <p className="font-semibold text-dark">{clicks}</p>
            <p className="text-gray-600">clicks</p>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <FaDownload className="text-green-600 mx-auto mb-1" />
            <p className="font-semibold text-dark">{downloads}</p>
            <p className="text-gray-600">downloads</p>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center">
            <span className="text-purple-600 font-semibold text-lg">{Math.round((downloads / clicks) * 100) || 0}%</span>
            <p className="text-gray-600">CVR</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white py-2 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 font-semibold"
          >
            <FaLink className="text-sm" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-100 text-dark py-2 rounded-lg hover:bg-gray-200 transition font-semibold text-center"
          >
            Visit
          </a>
        </div>
      </div>
    </motion.div>
  );
}

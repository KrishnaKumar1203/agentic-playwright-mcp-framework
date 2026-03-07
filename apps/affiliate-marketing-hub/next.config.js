/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'vercel.com', 'unsplash.com', 'via.placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'AffiliateHub',
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:3000/api',
  }
};

module.exports = nextConfig;

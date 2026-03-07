# Affiliate Marketing Hub 🚀

A modern, feature-rich affiliate marketing platform built with Next.js, React, and TypeScript.

## Features ✨

- **Product Showcase**: Beautiful product cards with images, descriptions, pricing, and commission info
- **Smart Search & Filter**: Easily find products by name, category, or keyword
- **Add Products**: Simple form to add new affiliate products
- **Dashboard**: Real-time analytics with:
  - Total clicks and downloads tracking
  - Conversion rate calculation (CVR)
  - Top-performing products
  - Product performance metrics
- **Copy Affiliate Links**: One-click copy functionality for sharing
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Smooth animations and transitions with Framer Motion

## Tech Stack 🛠️

- **Framework**: Next.js 14 + React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Notifications**: React Toastify

## Getting Started

### Installation

```bash
cd apps/affiliate-marketing-hub
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
affiliate-marketing-hub/
├── pages/
│   ├── _app.tsx           # Next.js app wrapper
│   ├── index.tsx          # Home page with product showcase
│   ├── add-product.tsx    # Add new product page
│   └── dashboard.tsx      # Analytics dashboard
├── components/
│   ├── Layout.tsx         # Main layout wrapper
│   ├── Navbar.tsx         # Navigation bar
│   ├── Footer.tsx         # Footer
│   ├── Hero.tsx           # Hero section
│   └── ProductCard.tsx    # Product card component
├── store/
│   └── productStore.ts    # Zustand product store
├── styles/
│   └── globals.css        # Global styles
└── public/                # Static files
```

## Usage

### Browse Products

The home page displays all available affiliate products with:
- Product image and name
- Description and rating
- Price and commission info
- Click and download metrics
- Quick link copy and visit buttons

### Add Products

Navigate to `/add-product` to add a new product with:
- Product name and description
- Price and commission percentage
- Category selection
- Product image URL
- Affiliate link

### View Analytics

Visit `/dashboard` to see:
- Total products, clicks, downloads
- Average conversion rate (CVR)
- Top-performing product
- Detailed product performance table

## Deployment with DevOps Agent

Deploy this application using the agent-dev-ops:

```json
{
  "docker": {
    "action": "build",
    "imageName": "affiliate-marketing-hub",
    "tags": ["latest", "v1.0.0"],
    "dockerfile": "Dockerfile"
  }
}
```

Then push and deploy:

```json
{
  "jenkins": {
    "action": "trigger",
    "jobName": "deploy-affiliate-hub",
    "parameters": {
      "BRANCH": "main",
      "ENVIRONMENT": "production"
    }
  }
}
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_NAME=AffiliateHub
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Features Coming Soon 🎯

- [ ] User authentication
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] API endpoints for product management
- [ ] Commission tracking and payouts
- [ ] Export reports
- [ ] PDF affiliate materials

## License

MIT

---

**Version**: 1.0.0  
**Created**: March 7, 2026

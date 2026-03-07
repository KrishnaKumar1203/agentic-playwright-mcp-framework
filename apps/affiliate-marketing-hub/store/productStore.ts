import { create } from 'zustand';

export interface Product {
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
  createdAt: string;
}

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'clicks' | 'downloads' | 'rating'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  trackClick: (id: string) => void;
  trackDownload: (id: string) => void;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ProVideo Editor Pro',
    description: 'Professional video editing software with AI-powered features',
    price: '$79.99',
    commission: '30%',
    category: 'Software',
    image: 'https://via.placeholder.com/300x200?text=ProVideo+Editor',
    rating: 4.8,
    clicks: 2450,
    downloads: 156,
    affiliateLink: 'https://example.com/provideo?ref=affiliate',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'CloudSync Premium',
    description: 'Unlimited cloud storage with advanced collaboration tools',
    price: '$9.99/mo',
    commission: '25%',
    category: 'Cloud Storage',
    image: 'https://via.placeholder.com/300x200?text=CloudSync',
    rating: 4.6,
    clicks: 1820,
    downloads: 98,
    affiliateLink: 'https://example.com/cloudsync?ref=affiliate',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'WebDeveloper Suite',
    description: 'Complete toolkit for modern web development',
    price: '$199.99',
    commission: '35%',
    category: 'Development',
    image: 'https://via.placeholder.com/300x200?text=WebDeveloper',
    rating: 4.9,
    clicks: 3120,
    downloads: 287,
    affiliateLink: 'https://example.com/webdev?ref=affiliate',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'DesignPro Studio',
    description: 'Powerful design tool for graphic designers and creatives',
    price: '$49.99',
    commission: '28%',
    category: 'Design',
    image: 'https://via.placeholder.com/300x200?text=DesignPro',
    rating: 4.7,
    clicks: 2100,
    downloads: 165,
    affiliateLink: 'https://example.com/designpro?ref=affiliate',
    createdAt: new Date().toISOString(),
  },
];

export const useProductStore = create<ProductStore>((set, get) => ({
  products: MOCK_PRODUCTS,

  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        {
          ...product,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          clicks: 0,
          downloads: 0,
          rating: 5.0,
        },
      ],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  getProduct: (id) => {
    const { products } = get();
    return products.find((p) => p.id === id);
  },

  trackClick: (id) => {
    const { products } = get();
    const product = products.find((p) => p.id === id);
    if (product) {
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, clicks: p.clicks + 1 } : p
        ),
      }));
    }
  },

  trackDownload: (id) => {
    const { products } = get();
    const product = products.find((p) => p.id === id);
    if (product) {
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, downloads: p.downloads + 1 } : p
        ),
      }));
    }
  },
}));

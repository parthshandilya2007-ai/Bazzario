import { Product, Category, Order } from '@/types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS } from './mockData';

export interface CouponItem {
  id: string;
  code: string;
  type: 'flat' | 'percent';
  value: number;
  minOrder: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const INITIAL_COUPONS: CouponItem[] = [
  { id: 'c-1', code: 'WELCOME50', type: 'flat', value: 50, minOrder: 299, usageLimit: 10000, usedCount: 3842, isActive: true },
  { id: 'c-2', code: 'FESTIVE100', type: 'flat', value: 100, minOrder: 699, usageLimit: 5000, usedCount: 2190, isActive: true },
  { id: 'c-3', code: 'MEGA20', type: 'percent', value: 20, minOrder: 999, usageLimit: 2000, usedCount: 1980, isActive: false },
];

// Single in-memory state shared across frontend admin and customer pages
let storeProducts: Product[] = [...MOCK_PRODUCTS];
let storeCategories: Category[] = [...MOCK_CATEGORIES];
let storeOrders: Order[] = [...MOCK_ORDERS];
let storeCoupons: CouponItem[] = [...INITIAL_COUPONS];

// --- Products ---
export const getStoreProducts = (): Product[] => {
  return [...storeProducts];
};

export const getStoreProductBySlug = (slug: string): Product | undefined => {
  return storeProducts.find((p) => p.slug === slug);
};

export const getStoreProductById = (id: string): Product | undefined => {
  return storeProducts.find((p) => p._id === id);
};

export const createProductInStore = (input: Partial<Product>): Product => {
  const basePrice = Number(input.basePrice) || 999;
  const discountPercent = Number(input.discountPercent) || 0;
  const finalPrice =
    input.finalPrice !== undefined
      ? Number(input.finalPrice)
      : Math.round(basePrice * (1 - discountPercent / 100));

  const slug =
    input.slug ||
    (input.title ? input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}`);

  const newProduct: Product = {
    _id: input._id || `prod-${Date.now()}`,
    title: input.title || 'New Product',
    slug,
    description: input.description || 'Quality product from verified marketplace supplier.',
    brand: input.brand || 'Verve Direct',
    category: input.category || 'women-ethnic',
    seller: input.seller || {
      _id: 'sel-1',
      storeName: 'Surat Hub Direct',
      ratingAvg: 4.8,
    },
    images: input.images && input.images.length > 0 ? input.images : [
      {
        url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
        isPrimary: true,
      },
    ],
    basePrice,
    discountPercent,
    finalPrice,
    tags: input.tags || ['trending', 'new'],
    ratingAvg: input.ratingAvg || 4.5,
    ratingCount: input.ratingCount || 1,
    totalSold: input.totalSold || 0,
    status: input.status || 'active',
    isCOD: input.isCOD !== undefined ? input.isCOD : true,
    returnWindowDays: input.returnWindowDays || 7,
    stock: input.stock !== undefined ? input.stock : 20,
  };

  storeProducts = [newProduct, ...storeProducts];
  return newProduct;
};

export const updateProductInStore = (id: string, updates: Partial<Product>): Product | null => {
  const index = storeProducts.findIndex((p) => p._id === id);
  if (index === -1) return null;

  const existing = storeProducts[index];
  const basePrice = updates.basePrice !== undefined ? Number(updates.basePrice) : existing.basePrice;
  const discountPercent =
    updates.discountPercent !== undefined ? Number(updates.discountPercent) : existing.discountPercent;
  const finalPrice =
    updates.finalPrice !== undefined
      ? Number(updates.finalPrice)
      : Math.round(basePrice * (1 - discountPercent / 100));

  const updated: Product = {
    ...existing,
    ...updates,
    basePrice,
    discountPercent,
    finalPrice,
  };

  storeProducts = storeProducts.map((p) => (p._id === id ? updated : p));
  return updated;
};

export const deleteProductInStore = (id: string): boolean => {
  const initialLen = storeProducts.length;
  storeProducts = storeProducts.filter((p) => p._id !== id);
  return storeProducts.length < initialLen;
};

// --- Categories ---
export const getStoreCategories = (): Category[] => {
  return [...storeCategories];
};

export const createCategoryInStore = (name: string, slug: string): Category => {
  const newCat: Category = {
    _id: `cat-${Date.now()}`,
    name,
    slug: slug.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    depth: 0,
    displayOrder: storeCategories.length + 1,
    isActive: true,
    image: {
      url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80',
    },
  };
  storeCategories = [...storeCategories, newCat];
  return newCat;
};

export const deleteCategoryInStore = (slugOrId: string): boolean => {
  const initialLen = storeCategories.length;
  storeCategories = storeCategories.filter((c) => c.slug !== slugOrId && c._id !== slugOrId);
  return storeCategories.length < initialLen;
};

// --- Orders ---
export const getStoreOrders = (): Order[] => {
  return [...storeOrders];
};

export const updateOrderStatusInStore = (orderId: string, status: Order['orderStatus']): Order | null => {
  let updatedOrder: Order | null = null;
  storeOrders = storeOrders.map((o) => {
    if (o._id === orderId || o.orderNumber === orderId) {
      updatedOrder = {
        ...o,
        orderStatus: status,
        statusHistory: [
          ...o.statusHistory,
          {
            status,
            note: `Status updated to ${status.toUpperCase()} by Admin`,
            at: new Date().toISOString(),
          },
        ],
      };
      return updatedOrder;
    }
    return o;
  });
  return updatedOrder;
};

// --- Coupons ---
export const getStoreCoupons = (): CouponItem[] => {
  return [...storeCoupons];
};

export const createCouponInStore = (coupon: Omit<CouponItem, 'id' | 'usedCount' | 'isActive'>): CouponItem => {
  const newC: CouponItem = {
    ...coupon,
    id: `c-${Date.now()}`,
    usedCount: 0,
    isActive: true,
  };
  storeCoupons = [newC, ...storeCoupons];
  return newC;
};

export const toggleCouponInStore = (id: string): CouponItem | null => {
  let updated: CouponItem | null = null;
  storeCoupons = storeCoupons.map((c) => {
    if (c.id === id) {
      updated = { ...c, isActive: !c.isActive };
      return updated;
    }
    return c;
  });
  return updated;
};

import { create } from 'zustand';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mockData';

const WISHLIST_STORAGE_KEY = 'bazaario_wishlist';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const loadWishlist = (): Product[] => {
  if (typeof window === 'undefined') return MOCK_PRODUCTS.slice(0, 2);
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return MOCK_PRODUCTS.slice(0, 2);
};

const persistWishlist = (items: Product[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: loadWishlist(),
  addItem: (product) => {
    const { items } = get();
    if (!items.some((p) => p._id === product._id)) {
      const updated = [...items, product];
      persistWishlist(updated);
      set({ items: updated });
    }
  },
  removeItem: (productId) => {
    const { items } = get();
    const updated = items.filter((p) => p._id !== productId);
    persistWishlist(updated);
    set({ items: updated });
  },
  isInWishlist: (productId) => {
    return get().items.some((p) => p._id === productId);
  },
  toggleWishlist: (product) => {
    const { isInWishlist, addItem, removeItem } = get();
    if (isInWishlist(product._id)) {
      removeItem(product._id);
    } else {
      addItem(product);
    }
  },
}));

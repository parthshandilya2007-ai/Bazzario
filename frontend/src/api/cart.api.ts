import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiResponse, Cart, Product, Variant } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { toast } from '@/components/ui/toast';

const INITIAL_MOCK_CART: Cart = {
  _id: 'cart-1',
  items: [
    {
      _id: 'ci-1',
      product: MOCK_PRODUCTS[0],
      qty: 1,
      priceSnapshot: 699,
      addedAt: new Date().toISOString(),
    },
    {
      _id: 'ci-2',
      product: MOCK_PRODUCTS[1],
      qty: 2,
      priceSnapshot: 489,
      addedAt: new Date().toISOString(),
    },
  ],
  couponCode: null,
  subtotal: 1677,
  discount: 2221,
  couponDiscount: 0,
  shippingFee: 0,
  tax: 84,
  grandTotal: 1761,
  freeDeliveryThreshold: 499,
};

const CART_STORAGE_KEY = 'bazaario_local_cart';

const loadCartFromStorage = (): Cart => {
  if (typeof window === 'undefined') return INITIAL_MOCK_CART;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_MOCK_CART;
};

const saveCartToStorage = (cart: Cart) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
};

let localCart: Cart = loadCartFromStorage();

const recalculateCart = (cart: Cart): Cart => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.priceSnapshot || item.product.finalPrice) * item.qty,
    0
  );

  let couponDiscount = 0;
  if (cart.couponCode === 'WELCOME50') {
    couponDiscount = 50;
  } else if (cart.couponCode === 'FESTIVE100') {
    couponDiscount = 100;
  }

  const shippingFee = subtotal >= cart.freeDeliveryThreshold || subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee + tax);

  const updated = {
    ...cart,
    subtotal,
    couponDiscount,
    shippingFee,
    tax,
    grandTotal,
  };
  saveCartToStorage(updated);
  return updated;
};

export const fetchCart = async (): Promise<Cart> => {
  try {
    const { data } = await api.get<ApiResponse<Cart>>('/cart');
    return data.data;
  } catch {
    return localCart;
  }
};

export const addItemToCart = async ({
  product,
  variant,
  qty = 1,
}: {
  product: Product;
  variant?: Variant;
  qty?: number;
}): Promise<Cart> => {
  try {
    const { data } = await api.post<ApiResponse<Cart>>('/cart/items', {
      productId: product._id,
      variantId: variant?._id,
      qty,
    });
    return data.data;
  } catch {
    const existingIndex = localCart.items.findIndex(
      (item) => item.product._id === product._id
    );

    if (existingIndex > -1) {
      localCart.items[existingIndex].qty += qty;
    } else {
      localCart.items.push({
        _id: `ci-${Date.now()}`,
        product,
        variant,
        qty,
        priceSnapshot: product.finalPrice,
        addedAt: new Date().toISOString(),
      });
    }

    localCart = recalculateCart(localCart);
    return { ...localCart };
  }
};

export const updateItemQty = async ({
  itemId,
  qty,
}: {
  itemId: string;
  qty: number;
}): Promise<Cart> => {
  try {
    const { data } = await api.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { qty });
    return data.data;
  } catch {
    if (qty <= 0) {
      localCart.items = localCart.items.filter((item) => item._id !== itemId);
    } else {
      const target = localCart.items.find((item) => item._id === itemId);
      if (target) target.qty = Math.min(10, qty);
    }
    localCart = recalculateCart(localCart);
    return { ...localCart };
  }
};

export const removeItemFromCart = async (itemId: string): Promise<Cart> => {
  try {
    const { data } = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
    return data.data;
  } catch {
    localCart.items = localCart.items.filter((item) => item._id !== itemId);
    localCart = recalculateCart(localCart);
    return { ...localCart };
  }
};

export const applyCartCoupon = async (code: string): Promise<Cart> => {
  try {
    const { data } = await api.post<ApiResponse<Cart>>('/cart/coupon', { code });
    return data.data;
  } catch {
    const uppercase = code.toUpperCase().trim();
    if (uppercase === 'WELCOME50' || uppercase === 'FESTIVE100') {
      localCart.couponCode = uppercase;
      localCart = recalculateCart(localCart);
      return { ...localCart };
    }
    throw new Error('Invalid coupon code. Try WELCOME50 or FESTIVE100');
  }
};

export const removeCartCoupon = async (): Promise<Cart> => {
  try {
    const { data } = await api.delete<ApiResponse<Cart>>('/cart/coupon');
    return data.data;
  } catch {
    localCart.couponCode = null;
    localCart = recalculateCart(localCart);
    return { ...localCart };
  }
};

export const clearEntireCart = async (): Promise<Cart> => {
  try {
    const { data } = await api.delete<ApiResponse<Cart>>('/cart');
    return data.data;
  } catch {
    localCart.items = [];
    localCart.couponCode = null;
    localCart = recalculateCart(localCart);
    return { ...localCart };
  }
};

export const useCart = () => {
  return useQuery<Cart, Error>({
    queryKey: ['cart'],
    queryFn: fetchCart,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addItemToCart,
    onSuccess: (updatedCart, variables) => {
      queryClient.setQueryData(['cart'], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(
        'Added to Bag',
        `${variables.product.title.slice(0, 32)}... has been added.`
      );
    },
    onError: (err: any) => {
      toast.error('Failed to add item', err?.message || 'Please try again.');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItemQty,
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.info('Item Removed', 'Product was removed from your bag.');
    },
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyCartCoupon,
    onSuccess: (updatedCart, code) => {
      queryClient.setQueryData(['cart'], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Coupon Applied!', `Coupon code ${code.toUpperCase()} applied successfully.`);
    },
    onError: (err: any) => {
      toast.error('Invalid Coupon', err?.message || 'Coupon code is invalid or expired.');
    },
  });
};

export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartCoupon,
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.info('Coupon Removed', 'Coupon discount has been removed.');
    },
  });
};

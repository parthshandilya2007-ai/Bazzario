import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Product, Category } from '@/types';
import {
  getStoreProducts,
  createProductInStore,
  updateProductInStore,
  deleteProductInStore,
  getStoreCategories,
  createCategoryInStore,
  deleteCategoryInStore,
  getStoreCoupons,
  createCouponInStore,
  toggleCouponInStore,
  CouponItem,
} from '@/lib/mockStore';
import { toast } from '@/components/ui/toast';
import { emitGlobalSocketMutation } from '@/context/SocketContext';

export interface AdminStats {
  revenueToday: number;
  revenue7Days: number;
  ordersToday: number;
  newUsers: number;
  lowStockCount: number;
  revenueChart: Array<{ date: string; revenue: number; orders: number }>;
  statusDonut: Array<{ name: string; value: number; color: string }>;
  lowStockProducts: Array<{ id: string; title: string; stock: number; sku: string }>;
}

const MOCK_ADMIN_STATS: AdminStats = {
  revenueToday: 184320,
  revenue7Days: 1245000,
  ordersToday: 1429,
  newUsers: 842,
  lowStockCount: 6,
  revenueChart: [
    { date: '14 Sep', revenue: 145000, orders: 1120 },
    { date: '15 Sep', revenue: 162000, orders: 1250 },
    { date: '16 Sep', revenue: 158000, orders: 1190 },
    { date: '17 Sep', revenue: 178000, orders: 1340 },
    { date: '18 Sep', revenue: 192000, orders: 1490 },
    { date: '19 Sep', revenue: 215000, orders: 1680 },
    { date: '20 Sep', revenue: 184320, orders: 1429 },
  ],
  statusDonut: [
    { name: 'Delivered', value: 620, color: '#12855F' },
    { name: 'Shipped', value: 340, color: '#282A66' },
    { name: 'Confirmed', value: 290, color: '#FF6B4A' },
    { name: 'Cancelled', value: 45, color: '#C0392B' },
  ],
  lowStockProducts: [
    { id: 'prod-1', title: 'Embroidered Anarkali Kurta Set', stock: 3, sku: 'LIB-ANK-M-01' },
    { id: 'prod-2', title: 'Cotton Casual Shirt Regular Fit', stock: 2, sku: 'DEN-SHT-BLU-L' },
    { id: 'prod-4', title: 'Breathable Mesh Running Shoes', stock: 4, sku: 'ASI-RUN-9' },
  ],
};

// Comprehensive invalidator ensuring all storefront & admin queries update instantly
export const invalidateAllProductQueries = (queryClient: QueryClient, productId?: string, slug?: string) => {
  queryClient.invalidateQueries({ queryKey: ['products'] }); // prefix matches ['products', params], ['products', 'rail', ...]
  if (productId) {
    queryClient.invalidateQueries({ queryKey: ['product', productId] });
    emitGlobalSocketMutation(`product:${productId}`, 'product:updated', { productId });
  }
  if (slug) {
    queryClient.invalidateQueries({ queryKey: ['product', slug] });
    emitGlobalSocketMutation(`product:${slug}`, 'product:updated', { productId, slug });
  }
  queryClient.invalidateQueries({ queryKey: ['product'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });

  // Real-time catalog broadcast for storefront home rails & listing cards
  emitGlobalSocketMutation('global:catalog', 'catalog:updated', { productId, slug });
};

export const invalidateAllCategoryQueries = (queryClient: QueryClient, slug?: string) => {
  queryClient.invalidateQueries({ queryKey: ['categories'] });
  if (slug) {
    queryClient.invalidateQueries({ queryKey: ['category', slug] });
    emitGlobalSocketMutation(`category:${slug}`, 'category:updated', { categorySlug: slug });
  }
  queryClient.invalidateQueries({ queryKey: ['category'] });
  queryClient.invalidateQueries({ queryKey: ['products'] });

  // Broadcast catalog update
  emitGlobalSocketMutation('global:catalog', 'catalog:updated', { categorySlug: slug });
};

// --- Admin Queries ---
export const useAdminStats = () => {
  return useQuery<AdminStats, Error>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => MOCK_ADMIN_STATS,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useAdminProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['admin', 'products'],
    queryFn: async () => getStoreProducts(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

// --- Admin Product Mutations ---
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Product>) => {
      try {
        const { data } = await api.post('/products', payload);
        return data.data;
      } catch {
        return createProductInStore(payload);
      }
    },
    onSuccess: (newProduct) => {
      invalidateAllProductQueries(queryClient, newProduct._id, newProduct.slug);
      toast.success('Product Created', `"${newProduct.title}" is now active in the catalog.`);
    },
    onError: (err: any) => {
      toast.error('Product Creation Failed', err?.message || 'Could not create product.');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      try {
        const { data } = await api.patch(`/products/${id}`, updates);
        return data.data;
      } catch {
        const updated = updateProductInStore(id, updates);
        if (!updated) throw new Error('Product not found');
        return updated;
      }
    },
    onSuccess: (updatedProduct) => {
      invalidateAllProductQueries(queryClient, updatedProduct._id, updatedProduct.slug);
      toast.success('Product Updated', `Changes for "${updatedProduct.title}" have been published.`);
    },
    onError: (err: any) => {
      toast.error('Update Failed', err?.message || 'Could not update product.');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.delete(`/products/${id}`);
        return id;
      } catch {
        const ok = deleteProductInStore(id);
        if (!ok) throw new Error('Product not found');
        return id;
      }
    },
    onSuccess: (id) => {
      invalidateAllProductQueries(queryClient, id);
      emitGlobalSocketMutation(`product:${id}`, 'product:deleted', { productId: id });
      emitGlobalSocketMutation('global:catalog', 'catalog:updated', { productId: id });
      toast.success('Product Removed', `Product ID ${id.slice(-6)} has been deleted from catalog.`);
    },
    onError: (err: any) => {
      toast.error('Deletion Failed', err?.message || 'Could not delete product.');
    },
  });
};

export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stock }: { id: string; stock: number }) => {
      try {
        const { data } = await api.patch(`/products/${id}/stock`, { stock });
        return data.data;
      } catch {
        const updated = updateProductInStore(id, { stock });
        if (!updated) throw new Error('Product not found');
        return updated;
      }
    },
    onSuccess: (updated) => {
      invalidateAllProductQueries(queryClient, updated._id, updated.slug);
      toast.success(
        updated.stock === 0 ? 'Marked Out of Stock' : 'Stock Updated',
        `Current inventory for "${updated.title}": ${updated.stock} units.`
      );
    },
    onError: (err: any) => {
      toast.error('Stock Update Failed', err?.message || 'Could not update stock.');
    },
  });
};

export const useApproveProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data } = await api.patch(`/products/${id}/status`, { status: 'active' });
        return data.data;
      } catch {
        const updated = updateProductInStore(id, { status: 'active' });
        if (!updated) throw new Error('Product not found');
        return updated;
      }
    },
    onSuccess: (updated) => {
      invalidateAllProductQueries(queryClient, updated._id, updated.slug);
      toast.success('Product Approved', `Product "${updated.title}" is now visible to customers.`);
    },
  });
};

export const useRejectProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      try {
        const { data } = await api.patch(`/products/${id}/status`, { status: 'rejected', reason });
        return data.data;
      } catch {
        const updated = updateProductInStore(id, { status: 'rejected' });
        if (!updated) throw new Error('Product not found');
        return updated;
      }
    },
    onSuccess: (updated) => {
      invalidateAllProductQueries(queryClient, updated._id, updated.slug);
      toast.error('Product Rejected', `Product "${updated.title}" has been removed from storefront.`);
    },
  });
};

// --- Admin Category Mutations ---
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      try {
        const { data } = await api.post('/categories', { name, slug });
        return data.data;
      } catch {
        return createCategoryInStore(name, slug);
      }
    },
    onSuccess: (newCat) => {
      invalidateAllCategoryQueries(queryClient, newCat.slug);
      toast.success('Category Added', `Category "${newCat.name}" is now live.`);
    },
    onError: (err: any) => {
      toast.error('Category Creation Failed', err?.message || 'Could not create category.');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slugOrId: string) => {
      try {
        await api.delete(`/categories/${slugOrId}`);
        return slugOrId;
      } catch {
        const ok = deleteCategoryInStore(slugOrId);
        if (!ok) throw new Error('Category not found');
        return slugOrId;
      }
    },
    onSuccess: (slugOrId) => {
      invalidateAllCategoryQueries(queryClient, slugOrId);
      toast.success('Category Removed', `Category "${slugOrId}" has been deleted.`);
    },
    onError: (err: any) => {
      toast.error('Category Deletion Failed', err?.message || 'Could not delete category.');
    },
  });
};

// --- Admin Coupon Hooks ---
export const useAdminCoupons = () => {
  return useQuery<CouponItem[], Error>({
    queryKey: ['coupons'],
    queryFn: async () => getStoreCoupons(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (couponData: Omit<CouponItem, 'id' | 'usedCount' | 'isActive'>) => {
      try {
        const { data } = await api.post('/coupons', couponData);
        return data.data;
      } catch {
        return createCouponInStore(couponData);
      }
    },
    onSuccess: (newCoupon) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Coupon Created', `Code "${newCoupon.code}" is now active.`);
    },
  });
};

export const useToggleCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data } = await api.patch(`/coupons/${id}/toggle`);
        return data.data;
      } catch {
        const updated = toggleCouponInStore(id);
        if (!updated) throw new Error('Coupon not found');
        return updated;
      }
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(
        updated.isActive ? 'Coupon Enabled' : 'Coupon Disabled',
        `Coupon "${updated.code}" is now ${updated.isActive ? 'ACTIVE' : 'INACTIVE'}.`
      );
    },
  });
};

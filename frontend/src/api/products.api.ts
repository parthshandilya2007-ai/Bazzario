import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiResponse, Product } from '@/types';
import { getStoreProducts, getStoreProductBySlug } from '@/lib/mockStore';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
  page?: number;
  limit?: number;
  tag?: string;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const fetchProducts = async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
  try {
    const { data } = await api.get<ApiResponse<Product[]>>('/products', { params });
    return {
      items: data.data || [],
      total: data.meta?.total || data.data?.length || 0,
      page: data.meta?.page || 1,
      limit: data.meta?.limit || 20,
      totalPages: data.meta?.totalPages || 1,
    };
  } catch {
    // Read from shared reactive store for synchronized offline / mock catalog
    let filtered = getStoreProducts().filter((p) => p.status === 'active' || p.status === undefined);

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(
        (p) =>
          p.category === params.category ||
          (typeof p.category === 'object' && p.category.slug === params.category)
      );
    }

    if (params.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.finalPrice >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.finalPrice <= params.maxPrice!);
    }

    if (params.rating !== undefined) {
      filtered = filtered.filter((p) => p.ratingAvg >= params.rating!);
    }

    if (params.tag) {
      filtered = filtered.filter((p) => p.tags.includes(params.tag!));
    }

    // Sort mock results
    if (params.sort === 'price_asc') {
      filtered.sort((a, b) => a.finalPrice - b.finalPrice);
    } else if (params.sort === 'price_desc') {
      filtered.sort((a, b) => b.finalPrice - a.finalPrice);
    } else if (params.sort === 'rating') {
      filtered.sort((a, b) => b.ratingAvg - a.ratingAvg);
    } else if (params.sort === 'popular') {
      filtered.sort((a, b) => b.totalSold - a.totalSold);
    }

    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit) || 1,
    };
  }
};

export const fetchProductRail = async (tag: string): Promise<Product[]> => {
  try {
    const { data } = await api.get<ApiResponse<Product[]>>(`/products/collections/${tag}`);
    return data.data;
  } catch {
    const activeProducts = getStoreProducts().filter((p) => p.status === 'active' || p.status === undefined);
    if (tag === 'under_499') {
      return activeProducts.filter((p) => p.finalPrice <= 499);
    }
    if (tag === 'top_rated') {
      return activeProducts.filter((p) => p.ratingAvg >= 4.4);
    }
    // Default trending
    return activeProducts;
  }
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${slug}`);
    return data.data;
  } catch {
    const found =
      getStoreProductBySlug(slug) ||
      getStoreProducts().find((p) => p._id === slug);
    if (!found) return getStoreProducts()[0];
    return found;
  }
};

export const useProducts = (params: ProductQueryParams = {}) => {
  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useProductRail = (tag: string) => {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'rail', tag],
    queryFn: () => fetchProductRail(tag),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useProduct = (slug: string) => {
  return useQuery<Product, Error>({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

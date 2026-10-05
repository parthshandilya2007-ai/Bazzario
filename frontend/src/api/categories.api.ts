import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiResponse, Category } from '@/types';
import { getStoreCategories } from '@/lib/mockStore';

export const fetchCategoriesTree = async (): Promise<Category[]> => {
  try {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories/tree');
    return data.data;
  } catch {
    // Fallback to shared mock categories
    return getStoreCategories();
  }
};

export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${slug}`);
    return data.data;
  } catch {
    const found = getStoreCategories().find((c) => c.slug === slug);
    if (!found) throw new Error('Category not found');
    return found;
  }
};

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories', 'tree'],
    queryFn: fetchCategoriesTree,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useCategory = (slug: string) => {
  return useQuery<Category, Error>({
    queryKey: ['category', slug],
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

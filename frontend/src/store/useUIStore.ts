import { create } from 'zustand';

interface UIState {
  isCartDrawerOpen: boolean;
  isFilterSheetOpen: boolean;
  isMobileMenuOpen: boolean;
  searchQuery: string;
  selectedSearchCategory: string;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  setFilterSheetOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSearchCategory: (cat: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartDrawerOpen: false,
  isFilterSheetOpen: false,
  isMobileMenuOpen: false,
  searchQuery: '',
  selectedSearchCategory: 'All',

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  setFilterSheetOpen: (open) => set({ isFilterSheetOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedSearchCategory: (cat) => set({ selectedSearchCategory: cat }),
}));

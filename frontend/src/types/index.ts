export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: { url: string; publicId: string };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  depth: number;
  image?: { url: string; publicId?: string };
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  children?: Category[];
}

export interface ProductImage {
  url: string;
  publicId?: string;
  isPrimary?: boolean;
}

export interface Variant {
  _id: string;
  product: string;
  sku: string;
  size: string;
  colour: string;
  priceOverride?: number;
  stock: number;
  reservedStock: number;
  images?: ProductImage[];
  isActive: boolean;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  brand: string;
  category: Category | string;
  seller: {
    _id: string;
    storeName: string;
    ratingAvg?: number;
  } | string;
  images: ProductImage[];
  basePrice: number; // in paise or rupees (normalized)
  discountPercent: number;
  finalPrice: number;
  attributes?: Record<string, string>;
  tags: string[];
  ratingAvg: number;
  ratingCount: number;
  totalSold: number;
  status: 'draft' | 'pending_review' | 'active' | 'rejected' | 'archived';
  isCOD: boolean;
  returnWindowDays: number;
  isFeatured?: boolean;
  stock?: number;
  variants?: Variant[];
}

export interface CartItem {
  _id: string;
  product: Product;
  variant?: Variant;
  qty: number;
  priceSnapshot: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  couponCode?: string | null;
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  freeDeliveryThreshold: number;
}

export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface OrderItem {
  product: string | Product;
  variant?: string | Variant;
  seller: string;
  titleSnapshot: string;
  imageSnapshot: string;
  priceSnapshot: number;
  sizeSnapshot?: string;
  colourSnapshot?: string;
  qty: number;
  itemStatus: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  pricing: {
    subtotal: number;
    discount: number;
    couponDiscount: number;
    couponCode?: string;
    shippingFee: number;
    tax: number;
    grandTotal: number;
  };
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus:
    | 'placed'
    | 'confirmed'
    | 'packed'
    | 'shipped'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'return_requested'
    | 'returned'
    | 'refunded';
  statusHistory: Array<{
    status: string;
    note?: string;
    at: string;
  }>;
  deliveryEstimate?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
    avatar?: { url: string };
  };
  rating: number;
  title: string;
  comment: string;
  images?: ProductImage[];
  helpfulCount: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  errorCode?: string;
}

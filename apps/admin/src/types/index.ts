// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  role: 'customer' | 'staff' | 'admin';
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export type ProductStatus = 'draft' | 'active' | 'archived';

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  skuSuffix: string;
  color?: string;
  size?: string;
  material?: string;
  priceDelta: number;
  stockQty: number;
  reservedQty: number;
  barcode?: string;
  lowStockThreshold: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  category?: Category;
  brandId?: string;
  brand?: Brand;
  basePrice: number;
  comparePrice?: number;
  costPrice?: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  sku: string;
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brandId?: string;
  basePrice: number;
  comparePrice?: number;
  costPrice?: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  tags: string[];
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer' | 'cash_on_delivery';

export interface OrderItem {
  id: string;
  variantId: string;
  variant?: ProductVariant;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  user?: User;
  guestEmail?: string;
  guestPhone?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  currency: string;
  mpesaReceipt?: string;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingCounty: string;
  shippingZone: string;
  shippingPostalCode?: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  customerNotes?: string;
  adminNotes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  adminNotes?: string;
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  county: string;
  zone: string;
  postalCode?: string;
  isDefault: boolean;
}

// Analytics Types
export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  aovChange: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  imageUrl?: string;
  sales: number;
  revenue: number;
}

export interface CategoryRevenue {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
}

// Shipping Types
export type ShippingZone = 'nairobi' | 'nairobi_metropolitan' | 'coast' | 'central' | 'rift_valley' | 'western' | 'nyanza' | 'eastern' | 'northern' | 'international';

export interface ShippingRate {
  id: string;
  name: string;
  zone: ShippingZone;
  minWeight?: number;
  maxWeight?: number;
  minOrder?: number;
  rate: number;
  freeThreshold?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Settings Types
export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface ProductFilters {
  search?: string;
  status?: ProductStatus | 'all';
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus | 'all';
  paymentStatus?: PaymentStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
}

// API Response Types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// Shared TypeScript interfaces for Maison Élise API

import { UserRole, OrderStatus, PaymentStatus, PaymentMethod, ProductStatus, ReviewStatus, ShippingZone } from '@prisma/client';

// User Types
export interface IUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  loyaltyPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

// Product Types
export interface IProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  basePrice: number;
  comparePrice?: number | null;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  categoryId: string;
  brandId?: string | null;
  images: IProductImage[];
  variants: IProductVariant[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface IProductVariant {
  id: string;
  skuSuffix: string;
  color?: string | null;
  size?: string | null;
  material?: string | null;
  priceDelta: number;
  stockQty: number;
  reservedQty: number;
  images: string[];
  barcode?: string | null;
}

export interface IProductFilter {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  search?: string;
  tags?: string[];
}

// Category Types
export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  productCount?: number;
}

// Cart Types
export interface ICartItem {
  variantId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: { url: string; isPrimary: boolean }[];
  };
  variant: {
    id: string;
    skuSuffix: string;
    color?: string | null;
    size?: string | null;
    priceDelta: number;
    stockQty: number;
  };
  unitPrice: number;
  totalPrice: number;
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  itemCount: number;
}

export interface IAddToCartRequest {
  variantId: string;
  quantity: number;
}

// Order Types
export interface IOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  trackingNumber?: string | null;
  carrier?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSnapshot: {
    name: string;
    sku: string;
    variant: {
      color?: string;
      size?: string;
      material?: string;
    };
    images: string[];
  };
}

export interface IShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  county: string;
  zone: ShippingZone;
  postalCode?: string;
}

export interface ICreateOrderRequest {
  items: { variantId: string; quantity: number }[];
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  customerNotes?: string;
}

// Payment Types
export interface IPaymentInitResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  checkoutUrl?: string;
  merchantRequestId?: string;
  checkoutRequestId?: string;
}

export interface IMpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: {
          Name: string;
          Value: string | number;
        }[];
      };
    };
  };
}

export interface IStripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

// Address Types
export interface IAddress {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  county: string;
  zone: ShippingZone;
  postalCode?: string | null;
  isDefault: boolean;
}

export interface IAddressCreate {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  county: string;
  zone: ShippingZone;
  postalCode?: string;
  isDefault?: boolean;
}

// Wishlist Types
export interface IWishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    images: { url: string; isPrimary: boolean }[];
    category: { name: string };
  };
  createdAt: Date;
}

// Admin Types
export interface IDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  ordersToday: number;
  revenueToday: number;
  lowStockProducts: number;
  pendingOrders: number;
}

export interface ISalesReport {
  period: string;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
}

// API Response Types
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Pagination Types
export interface IPaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Upload Types
export interface IUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

// Email Types
export interface IEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

// Shipping Types
export interface IShippingRate {
  id: string;
  name: string;
  zone: ShippingZone;
  rate: number;
  minWeight?: number | null;
  maxWeight?: number | null;
  minOrder?: number | null;
  freeThreshold?: number | null;
}

// Coupon Types
export interface ICoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number | null;
  maxUses?: number | null;
  currentUses: number;
  startsAt: Date;
  expiresAt?: Date | null;
  isActive: boolean;
}

// Review Types
export interface IReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  status: ReviewStatus;
  helpfulCount: number;
  user: {
    name: string;
    avatarUrl?: string | null;
  };
  createdAt: Date;
}

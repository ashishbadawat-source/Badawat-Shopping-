export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  avatar?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  itemCount: number;
  order: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  price: number;
  discountPrice: number;
  stock: number;
  sku: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  rating: number;
  reviewsCount: number;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  isActive: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface TrackingStep {
  status: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  orderStatus: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  trackingTimeline: TrackingStep[];
  estimatedDeliveryDate: string;
  invoiceNumber: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  title: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system' | 'delivery';
  read: boolean;
  createdAt: string;
  actionLink?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  freeShippingThreshold: number;
  defaultShippingFee: number;
  announcementText: string;
  codEnabled: boolean;
  warehouseLocation: string;
  gstNumber: string;
}

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'user-dashboard'
  | 'admin-dashboard'
  | 'order-tracking'
  | 'invoice'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'refund-policy'
  | 'shipping-policy'
  | 'wishlist';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

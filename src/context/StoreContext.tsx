import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Address,
  Category,
  Product,
  CartItem,
  Order,
  Coupon,
  Review,
  NotificationItem,
  StoreSettings,
  ActivePage,
  ToastMessage,
  TrackingStep,
  Banner,
  PaymentTransaction,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_BANNERS,
  INITIAL_USERS,
  INITIAL_PAYMENTS,
} from '../data/initialData';

interface StoreContextType {
  // Navigation & Page State
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  
  // User & Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, role?: 'admin' | 'customer') => void;
  logout: () => void;
  toggleRole: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (newCategories: Category[]) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  deliveryFee: number;
  grandTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (
    shippingAddress: Address,
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod'
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  cancelOrder: (orderId: string) => void;

  // Saved Addresses
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  deleteReview: (id: string) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'rejected') => void;
  getProductReviews: (productId: string) => Review[];

  // Users Management
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  toggleUserBlock: (userId: string) => void;
  changeUserRole: (userId: string, role: 'admin' | 'customer') => void;
  deleteUser: (userId: string) => void;

  // Payments Management
  payments: PaymentTransaction[];
  refundPayment: (paymentId: string) => void;
  markPaymentPaid: (paymentId: string) => void;

  // Banners Management
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerStatus: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Pincode validation helper
  checkPincodeDelivery: (pincode: string) => { valid: boolean; message: string; cod: boolean; days: number };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Auth (Default to signed in customer Ashish Badawat for immediate rich experience)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bw_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      id: 'user-001',
      name: 'Ashish Badawat',
      email: 'ashishbadawat@gmail.com',
      phone: '+91 98290 12345',
      role: 'customer',
      createdAt: '2026-01-10',
    };
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('bw_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_SETTINGS;
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bw_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('bw_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CATEGORIES;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bw_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('bw_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return ['prod-002'];
  });

  // Applied coupon
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bw_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ORDERS;
  });

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('bw_addresses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ADDRESSES;
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('bw_coupons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_COUPONS;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('bw_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_REVIEWS;
  });

  // Users Management
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bw_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  // Payments Transactions
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('bw_payments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PAYMENTS;
  });

  // Promotional Banners
  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('bw_banners');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BANNERS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Order Dispatched 🚚',
      message: 'Your Badawat order #BW-2026-89102 has been handed over to BlueDart Express Air.',
      type: 'delivery',
      read: false,
      createdAt: 'Today, 09:15 AM',
      actionLink: 'ord-89102',
    },
    {
      id: 'notif-2',
      title: 'Festive Coupon Unlocked! 🎉',
      message: 'Use code BADAWAT10 for 10% instant discount on orders above ₹499.',
      type: 'promo',
      read: false,
      createdAt: 'Yesterday',
    },
  ]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem('bw_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bw_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bw_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('bw_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bw_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('bw_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bw_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('bw_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('bw_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('bw_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('bw_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bw_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('bw_banners', JSON.stringify(banners));
  }, [banners]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth methods
  const login = (email: string, role: 'admin' | 'customer' = 'customer') => {
    const user: User = {
      id: role === 'admin' ? 'admin-001' : 'user-' + Date.now().toString().slice(-4),
      name: role === 'admin' ? 'Badawat Store Administrator' : 'Ashish Badawat',
      email: email || (role === 'admin' ? 'admin@badawatshopping.in' : 'ashishbadawat@gmail.com'),
      phone: '+91 98290 12345',
      role,
      createdAt: '2026-01-10',
    };
    setCurrentUser(user);
    addToast(`Logged in successfully as ${role === 'admin' ? 'Store Admin' : user.name}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Logged out successfully.', 'info');
    setActivePage('home');
  };

  const toggleRole = () => {
    if (!currentUser) return;
    const newRole = currentUser.role === 'admin' ? 'customer' : 'admin';
    const updatedUser: User = {
      ...currentUser,
      role: newRole,
      name: newRole === 'admin' ? 'Badawat Store Administrator' : 'Ashish Badawat',
    };
    setCurrentUser(updatedUser);
    addToast(`Switched view to ${newRole.toUpperCase()} Mode`, 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size || 'nosize'}-${color || 'nocolor'}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
        };
        return [...prev, newItem];
      }
    });

    addToast(`Added "${product.name.slice(0, 26)}..." to cart!`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.discountPrice * item.quantity,
    0
  );

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrderValue) return 0;

    let disc = 0;
    if (appliedCoupon.discountType === 'percentage') {
      disc = (cartSubtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount && disc > appliedCoupon.maxDiscount) {
        disc = appliedCoupon.maxDiscount;
      }
    } else {
      disc = appliedCoupon.value;
    }
    return Math.min(disc, cartSubtotal);
  };

  const cartDiscount = calculateDiscount();

  const deliveryFee =
    cartSubtotal === 0 || cartSubtotal >= settings.freeShippingThreshold
      ? 0
      : settings.defaultShippingFee;

  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum cart value of ₹${found.minOrderValue}.`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon "${found.code}" applied! You saved ₹${Math.round(
        found.discountType === 'percentage'
          ? Math.min((cartSubtotal * found.value) / 100, found.maxDiscount || Infinity)
          : found.value
      )}`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Saved to Wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = (
    shippingAddress: Address,
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod'
  ): Order => {
    const orderNum = `BW-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const invoiceNum = `INV-BW-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderTimeline: TrackingStep[] = [
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: `Payment via ${paymentMethod.toUpperCase()} verified and order registered.`,
        timestamp: 'Just now',
        completed: true,
        current: true,
      },
      {
        status: 'processing',
        title: 'Processing & Quality Check',
        description: 'Allocated to Badawat Fulfillment Center.',
        timestamp: 'Estimated today, 6:00 PM',
        completed: false,
      },
      {
        status: 'shipped',
        title: 'Shipped with Express Courier',
        description: 'Will be dispatched via Air Logistics.',
        timestamp: 'Expected tomorrow',
        completed: false,
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Delivery associate will contact via mobile verification.',
        timestamp: 'Pending dispatch',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Secure contactless doorstep handover.',
        timestamp: 'Pending delivery',
        completed: false,
      },
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser?.id || 'guest',
      customerName: currentUser?.name || shippingAddress.name,
      customerEmail: currentUser?.email || 'customer@badawatshopping.in',
      customerPhone: shippingAddress.phone,
      shippingAddress,
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.discountPrice,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      deliveryCharge: deliveryFee,
      grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'confirmed',
      trackingTimeline: orderTimeline,
      estimatedDeliveryDate: 'In 2-3 business days',
      invoiceNumber: invoiceNum,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Create payment transaction record
    const paymentTxn: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      transactionId: `TXN-${paymentMethod.toUpperCase()}-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      amount: newOrder.grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      gatewayRef: `${paymentMethod.toUpperCase()}/PG/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
    };
    setPayments((prev) => [paymentTxn, ...prev]);

    // Update user's order count & spent
    setUsers((prev) =>
      prev.map((u) =>
        u.id === newOrder.userId
          ? {
              ...u,
              ordersCount: (u.ordersCount || 0) + 1,
              totalSpent: (u.totalSpent || 0) + newOrder.grandTotal,
            }
          : u
      )
    );

    // Send notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Order Placed Successfully! 🛍️',
        message: `Order #${newOrder.orderNumber} for ₹${newOrder.grandTotal} is confirmed. Track your shipment live!`,
        type: 'order',
        read: false,
        createdAt: 'Just now',
        actionLink: newOrder.id,
      },
      ...prev,
    ]);

    // Clear cart
    clearCart();
    setSelectedOrderId(newOrder.id);
    setActivePage('order-success');
    addToast('🎉 Order placed successfully!', 'success');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updatedTimeline = ord.trackingTimeline.map((step) => {
          if (step.status === status) {
            return { ...step, completed: true, current: true, timestamp: 'Updated just now' };
          }
          // Mark earlier ones as completed
          const statusOrder = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
          const currentIndex = statusOrder.indexOf(status);
          const stepIndex = statusOrder.indexOf(step.status);
          return {
            ...step,
            completed: stepIndex <= currentIndex,
            current: stepIndex === currentIndex,
          };
        });

        return {
          ...ord,
          orderStatus: status,
          trackingTimeline: updatedTimeline,
        };
      })
    );
    addToast(`Order ${orderId} status changed to ${status.toUpperCase()}`, 'success');
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              orderStatus: 'cancelled',
              paymentStatus: ord.paymentStatus === 'paid' ? 'refunded' : ord.paymentStatus,
            }
          : ord
      )
    );
    addToast('Order has been cancelled.', 'info');
  };

  // Products CRUD
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast('Product added successfully!', 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product deleted.', 'info');
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Categories CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
    addToast('Category added successfully!', 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast('Category updated!', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('Category removed.', 'info');
  };

  const reorderCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  // Addresses CRUD
  const addAddress = (addrData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addrData,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => {
      if (newAddr.isDefault) {
        return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [...prev, newAddr];
    });
    addToast('New address saved!', 'success');
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updates };
        }
        if (updates.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
    addToast('Address updated!', 'success');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    addToast('Address removed', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    addToast('Default delivery address updated', 'success');
  };

  // Coupons CRUD
  const addCoupon = (cData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...cData,
      id: `coup-${Date.now()}`,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    addToast('New coupon created!', 'success');
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast('Coupon updated!', 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    addToast('Coupon deleted', 'info');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter((r) => r.productId === newRev.productId), newRev];
    const avgRating =
      prodReviews.reduce((acc, curr) => acc + curr.rating, 0) / prodReviews.length;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === newRev.productId
          ? {
              ...p,
              rating: Math.round(avgRating * 10) / 10,
              reviewsCount: p.reviewsCount + 1,
            }
          : p
      )
    );

    addToast('Thank you! Your verified review has been published.', 'success');
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    addToast('Review deleted', 'info');
  };

  const updateReviewStatus = (id: string, status: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    addToast(`Review marked as ${status}`, 'success');
  };

  // Users Management
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ordersCount: 0,
      totalSpent: 0,
      isBlocked: false,
    };
    setUsers((prev) => [newUser, ...prev]);
    addToast('User account created!', 'success');
  };

  const toggleUserBlock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
    addToast('User status updated', 'info');
  };

  const changeUserRole = (userId: string, role: 'admin' | 'customer') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    addToast(`Role changed to ${role.toUpperCase()}`, 'success');
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast('User deleted', 'info');
  };

  // Payments Management
  const refundPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, paymentStatus: 'refunded' } : p))
    );
    const target = payments.find((p) => p.id === paymentId);
    if (target) {
      setOrders((prev) =>
        prev.map((o) => (o.id === target.orderId ? { ...o, paymentStatus: 'refunded' } : o))
      );
    }
    addToast('Payment refunded successfully!', 'success');
  };

  const markPaymentPaid = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, paymentStatus: 'paid' } : p))
    );
    const target = payments.find((p) => p.id === paymentId);
    if (target) {
      setOrders((prev) =>
        prev.map((o) => (o.id === target.orderId ? { ...o, paymentStatus: 'paid' } : o))
      );
    }
    addToast('Payment marked as PAID', 'success');
  };

  // Banners Management
  const addBanner = (bData: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      ...bData,
      id: `ban-${Date.now()}`,
    };
    setBanners((prev) => [...prev, newBanner]);
    addToast('Promotional banner created!', 'success');
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    addToast('Banner updated!', 'success');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    addToast('Banner deleted', 'info');
  };

  const toggleBannerStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    addToast('Store settings saved successfully!', 'success');
  };

  // Pincode validation helper
  const checkPincodeDelivery = (pincode: string) => {
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      return { valid: false, message: 'Please enter a valid 6-digit Indian PIN code', cod: false, days: 0 };
    }
    const metroPins = ['11', '12', '40', '56', '50', '60', '70', '30'];
    const prefix = clean.slice(0, 2);
    if (metroPins.includes(prefix)) {
      return {
        valid: true,
        message: 'Express Delivery Available (Get it within 24-48 hours)',
        cod: true,
        days: 2,
      };
    }
    return {
      valid: true,
      message: 'Standard Pan-India Delivery Available (3-4 business days)',
      cod: true,
      days: 4,
    };
  };

  return (
    <StoreContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,

        currentUser,
        setCurrentUser,
        isLoggedIn: Boolean(currentUser),
        isAdmin: currentUser?.role === 'admin',
        login,
        logout,
        toggleRole,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        deliveryFee,
        grandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,

        wishlist,
        toggleWishlist,
        isInWishlist,

        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,

        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,

        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,

        reviews,
        addReview,
        deleteReview,
        updateReviewStatus,
        getProductReviews,

        users,
        addUser,
        toggleUserBlock,
        changeUserRole,
        deleteUser,

        payments,
        refundPayment,
        markPaymentPaid,

        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerStatus,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,

        settings,
        updateSettings,

        toasts,
        addToast,
        removeToast,

        checkPincodeDelivery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

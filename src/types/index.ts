export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: number | string;
  imageUrl?: string;
  category: string;
  subcategory?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  discount?: number;
  brand?: string;
  attributes?: {
    [key: string]: string | number | boolean;
  };
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: number | string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  paymentMethod: string;
  processingDate?: string;
  inTransitDate?: string;
  deliveredDate?: string;
  note?: string;
  deliveryInstructions?: string;
  rated?: boolean;
  rating?: number;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalSpent: number;
  statusCount: Record<string, number>;
  monthlySpending: Record<string, number>;
}

export interface OrderItem extends CartItem {
  date: string;
  status: string;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  description?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: Address;
  phone?: string;
}

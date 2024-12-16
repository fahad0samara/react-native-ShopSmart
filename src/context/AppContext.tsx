import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem, Category, Order, OrderItem } from '../types';
import { PRODUCTS, CATEGORIES, FLASH_DEALS, NEW_ARRIVALS, POPULAR_PRODUCTS } from '../data/mockData';

interface AppContextType {
  products: Product[];
  cartItems: CartItem[];
  categories: Category[];
  flashDeals: Product[];
  newArrivals: Product[];
  popularProducts: Product[];
  orders: Order[];
  isLoading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  searchProducts: (query: string) => void;
  getProductsByCategory: (category: string) => Product[];
  placeOrder: () => void;
  deleteOrder: (orderId: string) => void;
  reorderItems: (orderId: string) => boolean;
  addOrderNote: (orderId: string, note: string) => void;
  addDeliveryInstructions: (orderId: string, instructions: string) => void;
  submitOrderRating: (orderId: string, rating: number) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
  paymentMethod: string;
  processingDate?: string;
  inTransitDate?: string;
  deliveredDate?: string;
  note?: string;
  deliveryInstructions?: string;
  rated?: boolean;
  rating?: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@grocery_cart';
const ORDERS_STORAGE_KEY = '@grocery_orders';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [flashDeals] = useState<Product[]>(FLASH_DEALS);
  const [newArrivals] = useState<Product[]>(NEW_ARRIVALS);
  const [popularProducts] = useState<Product[]>(POPULAR_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
    loadOrders();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    saveCartItems();
  }, [cartItems]);

  useEffect(() => {
    saveOrders();
  }, [orders]);

  const loadCartItems = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCartItems = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const savedOrders = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const saveOrders = async () => {
    try {
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const searchProducts = (query: string) => {
    if (!query.trim()) {
      setProducts(PRODUCTS);
      return;
    }

    const filtered = PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filtered);
  };

  const getProductsByCategory = (category: string): Product[] => {
    return PRODUCTS.filter(product => 
      product.category.toLowerCase() === category.toLowerCase() ||
      product.subcategory.toLowerCase() === category.toLowerCase()
    );
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return;

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'Processing',
      items: [...cartItems],
      total,
      paymentMethod: 'Cash',
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart(); // Clear the cart after placing the order
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const reorderItems = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.items.forEach(item => {
        addToCart(item);
      });
      return true;
    }
    return false;
  };

  const addOrderNote = (orderId: string, note: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, note } 
          : order
      )
    );
  };

  const addDeliveryInstructions = (orderId: string, instructions: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, deliveryInstructions: instructions } 
          : order
      )
    );
  };

  const submitOrderRating = (orderId: string, rating: number) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, rated: true, rating } 
          : order
      )
    );
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    const now = new Date().toISOString();
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updates: Partial<Order> = { status };
          switch (status) {
            case 'processing':
              updates.processingDate = now;
              break;
            case 'in_transit':
              updates.inTransitDate = now;
              break;
            case 'delivered':
              updates.deliveredDate = now;
              break;
          }
          return { ...order, ...updates };
        }
        return order;
      })
    );
  };

  const value = {
    products,
    cartItems,
    categories,
    flashDeals,
    newArrivals,
    popularProducts,
    orders,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    searchProducts,
    getProductsByCategory,
    placeOrder,
    deleteOrder,
    reorderItems,
    addOrderNote,
    addDeliveryInstructions,
    submitOrderRating,
    updateOrderStatus,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

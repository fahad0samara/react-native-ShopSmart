import { Product, Category } from '../types';
import { PLACEHOLDER_IMAGE } from '../utils/constants';

// This would be your actual API key from Spoonacular
const API_KEY = '';

// For demo purposes, using mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mushroom Sauce',
    price: 8.92,
    image: 'https://spoonacular.com/productImages/458441-312x231.jpg',
    category: 'Sauce',
    description: 'Delicious mushroom sauce'
  },
  {
    id: '2',
    name: 'Organic Pasta',
    price: 4.99,
    image: 'https://spoonacular.com/productImages/111081-312x231.jpg',
    category: 'Pasta',
    description: 'Premium organic pasta'
  },
  {
    id: '3',
    name: 'Fresh Avocados',
    price: 6.99,
    image: 'https://spoonacular.com/productImages/215435-312x231.jpg',
    category: 'Vegetables',
    description: 'Ripe and ready to eat'
  },
  {
    id: '4',
    name: 'Organic Eggs',
    price: 5.99,
    image: 'https://spoonacular.com/productImages/42291-312x231.jpg',
    category: 'Dairy',
    description: 'Farm fresh organic eggs'
  }
];

export const fetchProducts = async (): Promise<Product[]> => {
  // If you have an API key, you can use the real API
  if (API_KEY) {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/food/products/search?apiKey=${API_KEY}&number=10&query=grocery`
      );
      const data = await response.json();
      
      return data.products.map((product: any) => ({
        id: product.id.toString(),
        name: product.title,
        price: (product.price || Math.random() * 30 + 5).toFixed(2),
        image: product.image,
        category: product.aisle || 'General',
        description: product.description
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return mockProducts;
    }
  }
  
  // Return mock data if no API key
  return mockProducts;
};

export const getCategories = async (): Promise<Category[]> => {
  return [
    { id: '1', name: 'Snacks', icon: '🍿' },
    { id: '2', name: 'Breakfast', icon: '🍳' },
    { id: '3', name: 'Canned', icon: '🥫' },
    { id: '4', name: 'Sauce', icon: '🥫' },
    { id: '5', name: 'Drinks', icon: '🥤' },
    { id: '6', name: 'Fish', icon: '🐟' },
    { id: '7', name: 'Meat', icon: '🥩' },
    { id: '8', name: 'Vegetables', icon: '🥬' },
  ];
};

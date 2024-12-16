export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: string;
  unit?: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const PRODUCTS: Product[] = [
  // Fresh Produce
  {
    id: 'prod_001',
    name: 'Organic Baby Spinach',
    price: 3.99,
    description: 'Fresh organic baby spinach leaves, pre-washed and ready to eat',
    image: 'https://images.pexels.com/photos/5528986/pexels-photo-5528986.jpeg',
    category: 'Fresh Produce',
    subcategory: 'Organic Vegetables',
    brand: 'Simple Truth Organic',
    rating: 4.8,
    reviews: 245,
    inStock: true,
    unit: '5 oz',
    nutrition: {
      calories: 7,
      protein: 0.9,
      carbs: 1.1,
      fat: 0.1
    }
  },
  {
    id: 'prod_002',
    name: 'Hass Avocados',
    price: 1.99,
    description: 'Perfectly ripe Hass avocados, rich and creamy',
    image: 'https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg',
    category: 'Fresh Produce',
    subcategory: 'Fresh Fruits',
    brand: 'Nature\'s Best',
    rating: 4.5,
    reviews: 189,
    inStock: true,
    unit: 'each'
  },
  {
    id: 'prod_003',
    name: 'Organic Bananas',
    price: 2.49,
    description: 'Sweet and fresh organic bananas',
    image: 'https://images.pexels.com/photos/2316466/pexels-photo-2316466.jpeg',
    category: 'Fresh Produce',
    subcategory: 'Fresh Fruits',
    brand: 'Organic Valley',
    rating: 4.7,
    reviews: 312,
    inStock: true,
    unit: 'bunch'
  },
  {
    id: 'prod_004',
    name: 'Red Bell Peppers',
    price: 1.29,
    description: 'Fresh, crisp red bell peppers',
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
    category: 'Fresh Produce',
    subcategory: 'Fresh Vegetables',
    brand: 'Farm Fresh',
    rating: 4.6,
    reviews: 156,
    inStock: true,
    unit: 'each'
  },
  {
    id: 'prod_005',
    name: 'Organic Carrots',
    price: 2.99,
    description: 'Sweet and crunchy organic carrots',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
    category: 'Fresh Produce',
    subcategory: 'Organic Vegetables',
    brand: 'Simple Truth Organic',
    rating: 4.4,
    reviews: 178,
    inStock: true,
    unit: '2 lb bag'
  },
  // Dairy & Eggs
  {
    id: 'prod_006',
    name: 'Organic Whole Milk',
    price: 4.99,
    description: 'Fresh organic whole milk from grass-fed cows',
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg',
    category: 'Dairy & Eggs',
    subcategory: 'Milk',
    brand: 'Organic Valley',
    rating: 4.9,
    reviews: 423,
    inStock: true,
    unit: '1 gallon'
  },
  {
    id: 'prod_007',
    name: 'Large Brown Eggs',
    price: 3.99,
    description: 'Farm-fresh large brown eggs',
    image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg',
    category: 'Dairy & Eggs',
    subcategory: 'Eggs',
    brand: 'Farm Fresh',
    rating: 4.7,
    reviews: 289,
    inStock: true,
    unit: 'dozen'
  },
  // Meat & Poultry
  {
    id: 'prod_008',
    name: 'Chicken Breast',
    price: 6.99,
    description: 'Fresh, boneless, skinless chicken breast',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    category: 'Meat & Poultry',
    subcategory: 'Chicken',
    brand: 'Premium Farms',
    rating: 4.6,
    reviews: 345,
    inStock: true,
    unit: 'per lb'
  },
  {
    id: 'prod_009',
    name: 'Ground Beef',
    price: 5.99,
    description: '85% lean ground beef',
    image: 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg',
    category: 'Meat & Poultry',
    subcategory: 'Beef',
    brand: 'Premium Farms',
    rating: 4.5,
    reviews: 267,
    inStock: true,
    unit: 'per lb'
  },
  // Bakery
  {
    id: 'prod_010',
    name: 'Whole Wheat Bread',
    price: 3.49,
    description: 'Fresh-baked whole wheat bread',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg',
    category: 'Bakery',
    subcategory: 'Bread',
    brand: 'Artisan Bakery',
    rating: 4.7,
    reviews: 198,
    inStock: true,
    unit: 'loaf'
  },
  // Beverages
  {
    id: 'prod_011',
    name: 'Orange Juice',
    price: 4.99,
    description: 'Fresh-squeezed orange juice, no pulp',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
    category: 'Beverages',
    subcategory: 'Juices',
    brand: 'Fresh Squeeze',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    unit: '64 oz'
  },
  // Snacks
  {
    id: 'prod_012',
    name: 'Mixed Nuts',
    price: 7.99,
    description: 'Premium mixed nuts, lightly salted',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
    category: 'Snacks',
    subcategory: 'Nuts & Seeds',
    brand: 'Nature\'s Best',
    rating: 4.6,
    reviews: 178,
    inStock: true,
    unit: '16 oz'
  }
];

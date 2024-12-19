export interface NutritionalInfo {
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ProductBadge {
  type: string;
  label: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  discount?: number;
  isOrganic?: boolean;
  isLocal?: boolean;
  isSeasonal?: boolean;
  brand?: string;
  unit?: string;
  isOnSale?: boolean;
  nutritionalInfo?: NutritionalInfo;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CategoryData {
  subcategories: string[];
  items: Product[];
}

export interface CategorizedProducts {
  [category: string]: CategoryData;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ProductsState {
  products: Product[];
  categorizedProducts: CategorizedProducts;
  categories: string[];
  loading: boolean;
  error: string | null;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  searchQuery?: string;
  brands?: string[];
  priceRange?: [number, number];
  sortBy?: 'price' | 'rating' | 'name';
  isOrganic?: boolean;
  isLocal?: boolean;
  isSeasonal?: boolean;
}

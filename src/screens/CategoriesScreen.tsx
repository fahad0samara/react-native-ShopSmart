import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  Image,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  Searchbar,
  IconButton,
  Button,
  useTheme,
  Badge,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 140 : 120;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const getGridDimensions = () => {
  const isPortrait = height > width;
  const numColumns = isPortrait ? 2 : 3;
  const spacing = SPACING.sm;
  const totalSpacing = spacing * (numColumns + 1);
  const cardWidth = (width - totalSpacing) / numColumns;
  const cardHeight = cardWidth * 0.8;
  
  return { numColumns, cardWidth, cardHeight };
};

const CATEGORIES = [
  {
    id: '1',
    name: 'Fresh Produce',
    icon: 'fruit-watermelon',
    image: 'https://www.kroger.com/product/images/large/front/0000000004011',
    subcategories: [
      'Organic Vegetables',
      'Fresh Fruits',
      'Salad Mixes',
      'Herbs',
      'Mushrooms',
      'Pre-Cut Vegetables',
      'Seasonal Produce'
    ],
    trending: true,
    special: 'Up to 30% Off'
  },
  {
    id: '2',
    name: 'Meat & Poultry',
    icon: 'food-steak',
    image: 'https://www.walmart.com/ip/Tyson-Fresh-Chicken-Breast-Fillets/27935816',
    subcategories: [
      'Fresh Chicken',
      'Beef & Steak',
      'Pork',
      'Ground Meats',
      'Lamb',
      'Turkey',
      'Marinated Meats'
    ],
    special: 'Buy 1 Get 1 50% Off'
  },
  {
    id: '3',
    name: 'Dairy & Eggs',
    icon: 'cheese',
    image: 'https://www.target.com/p/organic-whole-milk-half-gallon-good-38-gather-8482/-/A-13276123',
    subcategories: [
      'Milk & Cream',
      'Cheese',
      'Yogurt',
      'Butter & Margarine',
      'Eggs',
      'Plant-Based Alternatives',
      'Sour Cream & Dips'
    ],
    trending: true
  },
  {
    id: '4',
    name: 'Bakery',
    icon: 'bread-slice',
    image: 'https://www.safeway.com/shop/product-details.960275455.html',
    subcategories: [
      'Fresh Bread',
      'Pastries',
      'Cakes & Desserts',
      'Rolls & Buns',
      'Tortillas & Wraps',
      'Gluten-Free Options',
      'Bagels & Muffins'
    ],
    special: 'Fresh Daily Deals'
  },
  {
    id: '5',
    name: 'Pantry Essentials',
    icon: 'cupboard',
    image: 'https://www.costco.com/kirkland-signature-organic-quinoa%2c-4.5-lbs.product.100417968.html',
    subcategories: [
      'Rice & Grains',
      'Pasta & Noodles',
      'Canned Goods',
      'Cooking Oils',
      'Condiments',
      'Spices & Seasonings',
      'Baking Essentials'
    ],
    trending: true
  },
  {
    id: '6',
    name: 'Beverages',
    icon: 'cup',
    image: 'https://www.samsclub.com/p/coca-cola-35-pk-cans/prod21292410',
    subcategories: [
      'Soft Drinks',
      'Water & Sparkling',
      'Coffee & Tea',
      'Juices',
      'Energy Drinks',
      'Sports Drinks',
      'Plant-Based Drinks'
    ],
    special: '2 for $5'
  },
  {
    id: '7',
    name: 'Snacks & Candy',
    icon: 'cookie',
    image: 'https://www.target.com/p/lay-s-classic-potato-chips-8oz/-/A-12959779',
    subcategories: [
      'Chips & Crisps',
      'Cookies',
      'Nuts & Trail Mixes',
      'Chocolate',
      'Candy',
      'Popcorn',
      'Healthy Snacks'
    ],
    trending: true
  },
  {
    id: '8',
    name: 'Frozen Foods',
    icon: 'snowflake',
    image: 'https://www.kroger.com/p/ben-jerry-s-chocolate-chip-cookie-dough-ice-cream/0007684010128',
    subcategories: [
      'Ice Cream',
      'Frozen Meals',
      'Pizza',
      'Vegetables',
      'Breakfast Items',
      'Meat & Seafood',
      'Desserts'
    ],
    special: '3 for $10'
  },
  {
    id: '9',
    name: 'International Foods',
    icon: 'earth',
    image: 'https://www.heb.com/product-detail/sun-bird-fried-rice-seasoning-mix/31394',
    subcategories: [
      'Asian',
      'Mexican',
      'Italian',
      'Indian',
      'Middle Eastern',
      'Mediterranean',
      'European'
    ],
    trending: true
  },
  {
    id: '10',
    name: 'Organic & Natural',
    icon: 'leaf',
    image: 'https://www.wholefoodsmarket.com/products/365-everyday-value-organic-baby-spinach',
    subcategories: [
      'Fresh Produce',
      'Pantry Items',
      'Snacks',
      'Beverages',
      'Frozen Foods',
      'Personal Care',
      'Supplements'
    ],
    special: 'Member Savings'
  },
  {
    id: '11',
    name: 'Deli & Prepared',
    icon: 'food-takeout-box',
    image: 'https://www.publix.com/pd/boar-s-head-ovengold-turkey-breast/RIO-PCI-114607',
    subcategories: [
      'Sliced Meats',
      'Cheese by the Pound',
      'Prepared Meals',
      'Salads',
      'Party Platters',
      'Sandwiches',
      'Hot Foods'
    ],
    trending: true
  },
  {
    id: '12',
    name: 'Household',
    icon: 'home',
    image: 'https://www.target.com/p/tide-original-liquid-laundry-detergent/-/A-13044691',
    subcategories: [
      'Cleaning Supplies',
      'Paper Products',
      'Laundry Care',
      'Air Fresheners',
      'Storage & Organization',
      'Disposable Tableware',
      'Pet Supplies'
    ],
    special: 'Save $5 on $20'
  }
];

const PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Produce',
    category: 'Fresh Produce',
    subcategory: 'Fresh Fruits',
    image: 'https://www.kroger.com/product/images/large/front/0000000004011',
    price: 2.99,
    originalPrice: 3.99,
  },
  {
    id: '2',
    name: 'Meat & Poultry',
    category: 'Meat & Poultry',
    subcategory: 'Fresh Chicken',
    image: 'https://www.walmart.com/ip/Tyson-Fresh-Chicken-Breast-Fillets/27935816',
    price: 4.99,
    originalPrice: 5.99,
  },
  {
    id: '3',
    name: 'Dairy & Eggs',
    category: 'Dairy & Eggs',
    subcategory: 'Milk & Cream',
    image: 'https://www.target.com/p/organic-whole-milk-half-gallon-good-38-gather-8482/-/A-13276123',
    price: 2.49,
    originalPrice: 2.99,
  },
  {
    id: '4',
    name: 'Bakery',
    category: 'Bakery',
    subcategory: 'Fresh Bread',
    image: 'https://www.safeway.com/shop/product-details.960275455.html',
    price: 1.99,
    originalPrice: 2.49,
  },
  {
    id: '5',
    name: 'Pantry Essentials',
    category: 'Pantry Essentials',
    subcategory: 'Rice & Grains',
    image: 'https://www.costco.com/kirkland-signature-organic-quinoa%2c-4.5-lbs.product.100417968.html',
    price: 3.99,
    originalPrice: 4.99,
  },
  {
    id: '6',
    name: 'Beverages',
    category: 'Beverages',
    subcategory: 'Soft Drinks',
    image: 'https://www.samsclub.com/p/coca-cola-35-pk-cans/prod21292410',
    price: 4.99,
    originalPrice: 5.99,
  },
  {
    id: '7',
    name: 'Snacks & Candy',
    category: 'Snacks & Candy',
    subcategory: 'Chips & Crisps',
    image: 'https://www.target.com/p/lay-s-classic-potato-chips-8oz/-/A-12959779',
    price: 2.99,
    originalPrice: 3.49,
  },
  {
    id: '8',
    name: 'Frozen Foods',
    category: 'Frozen Foods',
    subcategory: 'Ice Cream',
    image: 'https://www.kroger.com/p/ben-jerry-s-chocolate-chip-cookie-dough-ice-cream/0007684010128',
    price: 3.99,
    originalPrice: 4.99,
  },
  {
    id: '9',
    name: 'International Foods',
    category: 'International Foods',
    subcategory: 'Asian',
    image: 'https://www.heb.com/product-detail/sun-bird-fried-rice-seasoning-mix/31394',
    price: 2.49,
    originalPrice: 2.99,
  },
  {
    id: '10',
    name: 'Organic & Natural',
    category: 'Organic & Natural',
    subcategory: 'Fresh Produce',
    image: 'https://www.wholefoodsmarket.com/products/365-everyday-value-organic-baby-spinach',
    price: 2.99,
    originalPrice: 3.49,
  },
  {
    id: '11',
    name: 'Deli & Prepared',
    category: 'Deli & Prepared',
    subcategory: 'Sliced Meats',
    image: 'https://www.publix.com/pd/boar-s-head-ovengold-turkey-breast/RIO-PCI-114607',
    price: 4.99,
    originalPrice: 5.99,
  },
  {
    id: '12',
    name: 'Household',
    category: 'Household',
    subcategory: 'Cleaning Supplies',
    image: 'https://www.target.com/p/tide-original-liquid-laundry-detergent/-/A-13044691',
    price: 3.99,
    originalPrice: 4.99,
  },
];

const CategoriesScreen = ({ navigation }) => {
  const theme = useTheme();
  const [dimensions, setDimensions] = useState(getGridDimensions());
  const insets = useSafeAreaInsets();
  const { cartItems } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDimensions(getGridDimensions());
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT + insets.top, HEADER_MIN_HEIGHT + insets.top],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const filteredCategories = CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleFavorite = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleExpanded = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const navigateToProducts = (category: string, subcategory?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Products', { category, subcategory });
  };

  const renderHeader = () => {
    return (
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primary + 'DD']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Categories</Text>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <MaterialCommunityIcons name="cart-outline" size={24} color="#fff" />
              {cartItems.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchBar}
              inputStyle={styles.searchInput}
              iconColor={COLORS.textLight}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
    );
  };

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => navigateToProducts(category.name)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[
          category.color || COLORS.primary,
          category.color ? category.color + '99' : COLORS.primary + '99'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={category.icon}
              size={40}
              color="#fff"
              style={styles.cardIcon}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.categoryName}>
              {category.name}
            </Text>
            {category.subcategories && (
              <Text style={styles.itemCount}>
                {category.subcategories.length} items
              </Text>
            )}
          </View>
        </View>
        <View style={styles.cardRight}>
          {category.trending && (
            <View style={styles.trendingBadge}>
              <MaterialCommunityIcons 
                name="fire" 
                size={12}
                color="#fff" 
              />
              <Text style={styles.trendingText}>
                Trending
              </Text>
            </View>
          )}
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#fff"
            style={styles.chevron}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedSection = () => (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <TouchableOpacity onPress={() => {/* View all */}}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredScroll}
      >
        {PRODUCTS.slice(0, 5).map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.featuredCard}
            onPress={() => navigateToProducts(product.category, product)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: product.image }} style={styles.featuredImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featuredGradient}
            />
            <View style={styles.featuredContent}>
              <Text style={styles.featuredName} numberOfLines={2}>
                {product.name}
              </Text>
              <View style={styles.featuredMeta}>
                <Text style={styles.featuredPrice}>${product.price.toFixed(2)}</Text>
                {product.originalPrice && (
                  <Text style={styles.featuredOriginalPrice}>
                    ${product.originalPrice.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderFeaturedSection()}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Categories</Text>
        </View>
        
        {filteredCategories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="magnify-close"
              size={48}
              color={COLORS.textLight}
            />
            <Text style={styles.emptyText}>No categories found</Text>
            <Button
              mode="contained"
              onPress={() => setSearchQuery('')}
              style={styles.resetButton}
            >
              Clear Search
            </Button>
          </View>
        ) : (
          <View style={styles.categoriesList}>
            {filteredCategories.map(renderCategory)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? 90 : 70,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 45,
  },
  searchInput: {
    fontSize: 16,
    color: COLORS.text,
  },
  featuredSection: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewAll: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  featuredScroll: {
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
  },
  featuredCard: {
    width: 200,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.sm,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuredOriginalPrice: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textDecorationLine: 'line-through',
  },
  categoriesList: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  categoryCard: {
    height: 80,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm,
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  cardIcon: {
    opacity: 0.95,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  itemCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,48,0.95)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  trendingText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  chevron: {
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  resetButton: {
    minWidth: 120,
  },
});

export default CategoriesScreen;

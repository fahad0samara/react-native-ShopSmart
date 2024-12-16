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
import { COLORS, SPACING } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 140 : 120;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

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

const CategoriesScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { cartItems } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

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

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          paddingTop: insets.top,
        },
      ]}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <Animated.View
            style={[
              styles.headerTitleContainer,
              { opacity: headerTitleOpacity },
            ]}
          >
            <Text style={styles.headerTitle}>Categories</Text>
          </Animated.View>
          <View style={styles.headerActions}>
            <IconButton
              icon="magnify"
              iconColor="#fff"
              size={24}
              onPress={() => {/* Add search action */}}
            />
            <View>
              <IconButton
                icon="cart-outline"
                iconColor="#fff"
                size={24}
                onPress={() => {/* Add cart action */}}
              />
              {cartItems.length > 0 && (
                <Badge
                  size={20}
                  style={styles.cartBadge}
                >
                  {cartItems.length}
                </Badge>
              )}
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search categories or products"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={COLORS.primary}
            placeholderTextColor={COLORS.textLight}
          />
        </View>
      </View>
    </Animated.View>
  );

  const renderCategory = (category) => (
    <View key={category.id} style={styles.categoryCard}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => toggleExpanded(category.id)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: category.image }}
          style={StyleSheet.absoluteFill}
          blurRadius={3}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.categoryContent}>
          <View style={styles.categoryLeft}>
            <MaterialCommunityIcons
              name={category.icon}
              size={24}
              color="#fff"
            />
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
          <View style={styles.categoryRight}>
            {category.trending && (
              <Chip
                mode="outlined"
                textStyle={styles.chipText}
                style={styles.trendingChip}
              >
                Trending
              </Chip>
            )}
            {category.special && (
              <Chip
                mode="outlined"
                textStyle={styles.chipText}
                style={styles.specialChip}
              >
                {category.special}
              </Chip>
            )}
            <TouchableOpacity
              onPress={() => toggleFavorite(category.id)}
              style={styles.favoriteButton}
            >
              <MaterialCommunityIcons
                name={favorites.includes(category.id) ? 'heart' : 'heart-outline'}
                size={24}
                color={favorites.includes(category.id) ? '#ff4081' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {expandedCategory === category.id && (
        <View style={styles.subcategoriesContainer}>
          {category.subcategories.map((subcategory) => (
            <TouchableOpacity
              key={subcategory}
              style={styles.subcategoryItem}
              onPress={() => navigateToProducts(category.name, subcategory)}
            >
              <Text style={styles.subcategoryText}>{subcategory}</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          ))}
          <Button
            mode="contained"
            onPress={() => navigateToProducts(category.name)}
            style={styles.viewAllButton}
          >
            View All {category.name}
          </Button>
        </View>
      )}
    </View>
  );

  const renderFeaturedDeals = () => {
    const dealsProducts = PRODUCTS.filter(p => p.originalPrice && p.originalPrice > p.price)
      .sort((a, b) => ((b.originalPrice! - b.price) / b.originalPrice!) - 
        ((a.originalPrice! - a.price) / a.originalPrice!))
      .slice(0, 5);

    return (
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Deals</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsContainer}
        >
          {dealsProducts.map((product) => {
            const savings = ((product.originalPrice! - product.price) / product.originalPrice! * 100).toFixed(0);
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.dealCard}
                onPress={() => navigation.navigate('Products', { 
                  category: product.category,
                  subcategory: product.subcategory,
                  highlightProduct: product.id
                })}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.dealImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.dealContent}>
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>Save {savings}%</Text>
                  </View>
                  <Text style={styles.dealName} numberOfLines={2}>{product.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.dealPrice}>${product.price.toFixed(2)}</Text>
                    <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: HEADER_MAX_HEIGHT + insets.top }]}>
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
        {renderFeaturedDeals()}
        
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
          filteredCategories.map(renderCategory)
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1000,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
    height: 44,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.accent,
  },
  searchContainer: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    height: 40,
  },
  searchInput: {
    fontSize: 14,
  },
  scrollContent: {
    padding: SPACING.sm,
  },
  categoryCard: {
    marginBottom: SPACING.md,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryHeader: {
    height: 100,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  trendingChip: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
  },
  specialChip: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
  },
  favoriteButton: {
    padding: 4,
  },
  subcategoriesContainer: {
    padding: SPACING.sm,
    backgroundColor: '#fff',
  },
  subcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subcategoryText: {
    fontSize: 16,
    color: COLORS.text,
  },
  viewAllButton: {
    marginTop: SPACING.sm,
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
  featuredSection: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    color: COLORS.text,
  },
  dealsContainer: {
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
  },
  dealCard: {
    width: width * 0.6,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dealContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.sm,
  },
  savingsBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  savingsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dealName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dealPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalPrice: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
});

export default CategoriesScreen;

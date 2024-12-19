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
import { theme } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const CATEGORIES = [
  {
    id: '1',
    name: 'Fresh Produce',
    icon: 'fruit-watermelon',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=500',
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
    special: 'Up to 30% Off',
    description: 'Fresh produce, delivered daily'
  },
  {
    id: '2',
    name: 'Meat & Poultry',
    icon: 'food-steak',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=500',
    subcategories: [
      'Fresh Chicken',
      'Beef & Steak',
      'Pork',
      'Ground Meats',
      'Lamb',
      'Turkey',
      'Marinated Meats'
    ],
    special: 'Buy 1 Get 1 50% Off',
    description: 'Fresh meat and poultry, cut to order'
  },
  {
    id: '3',
    name: 'Dairy & Eggs',
    icon: 'cheese',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=500',
    subcategories: [
      'Milk & Cream',
      'Cheese',
      'Yogurt',
      'Butter & Margarine',
      'Eggs',
      'Plant-Based Alternatives',
      'Sour Cream & Dips'
    ],
    trending: true,
    description: 'Fresh dairy products, delivered daily'
  },
  {
    id: '4',
    name: 'Bakery',
    icon: 'bread-slice',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500',
    subcategories: [
      'Fresh Bread',
      'Pastries',
      'Cakes & Desserts',
      'Rolls & Buns',
      'Tortillas & Wraps',
      'Gluten-Free Options',
      'Bagels & Muffins'
    ],
    description: 'Fresh baked goods daily'
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
    trending: true,
    description: 'Pantry staples, at discounted prices'
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
    special: '2 for $5',
    description: 'Beverages, for every occasion'
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
    trending: true,
    description: 'Snacks and treats, for every craving'
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
    special: '3 for $10',
    description: 'Frozen foods, for every meal'
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
    trending: true,
    description: 'International flavors, at your doorstep'
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
    special: 'Member Savings',
    description: 'Organic and natural products, for a healthier you'
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
    trending: true,
    description: 'Deli and prepared foods, made fresh daily'
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
    special: 'Save $5 on $20',
    description: 'Household essentials, at discounted prices'
  }
];

const CategoriesScreen = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems } = useApp();

  const filteredCategories = CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Products', { 
      category: category.name,
      color: category.color,
      icon: category.icon,
      subcategories: category.subcategories
    });
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Categories</Text>
            <View style={styles.headerActions}>
              <IconButton
                icon="heart-outline"
                iconColor="#fff"
                size={24}
                style={styles.actionButton}
                onPress={() => navigation.navigate('Favorites')}
              />
              <IconButton
                icon="cart-outline"
                iconColor="#fff"
                size={24}
                style={styles.actionButton}
                onPress={() => navigation.navigate('Cart')}
              >
                {cartItems?.length > 0 && (
                  <Badge
                    size={16}
                    style={styles.cartBadge}
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </IconButton>
            </View>
          </View>
          <Searchbar
            placeholder="Search categories..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, { backgroundColor: 'rgba(255,255,255,0.9)' }]}
            inputStyle={styles.searchInput}
            iconColor={theme.colors.primary}
            elevation={0}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const CategoryCard = ({ item }) => {
    const cardColor = item.color || theme.colors.primary;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { 
            backgroundColor: theme.dark ? theme.colors.elevation.level2 : '#fff',
            borderColor: theme.colors.outline + '20',
          },
        ]}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[cardColor + '15', cardColor + '05']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardImageContainer}>
            <View style={[styles.iconCircle, { backgroundColor: cardColor + '15' }]}>
              <MaterialCommunityIcons
                name={item.icon || 'shape-outline'}
                size={28}
                color={cardColor}
              />
            </View>
            {item.trending && (
              <View style={[styles.trendingBadge]}>
                <MaterialCommunityIcons name="trending-up" size={12} color="#fff" />
                <Text style={styles.trendingText}>Trending</Text>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={[styles.categoryName]} numberOfLines={1}>
              {item.name}
            </Text>
            
            {item.subcategories && (
              <Text style={styles.itemCount}>
                {item.subcategories.length} items
              </Text>
            )}

            {item.special && (
              <View style={styles.specialBadge}>
                <MaterialCommunityIcons name="tag" size={12} color={cardColor} />
                <Text style={[styles.specialText, { color: cardColor }]}>
                  {item.special}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="magnify-close"
              size={48}
              color={theme.colors.onSurfaceDisabled}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No categories found
            </Text>
            <Button
              mode="contained"
              onPress={() => setSearchQuery('')}
              style={styles.resetButton}
            >
              Clear Search
            </Button>
          </View>
        ) : (
          <View style={styles.categoriesGrid}>
            {filteredCategories.map((item) => (
              <CategoryCard key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerGradient: {
    width: '100%',
  },
  headerContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  searchBar: {
    borderRadius: 12,
    height: 45,
    marginHorizontal: SPACING.xs,
  },
  searchInput: {
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.xl,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  categoryCard: {
    width: (width - SPACING.md * 3) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    height: 160,
  },
  cardImageContainer: {
    padding: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemCount: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specialText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  resetButton: {
    minWidth: 120,
  },
});

export default CategoriesScreen;

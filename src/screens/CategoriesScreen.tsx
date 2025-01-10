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
  Surface,
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

  const CategoryCard = ({ item }) => {
    const cardColor = item.color || theme.colors.primary;
    
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <Surface
          style={[
            styles.cardGradient,
            { 
              backgroundColor: theme.dark ? theme.colors.elevation.level2 : theme.colors.surface,
              borderColor: theme.colors.outline,
              borderWidth: 1,
              elevation: theme.dark ? 0 : 2,
            },
          ]}
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
              <View style={[styles.trendingBadge, { backgroundColor: theme.colors.error, position: 'absolute', top: 8, right: 8 }]}>
                <MaterialCommunityIcons name="trending-up" size={12} color={theme.colors.onError} />
                <Text style={[styles.trendingText, { color: theme.colors.onError }]}>Trending</Text>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={[styles.categoryName, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {item.name}
            </Text>
            
            {item.subcategories && (
              <Text style={[styles.itemCount, { color: theme.colors.onSurfaceVariant }]}>
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
        </Surface>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={[styles.headerGradient, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Text style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>Categories</Text>
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
                  {cartItems.length > 0 && (
                    <Badge
                      size={16}
                      style={[styles.cartBadge, { backgroundColor: theme.colors.error }]}
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
              style={[styles.searchBar, { 
                backgroundColor: theme.dark ? theme.colors.elevation.level3 : 'rgba(255,255,255,0.9)',
                borderColor: theme.colors.outline,
              }]}
              inputStyle={[styles.searchInput, { color: theme.colors.onSurface }]}
              iconColor={theme.colors.primary}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              elevation={0}
            />
          </View>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: theme.colors.elevation.level1 }]}>
            <MaterialCommunityIcons
              name="magnify-close"
              size={48}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
              No categories found
            </Text>
          </View>
        ) : (
          <View style={styles.categoriesGrid}>
            {filteredCategories.map((item) => (
              <CategoryCard key={item.name} item={item} />
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
  scrollContent: {
    flexGrow: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  categoryCard: {
    width: '50%',
    aspectRatio: 1,
    padding: 8,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardImageContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  cardContent: {
    marginTop: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  specialText: {
    fontSize: 12,
    marginLeft: 4,
  },
  header: {
    width: '100%',
    zIndex: 1,
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  searchBar: {
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
  },
  searchInput: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    margin: 16,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    marginVertical: 12,
    textAlign: 'center',
  },
});

export default CategoriesScreen;

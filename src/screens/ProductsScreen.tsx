import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  Platform,
  Text,
} from 'react-native';
import { 
  Searchbar, 
  Button, 
  Portal, 
  Modal, 
  Chip, 
  Badge, 
  IconButton, 
  Divider, 
  useTheme, 
  ActivityIndicator 
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// Define spacing constants
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

const { width } = Dimensions.get('window');

type RouteParams = {
  category: string;
  subcategory?: string;
  product?: any;
};

const ProductsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const safeArea = useSafeAreaInsets();
  const { params } = route as { params: RouteParams };
  const { category, subcategory, product } = params || {};
  const [selectedCategory] = useState(category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory);
  const [selectedProduct, setSelectedProduct] = useState(product);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(true);
  const [favoriteMode, setFavoriteMode] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [priceFilterVisible, setPriceFilterVisible] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } = useApp();
  const [favorites, setFavorites] = useState<string[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const filtered = PRODUCTS.filter((product) => {
      const matchesCategory = product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSubcategory = !selectedSubcategory || product.subcategory.toLowerCase() === selectedSubcategory.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesCategory && matchesSubcategory && matchesSearch && matchesBrands && matchesPrice;
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSubcategory, searchQuery, selectedBrands, priceRange]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Set status bar style
    if (Platform.OS === 'android') {
      // StatusBar.setBackgroundColor('transparent');
      // StatusBar.setTranslucent(true);
    }
    return () => {
      // StatusBar.setBarStyle('default');
    };
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const sortProducts = (items: typeof PRODUCTS) => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      'Fruits & Vegetables': 'fruit-watermelon',
      'Meat & Fish': 'food-steak',
      'Bakery': 'bread-slice',
      'Dairy': 'cheese',
      'Beverages': 'cup',
      'Snacks': 'cookie',
      'Household': 'home',
      'Personal Care': 'face-man',
      'Baby Care': 'baby-carriage',
      'Pet Care': 'dog',
      // Add more category icons as needed
    };
    return icons[category] || 'shape-outline'; // Default icon if category not found
  };

  const renderQuickViewModal = () => (
    <Portal>
      <Modal
        visible={showQuickView}
        onDismiss={() => setShowQuickView(false)}
        contentContainerStyle={styles.modalContainer}
      >
        {quickViewProduct && (
          <ScrollView>
            <IconButton
              icon="close"
              size={24}
              style={styles.closeButton}
              onPress={() => setShowQuickView(false)}
            />
            <Image
              source={{ uri: quickViewProduct.image }}
              style={styles.modalImage}
            />
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{quickViewProduct.name}</Text>
              <Text style={styles.modalDescription}>
                {quickViewProduct.description}
              </Text>
              <View style={styles.modalMeta}>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons
                    name="star"
                    size={20}
                    color={COLORS.accent}
                  />
                  <Text style={styles.rating}>{quickViewProduct.rating}</Text>
                  <Text style={styles.reviews}>({quickViewProduct.reviews} reviews)</Text>
                </View>
                <Text style={styles.brand}>{quickViewProduct.brand}</Text>
              </View>
              {quickViewProduct.nutrition && (
                <View style={styles.nutritionInfo}>
                  <Text style={styles.nutritionTitle}>Nutrition Facts</Text>
                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {quickViewProduct.nutrition.calories}
                      </Text>
                      <Text style={styles.nutritionLabel}>Calories</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {quickViewProduct.nutrition.protein}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Protein</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {quickViewProduct.nutrition.carbs}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Carbs</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {quickViewProduct.nutrition.fat}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Fat</Text>
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.modalPriceContainer}>
                <View>
                  <Text style={styles.modalPrice}>
                    ${quickViewProduct.price.toFixed(2)}
                  </Text>
                  {quickViewProduct.originalPrice && (
                    <Text style={styles.modalOriginalPrice}>
                      ${quickViewProduct.originalPrice.toFixed(2)}
                    </Text>
                  )}
                </View>
                {quickViewProduct.unit && (
                  <Text style={styles.modalUnit}>/ {quickViewProduct.unit}</Text>
                )}
              </View>
              {quickViewProduct.inStock ? (
                <View style={styles.modalCartActions}>
                  {cartItems.some((item) => item.id === quickViewProduct.id) ? (
                    <View style={styles.modalQuantityContainer}>
                      <IconButton
                        icon="minus"
                        size={24}
                        onPress={() => {
                          const currentQuantity = cartItems.find((item) => item.id === quickViewProduct.id)?.quantity || 0;
                          if (currentQuantity > 1) {
                            updateCartItemQuantity(
                              quickViewProduct.id,
                              currentQuantity - 1
                            );
                          } else {
                            removeFromCart(quickViewProduct.id);
                          }
                        }}
                      />
                      <Text style={styles.modalQuantity}>
                        {cartItems.find((item) => item.id === quickViewProduct.id)?.quantity || 0}
                      </Text>
                      <IconButton
                        icon="plus"
                        size={24}
                        onPress={() => addToCart(quickViewProduct)}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.modalAddToCartButton}
                      onPress={() => addToCart(quickViewProduct)}
                    >
                      <MaterialCommunityIcons
                        name="cart-plus"
                        size={24}
                        color="#fff"
                      />
                      <Text style={styles.modalAddToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <Button mode="contained" disabled style={styles.outOfStockButton}>
                  Out of Stock
                </Button>
              )}
            </View>
          </ScrollView>
        )}
      </Modal>
    </Portal>
  );

  const renderFilterModal = () => (
    <Portal>
      <Modal
        visible={false}
        onDismiss={() => {}}
        contentContainerStyle={styles.filterModal}
      >
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filters</Text>
          <IconButton icon="close" onPress={() => {}} />
        </View>
        <Divider />
        <ScrollView style={styles.filterContent}>
          <Text style={styles.filterSectionTitle}>Price Range</Text>
          <View style={styles.priceRangeContainer}>
            {/* Add price range slider here */}
          </View>
          
          <Text style={styles.filterSectionTitle}>Brands</Text>
          <View style={styles.brandsContainer}>
            {Array.from(new Set(PRODUCTS.map(p => p.brand))).map(brand => (
              <Chip
                key={brand}
                selected={selectedBrands.includes(brand)}
                onPress={() => {
                  setSelectedBrands(prev =>
                    prev.includes(brand)
                      ? prev.filter(b => b !== brand)
                      : [...prev, brand]
                  );
                }}
                style={styles.brandChip}
              >
                {brand}
              </Chip>
            ))}
          </View>
        </ScrollView>
        <Divider />
        <View style={styles.filterActions}>
          <Button onPress={() => {
            setSelectedBrands([]);
            setPriceRange([0, 100]);
          }}>
            Reset
          </Button>
          <Button mode="contained" onPress={() => {}}>
            Apply
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  const handleProductPress = (item) => {
    setSelectedProduct(item);
    setShowQuickView(true);
    setQuickViewProduct(item);
  };

  const navigateToProduct = (product) => {
    navigation.navigate('Product', {
      category: selectedCategory,
      subcategory: selectedSubcategory,
      productId: product.id,
      productName: product.name
    });
  };

  const windowWidth = Dimensions.get('window').width;
  const numColumns = Math.floor(windowWidth / 180); // Adjust grid items based on screen width
  const itemWidth = (windowWidth - (SPACING.sm * (numColumns + 1))) / numColumns;

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.gridItem, { width: itemWidth }]}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.gridImageContainer}>
        <Image source={{ uri: item.image }} style={styles.gridImage} />
        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <MaterialCommunityIcons
            name={favorites.includes(item.id) ? "heart" : "heart-outline"}
            size={24}
            color={favorites.includes(item.id) ? COLORS.accent : "#fff"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.gridContent}>
        <Text style={styles.gridName} numberOfLines={2}>
          {item.name}
        </Text>
        
        {item.rating && (
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" size={16} color={COLORS.accent} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviews})</Text>
          </View>
        )}

        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>
                ${item.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
          {item.inStock && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: any }) => {
    const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
    const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.productLeft}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          {!item.inStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            <TouchableOpacity
              onPress={() => toggleFavorite(item.id)}
              style={styles.favoriteButton}
            >
              <MaterialCommunityIcons
                name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                size={24}
                color={favorites.includes(item.id) ? COLORS.accent : COLORS.textLight}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.productMeta}>
            {item.rating && (
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color={COLORS.accent} />
                <Text style={styles.rating}>{item.rating}</Text>
                <Text style={styles.reviews}>({item.reviews})</Text>
              </View>
            )}
            {item.brand && (
              <Text style={styles.brand}>{item.brand}</Text>
            )}
          </View>

          <View style={styles.productFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              {item.originalPrice && (
                <Text style={styles.originalPrice}>
                  ${item.originalPrice.toFixed(2)}
                </Text>
              )}
              {item.unit && (
                <Text style={styles.unit}>/ {item.unit}</Text>
              )}
            </View>

            {item.inStock && (
              <View style={styles.cartActions}>
                {isInCart ? (
                  <View style={styles.quantityContainer}>
                    <IconButton
                      icon="minus"
                      size={20}
                      onPress={() => {
                        const currentQuantity = cartItems.find((cartItem) => cartItem.id === item.id)?.quantity || 0;
                        if (currentQuantity > 1) {
                          updateCartItemQuantity(item.id, currentQuantity - 1);
                        } else {
                          removeFromCart(item.id);
                        }
                      }}
                      style={styles.quantityButton}
                    />
                    <Text style={styles.quantity}>{cartItem?.quantity || 0}</Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      onPress={() => addToCart(item)}
                      style={styles.quantityButton}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(item)}
                  >
                    <MaterialCommunityIcons
                      name="cart-plus"
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleAddToCart = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(item);
  };

  const handleQuantityChange = (item, increment) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (increment) {
      addToCart(item);
    } else {
      const currentQuantity = cartItems.find((cartItem) => cartItem.id === item.id)?.quantity || 0;
      if (currentQuantity > 1) {
        updateCartItemQuantity(item.id, currentQuantity - 1);
      } else {
        removeFromCart(item.id);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: safeArea.top }]}>
        <View style={styles.searchRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Searchbar
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={COLORS.textLight}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity 
            style={[styles.filterChip, sortModalVisible && styles.filterChipActive]}
            onPress={() => setSortModalVisible(true)}
          >
            <MaterialCommunityIcons 
              name="sort" 
              size={18} 
              color={sortModalVisible ? COLORS.primary : COLORS.text} 
            />
            <Text style={[styles.filterChipText, sortModalVisible && styles.filterChipTextActive]}>
              Sort
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterChip, priceFilterVisible && styles.filterChipActive]}
            onPress={() => setPriceFilterVisible(true)}
          >
            <MaterialCommunityIcons 
              name="cash" 
              size={18} 
              color={priceFilterVisible ? COLORS.primary : COLORS.text} 
            />
            <Text style={[styles.filterChipText, priceFilterVisible && styles.filterChipTextActive]}>
              Price
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterChip, viewType === 'grid' ? styles.filterChipActive : null]}
            onPress={() => setViewType(viewType === 'grid' ? 'list' : 'grid')}
          >
            <MaterialCommunityIcons 
              name={viewType === 'grid' ? "view-grid" : "view-list"} 
              size={18} 
              color={viewType === 'grid' ? COLORS.primary : COLORS.text} 
            />
            <Text style={[styles.filterChipText, viewType === 'grid' && styles.filterChipTextActive]}>
              {viewType === 'grid' ? 'Grid' : 'List'}
            </Text>
          </TouchableOpacity>

          {selectedCategory && (
            <TouchableOpacity 
              style={[styles.filterChip, styles.categoryChip]}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons 
                name={getCategoryIcon(typeof selectedCategory === 'string' ? selectedCategory : selectedCategory.name)} 
                size={18} 
                color={COLORS.primary} 
              />
              <Text style={[styles.filterChipText, styles.categoryChipText]} numberOfLines={1}>
                {typeof selectedCategory === 'string' ? selectedCategory : selectedCategory.name}
              </Text>
              <MaterialCommunityIcons name="close" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <Animated.FlatList
        key={viewType}
        data={filteredProducts}
        renderItem={viewType === 'grid' ? renderGridItem : renderProduct}
        numColumns={viewType === 'grid' ? numColumns : 1}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: safeArea.bottom + SPACING.xl + 60 }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="database-search"
              size={64}
              color={COLORS.textLight}
            />
            <Text style={styles.emptyText}>No products found</Text>
            <Button
              mode="contained"
              onPress={() => {
                setSearchQuery('');
                setSelectedSubcategory(null);
              }}
            >
              Clear Filters
            </Button>
          </View>
        }
      />

      {/* Quick Actions */}
      <View style={[styles.quickActions, { bottom: safeArea.bottom + SPACING.sm }]}>
        <TouchableOpacity 
          style={styles.quickButton}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    backgroundColor: '#fff',
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  filterScroll: {
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary + '15',
  },
  filterChipText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.primary,
  },
  categoryChip: {
    backgroundColor: COLORS.primary + '15',
  },
  categoryChipText: {
    color: COLORS.primary,
    maxWidth: 120,
  },
  listContent: {
    padding: SPACING.sm,
    paddingBottom: SPACING.xl + 60, // Extra space for quick actions
  },
  quickActions: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  gridItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: SPACING.xs,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  gridImageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridContent: {
    padding: SPACING.sm,
  },
  gridName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    bottom: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  productLeft: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    padding: SPACING.sm,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  favoriteButton: {
    padding: 4,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reviews: {
    marginLeft: 4,
    color: COLORS.textLight,
  },
  brand: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  unit: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  quantityButton: {
    margin: 0,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: SPACING.md,
    borderRadius: 12,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  modalContent: {
    padding: SPACING.md,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutritionInfo: {
    marginBottom: 16,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutritionLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  modalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalOriginalPrice: {
    fontSize: 16,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  modalUnit: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  modalCartActions: {
    alignItems: 'center',
  },
  modalQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  modalQuantity: {
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  modalAddToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    width: '100%',
  },
  modalAddToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outOfStockButton: {
    width: '100%',
  },
  filterModal: {
    backgroundColor: '#fff',
    margin: SPACING.md,
    borderRadius: 12,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterContent: {
    padding: SPACING.md,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  brandsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  brandChip: {
    marginBottom: SPACING.xs,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  resetButton: {
    marginTop: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: SPACING.sm,
    color: COLORS.textLight,
    fontSize: 16,
  },
});

export default ProductsScreen;

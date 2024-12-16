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
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  Searchbar,
  Chip,
  Button,
  ActivityIndicator,
  Badge,
  Portal,
  Modal,
  IconButton,
  Divider,
  useTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/constants';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRODUCTS } from '../data/products';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 140 : 120;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

type RouteParams = {
  category: string;
  subcategory?: string;
};

const ProductsScreen = ({ route }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { category, subcategory } = route.params as RouteParams;
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } = useApp();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [showQuickView, setShowQuickView] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const filtered = PRODUCTS.filter((product) => {
      const matchesCategory = product.category.toLowerCase() === category.toLowerCase();
      const matchesSubcategory = !subcategory || product.subcategory.toLowerCase() === subcategory.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesCategory && matchesSubcategory && matchesSearch && matchesBrands && matchesPrice;
    });

    setFilteredProducts(filtered);
  }, [category, subcategory, searchQuery, selectedBrands, priceRange]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

  const headerInfoOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

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
          <IconButton
            icon="arrow-left"
            iconColor="#fff"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Animated.View
            style={[
              styles.headerTitleContainer,
              { opacity: headerTitleOpacity },
            ]}
          >
            <Text style={styles.headerTitle}>
              {subcategory || category}
            </Text>
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

        <Animated.View
          style={[
            styles.headerInfo,
            { opacity: headerInfoOpacity },
          ]}
        >
          <Text style={styles.headerCategory}>
            {category}
          </Text>
          {subcategory && (
            <Text style={styles.headerSubcategory}>
              {subcategory}
            </Text>
          )}
        </Animated.View>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search products"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={COLORS.primary}
            placeholderTextColor={COLORS.textLight}
          />
          <View style={styles.viewTypeContainer}>
            <IconButton
              icon={viewType === 'grid' ? 'view-grid' : 'view-list'}
              iconColor={COLORS.primary}
              size={24}
              onPress={() => setViewType(prev => prev === 'grid' ? 'list' : 'grid')}
              style={styles.viewTypeButton}
            />
            <IconButton
              icon="filter-variant"
              iconColor={COLORS.primary}
              size={24}
              onPress={() => setShowFilters(true)}
              style={styles.filterButton}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderQuickViewModal = () => (
    <Portal>
      <Modal
        visible={showQuickView}
        onDismiss={() => setShowQuickView(false)}
        contentContainerStyle={styles.modalContainer}
      >
        {selectedProduct && (
          <ScrollView>
            <IconButton
              icon="close"
              size={24}
              style={styles.closeButton}
              onPress={() => setShowQuickView(false)}
            />
            <Image
              source={{ uri: selectedProduct.image }}
              style={styles.modalImage}
            />
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
              <Text style={styles.modalDescription}>
                {selectedProduct.description}
              </Text>
              <View style={styles.modalMeta}>
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons
                    name="star"
                    size={20}
                    color={COLORS.accent}
                  />
                  <Text style={[styles.rating, { fontSize: 16 }]}>
                    {selectedProduct.rating}
                  </Text>
                  <Text style={[styles.reviews, { fontSize: 16 }]}>
                    ({selectedProduct.reviews} reviews)
                  </Text>
                </View>
                <Text style={[styles.brand, { fontSize: 16 }]}>
                  {selectedProduct.brand}
                </Text>
              </View>
              {selectedProduct.nutrition && (
                <View style={styles.nutritionInfo}>
                  <Text style={styles.nutritionTitle}>Nutrition Facts</Text>
                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {selectedProduct.nutrition.calories}
                      </Text>
                      <Text style={styles.nutritionLabel}>Calories</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {selectedProduct.nutrition.protein}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Protein</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {selectedProduct.nutrition.carbs}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Carbs</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>
                        {selectedProduct.nutrition.fat}g
                      </Text>
                      <Text style={styles.nutritionLabel}>Fat</Text>
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.modalPriceContainer}>
                <View>
                  <Text style={styles.modalPrice}>
                    ${selectedProduct.price.toFixed(2)}
                  </Text>
                  {selectedProduct.originalPrice && (
                    <Text style={styles.modalOriginalPrice}>
                      ${selectedProduct.originalPrice.toFixed(2)}
                    </Text>
                  )}
                </View>
                {selectedProduct.unit && (
                  <Text style={styles.modalUnit}>/ {selectedProduct.unit}</Text>
                )}
              </View>
              {selectedProduct.inStock ? (
                <View style={styles.modalCartActions}>
                  {cartItems.some((item) => item.id === selectedProduct.id) ? (
                    <View style={styles.modalQuantityContainer}>
                      <IconButton
                        icon="minus"
                        size={24}
                        onPress={() => {
                          const currentQuantity = cartItems.find((item) => item.id === selectedProduct.id)?.quantity || 0;
                          if (currentQuantity > 1) {
                            updateCartItemQuantity(
                              selectedProduct.id,
                              currentQuantity - 1
                            );
                          } else {
                            removeFromCart(selectedProduct.id);
                          }
                        }}
                      />
                      <Text style={styles.modalQuantity}>
                        {cartItems.find((item) => item.id === selectedProduct.id)?.quantity || 0}
                      </Text>
                      <IconButton
                        icon="plus"
                        size={24}
                        onPress={() => addToCart(selectedProduct)}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.modalAddToCartButton}
                      onPress={() => addToCart(selectedProduct)}
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
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        contentContainerStyle={styles.filterModal}
      >
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filters</Text>
          <IconButton icon="close" onPress={() => setShowFilters(false)} />
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
          <Button mode="contained" onPress={() => setShowFilters(false)}>
            Apply
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => {
        setSelectedProduct(item);
        setShowQuickView(true);
      }}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.gridImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gridGradient}
      >
        <View style={styles.gridContent}>
          <View style={styles.gridHeader}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={styles.favoriteButton}
            >
              <MaterialCommunityIcons
                name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                size={24}
                color={favorites.includes(item.id) ? '#ff4081' : '#fff'}
              />
            </TouchableOpacity>
            {cartItems.some(cartItem => cartItem.id === item.id) && (
              <Badge style={styles.cartBadge}>In Cart</Badge>
            )}
          </View>
          <View style={styles.gridFooter}>
            <Text style={styles.gridName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.gridBrand}>{item.brand}</Text>
            <View style={styles.gridPriceRow}>
              <Text style={styles.gridPrice}>${item.price.toFixed(2)}</Text>
              <Button
                mode="contained"
                onPress={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                style={styles.gridButton}
                labelStyle={styles.gridButtonLabel}
              >
                Add
              </Button>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: any }) => {
    const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
    const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);

    const handleAddToCart = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      addToCart(item);
    };

    const handleQuantityChange = (increment: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (increment) {
        addToCart(item);
      } else {
        const currentQuantity = cartItem?.quantity || 0;
        if (currentQuantity > 1) {
          updateCartItemQuantity(item.id, currentQuantity - 1);
        } else {
          removeFromCart(item.id);
        }
      }
    };

    return (
      <TouchableOpacity
        style={[styles.productCard, { opacity: item.inStock ? 1 : 0.6 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSelectedProduct(item);
          setShowQuickView(true);
        }}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.productMeta}>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color={COLORS.accent} />
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.reviews}>({item.reviews})</Text>
            </View>
            <Text style={styles.brand}>{item.brand}</Text>
          </View>
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              {item.originalPrice && (
                <Text style={styles.originalPrice}>
                  ${item.originalPrice.toFixed(2)}
                </Text>
              )}
            </View>
            {item.unit && <Text style={styles.unit}>/ {item.unit}</Text>}
          </View>
          {item.inStock && (
            <View style={styles.cartActions}>
              {isInCart ? (
                <View style={styles.quantityContainer}>
                  <IconButton
                    icon="minus"
                    size={20}
                    onPress={() => handleQuantityChange(false)}
                    style={styles.quantityButton}
                  />
                  <Text style={styles.quantity}>{cartItem?.quantity || 0}</Text>
                  <IconButton
                    icon="plus"
                    size={20}
                    onPress={() => handleQuantityChange(true)}
                    style={styles.quantityButton}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={handleAddToCart}
                >
                  <MaterialCommunityIcons
                    name="cart-plus"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: HEADER_MAX_HEIGHT + insets.top }]}>
      {renderHeader()}
      
      <View style={styles.sortContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortScrollContent}
        >
          <Chip
            selected={sortBy === 'price'}
            onPress={() => setSortBy('price')}
            style={styles.sortChip}
            icon="sort"
          >
            Price
          </Chip>
          <Chip
            selected={sortBy === 'rating'}
            onPress={() => setSortBy('rating')}
            style={styles.sortChip}
            icon="star"
          >
            Rating
          </Chip>
          <Chip
            selected={sortBy === 'name'}
            onPress={() => setSortBy('name')}
            style={styles.sortChip}
            icon="alphabetical"
          >
            Name
          </Chip>
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="emoticon-sad-outline"
            size={48}
            color={COLORS.textLight}
          />
          <Text style={styles.emptyText}>No products found</Text>
          <Button
            mode="contained"
            onPress={() => {
              setSearchQuery('');
              setSelectedBrands([]);
              setPriceRange([0, 100]);
            }}
            style={styles.resetButton}
          >
            Reset Filters
          </Button>
        </View>
      ) : (
        <FlatList
          data={sortProducts(filteredProducts)}
          renderItem={viewType === 'grid' ? renderGridItem : renderProduct}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={viewType === 'grid' ? styles.gridList : styles.listContent}
          numColumns={viewType === 'grid' ? 2 : 1}
          key={viewType} // Force re-render when view type changes
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      )}

      {renderQuickViewModal()}
      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  backButton: {
    marginLeft: -8,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
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
  headerInfo: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  headerCategory: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubcategory: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  searchBar: {
    flex: 1,
    elevation: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    height: 40,
  },
  searchInput: {
    fontSize: 14,
  },
  viewTypeContainer: {
    flexDirection: 'row',
    marginLeft: SPACING.xs,
  },
  viewTypeButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    margin: 0,
    borderRadius: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    margin: 0,
    marginLeft: SPACING.xs,
    borderRadius: 8,
  },
  sortContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  sortScrollContent: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  sortChip: {
    marginRight: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  gridList: {
    padding: SPACING.sm,
  },
  gridCard: {
    flex: 1,
    margin: SPACING.xs,
    borderRadius: 12,
    overflow: 'hidden',
    height: 250,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    padding: SPACING.sm,
  },
  gridContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridFooter: {
    gap: SPACING.xs,
  },
  gridName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gridBrand: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
  },
  gridPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridButton: {
    borderRadius: 8,
  },
  gridButtonLabel: {
    fontSize: 12,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: SPACING.sm,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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
  },
  reviews: {
    marginLeft: 4,
    color: COLORS.textLight,
  },
  brand: {
    color: COLORS.textLight,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 4,
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
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
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

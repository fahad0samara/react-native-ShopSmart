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
  ActivityIndicator,
  Card,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/mockData';
import { Product } from '../types/product';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { theme } from '../utils/theme';

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
  color?: string;
  icon?: string;
};

const ProductsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const safeArea = useSafeAreaInsets();
  const { params } = route as { params: RouteParams };
  const { category, subcategory, product, color, icon } = params || {};
  const [selectedCategory] = useState(category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory);
  const [selectedProduct, setSelectedProduct] = useState(product);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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
    if (!selectedCategory) {
      setFilteredProducts([]);
      setLoading(false);
      return;
    }

    try {
      // Filter products by selected category
      const categoryProducts = PRODUCTS.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );

      if (!categoryProducts || categoryProducts.length === 0) {
        console.log('No products found for category:', selectedCategory);
        setFilteredProducts([]);
        setLoading(false);
        return;
      }

      let filtered = categoryProducts;

      // Apply subcategory filter
      if (selectedSubcategory) {
        filtered = filtered.filter(product => 
          product.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase()
        );
      }

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply brand filter
      if (selectedBrands.length > 0) {
        filtered = filtered.filter(product =>
          selectedBrands.includes(product.brand)
        );
      }

      // Apply price filter
      filtered = filtered.filter(product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // Apply sorting
      switch (sortBy) {
        case 'price':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
      }

      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubcategory, searchQuery, selectedBrands, priceRange, sortBy]);

  const renderHeader = () => {
    const headerHeight = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [200, 120],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={[
            color || theme.colors.primary, 
            theme.dark ? theme.colors.elevation.level2 : theme.colors.primaryContainer, 
            theme.colors.background
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.headerGradient]}
        >
          <View style={[styles.headerContent, { paddingTop: safeArea.top }]}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <IconButton
                  icon="arrow-left"
                  iconColor={theme.colors.onPrimary}
                  size={24}
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                />
                <View>
                  <Text style={[styles.headerTitle, { color: theme.colors.onPrimary }]}>{category}</Text>
                  {selectedSubcategory && (
                    <Text style={[styles.headerSubtitle, { color: theme.colors.onPrimary }]}>
                      {selectedSubcategory}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.headerActions}>
                <IconButton
                  icon={viewType === 'grid' ? 'view-list' : 'view-grid'}
                  iconColor={theme.colors.onPrimary}
                  size={24}
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setViewType(viewType === 'grid' ? 'list' : 'grid');
                  }}
                />
                <IconButton
                  icon="sort"
                  iconColor={theme.colors.onPrimary}
                  size={24}
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSortModalVisible(true);
                  }}
                />
                <IconButton
                  icon="filter-variant"
                  iconColor={theme.colors.onPrimary}
                  size={24}
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setPriceFilterVisible(true);
                  }}
                />
              </View>
            </View>
            <View style={styles.searchContainer}>
              <Searchbar
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[
                  styles.searchBar,
                  { 
                    backgroundColor: theme.dark ? theme.colors.elevation.level3 : 'rgba(255,255,255,0.9)',
                    borderColor: theme.colors.outline
                  }
                ]}
                inputStyle={[styles.searchInput, { color: theme.colors.onSurface }]}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                iconColor={theme.colors.primary}
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const isInCart = cartItems.some(cartItem => cartItem.id === item.id);
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={[styles.cardContainer, viewType === 'list' && styles.cardContainerList]}>
        <Card
          style={[
            styles.productCard,
            viewType === 'list' && styles.productCardList,
            { backgroundColor: theme.dark ? theme.colors.elevation.level1 : theme.colors.surface }
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('ItemDetails', { product: item });
          }}
          mode="elevated"
        >
          <View style={styles.cardInner}>
            <View style={[
              styles.imageContainer,
              viewType === 'list' && styles.imageContainerList,
              { backgroundColor: theme.dark ? theme.colors.elevation.level2 : theme.colors.surfaceVariant }
            ]}>
              <Image 
                source={item.image || { uri: 'https://placehold.co/400x400/png' }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={[styles.favoriteButton, { 
                  backgroundColor: theme.dark ? theme.colors.elevation.level3 + '80' : theme.colors.surface + '80' 
                }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (isFavorite) {
                    setFavorites(favorites.filter(id => id !== item.id));
                  } else {
                    setFavorites([...favorites, item.id]);
                  }
                }}
              >
                <MaterialCommunityIcons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? theme.colors.error : theme.colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>

            <Card.Content style={styles.cardContent}>
              <Text style={[styles.productName, { color: theme.colors.onSurface }]} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
                ${item.price.toFixed(2)}
              </Text>
              {item.rating && (
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons
                    name="star"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.ratingText, { color: theme.colors.onSurface }]}>
                    {item.rating.toFixed(1)}
                  </Text>
                  {item.reviews && (
                    <Text style={[styles.reviewCount, { color: theme.colors.onSurfaceVariant }]}>
                      ({item.reviews} reviews)
                    </Text>
                  )}
                </View>
              )}
              <Button
                mode={isInCart ? "outlined" : "contained"}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (isInCart) {
                    removeFromCart(item.id);
                  } else {
                    addToCart(item);
                  }
                }}
                style={[styles.addButton, { marginTop: SPACING.sm }]}
                icon={isInCart ? "cart-off" : "cart-plus"}
                contentStyle={{ height: 40 }}
              >
                {isInCart ? "Remove" : "Add to Cart"}
              </Button>
            </Card.Content>
          </View>
        </Card>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.colors.elevation.level1 }]}>
      <MaterialCommunityIcons
        name="package-variant"
        size={64}
        color={theme.colors.onSurfaceVariant}
      />
      <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
        No products found
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.browseButton}
      >
        Browse Categories
      </Button>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      
      <Animated.FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
        numColumns={viewType === 'grid' ? (width > 768 ? 3 : 2) : 1}
        key={viewType} // Force re-render when view type changes
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        ListEmptyComponent={renderEmptyState()}
        columnWrapperStyle={viewType === 'grid' ? styles.gridColumns : undefined}
      />

      <Portal>
        <Modal
          visible={sortModalVisible}
          onDismiss={() => setSortModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Sort By</Text>
          <Divider style={styles.modalDivider} />
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setSortBy('price');
              setSortModalVisible(false);
            }}
          >
            <MaterialCommunityIcons
              name="sort-numeric-ascending"
              size={24}
              color={sortBy === 'price' ? theme.colors.primary : theme.colors.onSurface}
            />
            <Text style={[
              styles.modalOptionText,
              sortBy === 'price' && { color: theme.colors.primary }
            ]}>
              Price: Low to High
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setSortBy('name');
              setSortModalVisible(false);
            }}
          >
            <MaterialCommunityIcons
              name="sort-alphabetical-ascending"
              size={24}
              color={sortBy === 'name' ? theme.colors.primary : theme.colors.onSurface}
            />
            <Text style={[
              styles.modalOptionText,
              sortBy === 'name' && { color: theme.colors.primary }
            ]}>
              Name: A to Z
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setSortBy('rating');
              setSortModalVisible(false);
            }}
          >
            <MaterialCommunityIcons
              name="star"
              size={24}
              color={sortBy === 'rating' ? theme.colors.primary : theme.colors.onSurface}
            />
            <Text style={[
              styles.modalOptionText,
              sortBy === 'rating' && { color: theme.colors.primary }
            ]}>
              Rating: High to Low
            </Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
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
    flex: 1,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  searchBar: {
    borderRadius: 12,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  searchInput: {
    fontSize: 16,
  },
  productList: {
    padding: SPACING.sm,
    paddingTop: SPACING.md,
  },
  gridColumns: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
  },
  cardContainer: {
    padding: SPACING.xs,
    width: '50%',
  },
  cardContainerList: {
    width: '100%',
  },
  productCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productCardList: {
    flexDirection: 'row',
  },
  cardInner: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  imageContainer: {
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 12,
  },
  imageContainerList: {
    aspectRatio: 1,
    width: 120,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    borderRadius: 20,
    padding: SPACING.xs,
    zIndex: 1,
  },
  cardContent: {
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: 14,
  },
  addButton: {
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl * 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  resetButton: {
    minWidth: 120,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    padding: SPACING.lg,
    margin: SPACING.lg,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  modalDivider: {
    marginBottom: SPACING.md,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  modalOptionText: {
    fontSize: 16,
  },
});

export default ProductsScreen;

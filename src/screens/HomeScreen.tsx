import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  RefreshControl,
  ImageBackground,
  Animated,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler';
import Header from '../components/Header';
import CategoryList from '../components/CategoryList';
import { COLORS, SPACING } from '../utils/constants';
import { useApp } from '../context/AppContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { flashDeals, newArrivals } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      title: 'Fresh Vegetables',
      subtitle: 'Up to 50% Off',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1553546895-531931aa1aa8',
      title: 'Organic Fruits',
      subtitle: 'Special Deals',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906',
      title: 'Healthy Snacks',
      subtitle: 'New Arrivals',
    },
  ];

  const featuredCategories = [
    { id: 1, name: 'Vegetables', icon: 'food-apple', color: '#4CAF50' },
    { id: 2, name: 'Fruits', icon: 'fruit-watermelon', color: '#FF9800' },
    { id: 3, name: 'Meat', icon: 'food-steak', color: '#F44336' },
    { id: 4, name: 'Fish', icon: 'fish', color: '#2196F3' },
    { id: 5, name: 'Bakery', icon: 'bread-slice', color: '#795548' },
    { id: 6, name: 'Drinks', icon: 'cup', color: '#9C27B0' },
    { id: 7, name: 'Snacks', icon: 'cookie', color: '#FF5722' },
    { id: 8, name: 'More', icon: 'dots-horizontal', color: '#607D8B' },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      <Header showLocation />
      <GestureHandlerScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Featured Banner Carousel */}
          <View style={[styles.carouselContainer, { width }]}>
            <GestureHandlerScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {banners.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.bannerContainer, { width: width - SPACING.md * 2 }]}
                  onPress={() => navigation.navigate('Categories', { filter: item.title.toLowerCase() })}
                >
                  <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.bannerImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <View style={styles.bannerOverlay}>
                      <Text style={styles.bannerTitle}>{item.title}</Text>
                      <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                      <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Categories', { filter: item.title.toLowerCase() })}
                        style={styles.bannerButton}
                        labelStyle={styles.bannerButtonLabel}
                      >
                        Shop Now
                      </Button>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </GestureHandlerScrollView>
            <View style={styles.pagination}>
              {banners.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 16, 8],
                  extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View
                    key={i}
                    style={[
                      styles.paginationDot,
                      { width: dotWidth, opacity },
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {/* Featured Categories Grid */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Categories</Text>
            </View>
            <View style={styles.categoriesGrid}>
              {featuredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => navigation.navigate('Categories', { filter: category.name.toLowerCase() })}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <MaterialCommunityIcons name={category.icon} size={24} color={category.color} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Flash Deals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.flashDealsHeader}>
                <MaterialCommunityIcons name="flash" size={24} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Flash Deals</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Categories', { filter: 'deals' })}>
                <Text style={styles.viewAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <GestureHandlerScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sectionContent}
            >
              {flashDeals.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dealCard}
                  onPress={() => navigation.navigate('ItemDetails', { item })}
                >
                  <Image source={{ uri: item.image }} style={styles.dealImage} />
                  <View style={styles.dealInfo}>
                    <Text style={styles.dealName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.dealPriceRow}>
                      <Text style={styles.dealPrice}>${item.price}</Text>
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>20% OFF</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </GestureHandlerScrollView>
          </View>

          {/* New Arrivals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Arrivals</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Categories', { filter: 'new' })}>
                <Text style={styles.viewAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.grid}>
              {newArrivals.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate('ItemDetails', { item })}
                >
                  <Image source={{ uri: item.image }} style={styles.gridImage} />
                  <View style={styles.gridInfo}>
                    <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.gridPrice}>${item.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </GestureHandlerScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: SPACING.md,
  },
  carouselContainer: {
    height: 200,
    marginVertical: SPACING.sm,
  },
  bannerContainer: {
    height: 200,
    paddingHorizontal: SPACING.xs,
  },
  bannerImage: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerOverlay: {
    padding: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: SPACING.md,
  },
  bannerButton: {
    borderRadius: 8,
    width: 120,
  },
  bannerButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  section: {
    marginVertical: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  flashDealsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewAll: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -SPACING.xs,
  },
  categoryItem: {
    width: '25%',
    alignItems: 'center',
    padding: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.text,
  },
  sectionContent: {
    paddingHorizontal: SPACING.xs,
  },
  dealCard: {
    width: 180,
    marginRight: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dealInfo: {
    padding: SPACING.sm,
  },
  dealName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: SPACING.xs,
    color: COLORS.text,
  },
  dealPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  discountBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridInfo: {
    padding: SPACING.sm,
  },
  gridName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default HomeScreen;

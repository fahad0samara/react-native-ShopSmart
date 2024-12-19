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
import { CATEGORIES } from '../data/mockData';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { flashDeals = [], newArrivals = [] } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const banners = [
    {
      id: 1,
      image: require('../../assets/products/fresh produce/organic-bananas.jpg'),
      title: 'Fresh Vegetables',
      subtitle: 'Up to 50% Off',
    },
    {
      id: 2,
      image: require('../../assets/products/fresh produce/fresh-strawberries.jpg'),
      title: 'Organic Fruits',
      subtitle: 'Special Deals',
    },
    {
      id: 3,
      image: require('../../assets/products/snacks/trail-mix.jpg'),
      title: 'Healthy Snacks',
      subtitle: 'New Arrivals',
    },
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
                    source={item.image}
                    style={styles.bannerImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <View style={styles.bannerContent}>
                      <Text style={styles.bannerTitle}>{item.title}</Text>
                      <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </GestureHandlerScrollView>
            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              {banners.map((_, index) => {
                const inputRange = [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ];
                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View
                    key={index}
                    style={[styles.paginationDot, { opacity }]}
                  />
                );
              })}
            </View>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <CategoryList categories={CATEGORIES} />
          </View>

          {/* Flash Deals */}
          {flashDeals && flashDeals.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Flash Deals</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('FlashDeals')}
                >
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <GestureHandlerScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.productList}
              >
                {flashDeals.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.productCard}
                    onPress={() => navigation.navigate('ProductDetails', { product: item })}
                  >
                    <Image source={item.image} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>${item.price}</Text>
                        <Text style={styles.discount}>{item.discount}% OFF</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </GestureHandlerScrollView>
            </View>
          )}

          {/* New Arrivals */}
          {newArrivals && newArrivals.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Arrivals</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('NewArrivals')}
                >
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <GestureHandlerScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.productList}
              >
                {newArrivals.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.productCard}
                    onPress={() => navigation.navigate('ProductDetails', { product: item })}
                  >
                    <Image source={item.image} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.price}>${item.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </GestureHandlerScrollView>
            </View>
          )}
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
    marginBottom: SPACING.lg,
  },
  bannerContainer: {
    height: '100%',
    paddingHorizontal: SPACING.xs,
  },
  bannerImage: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  bannerContent: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: SPACING.sm,
    borderRadius: 8,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: COLORS.primary,
  },
  productList: {
    marginTop: SPACING.sm,
  },
  productCard: {
    width: 150,
    marginRight: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: SPACING.sm,
  },
  productName: {
    fontSize: 14,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  discount: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default HomeScreen;

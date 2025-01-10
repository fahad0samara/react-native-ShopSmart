import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Text as RNText } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/HomeScreenStyles';

const PADDING = 16;

const HomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

  // Categories data
  const categories = [
    { id: '1', name: 'Electronics', icon: 'laptop' },
    { id: '2', name: 'Fashion', icon: 'hanger' },
    { id: '3', name: 'Home', icon: 'home' },
    { id: '4', name: 'Beauty', icon: 'face-woman' },
    { id: '5', name: 'Sports', icon: 'basketball' },
    { id: '6', name: 'Books', icon: 'book-open-variant' },
  ];

  // Featured banners
  const banners = [
    {
      id: '1',
      title: 'Summer Sale',
      subtitle: 'Up to 50% off',
      image: require('../../assets/icon.png'),
      backgroundColor: '#FFE1E1',
      textColor: '#000',
    },
    {
      id: '2',
      title: 'New Arrivals',
      subtitle: 'Check out the latest',
      image: require('../../assets/icon.png'),
      backgroundColor: '#E1F6FF',
      textColor: '#000',
    },
  ];

  // Special offers
  const specialOffers = [
    {
      id: '1',
      title: 'Flash Sale',
      subtitle: '24h Only',
      image: require('../../assets/icon.png'),
      backgroundColor: '#FFE1E1',
      textColor: '#000',
    },
    {
      id: '2',
      title: 'Clearance',
      subtitle: 'Last Chance',
      image: require('../../assets/icon.png'),
      backgroundColor: '#E1F6FF',
      textColor: '#000',
    },
  ];

  // Quick actions data
  const quickActions = [
    { id: '1', name: 'Scan', icon: 'qrcode-scan', color: '#FF6B6B' },
    { id: '2', name: 'Wishlist', icon: 'heart-outline', color: '#4ECDC4' },
    { id: '3', name: 'Orders', icon: 'package-variant', color: '#45B7D1' },
    { id: '4', name: 'Rewards', icon: 'gift-outline', color: '#96CEB4' },
  ];

  // Wishlist items
  const wishlistItems = [
    {
      id: '1',
      name: 'Wishlist Item 1',
      price: 49.99,
      image: require('../../assets/icon.png'),
      inStock: true,
    },
    {
      id: '2',
      name: 'Wishlist Item 2',
      price: 29.99,
      image: require('../../assets/icon.png'),
      inStock: false,
    },
  ];

  // Event handlers
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSearchPress = useCallback(() => {
    Haptics.selectionAsync();
    navigation.navigate('Search' as never);
  }, [navigation]);

  const handleFilterPress = useCallback(() => {
    Haptics.selectionAsync();
    navigation.navigate('Filters' as never);
  }, [navigation]);

  const handleNotificationsPress = useCallback(() => {
    Haptics.selectionAsync();
    navigation.navigate('Notifications' as never);
  }, [navigation]);

  const handleCartPress = useCallback(() => {
    Haptics.selectionAsync();
    navigation.navigate('Cart' as never);
  }, [navigation]);

  const handleItemPress = useCallback((item) => {
    Haptics.selectionAsync();
    navigation.navigate('ProductDetails' as never, { product: item } as never);
  }, [navigation]);

  const handleQuickActionPress = useCallback((action) => {
    Haptics.selectionAsync();
    switch (action.name.toLowerCase()) {
      case 'wishlist':
        navigation.navigate('Profile', {
          screen: 'ProfileMain',
          params: { initialTab: 'wishlist' }
        } as never);
        break;
      case 'orders':
        navigation.navigate('Profile', {
          screen: 'Orders'
        } as never);
        break;
      case 'rewards':
        navigation.navigate('Profile', {
          screen: 'Rewards'
        } as never);
        break;
    }
  }, [navigation]);

  const handleSeeAllWishlist = useCallback(() => {
    navigation.navigate('Profile', {
      screen: 'ProfileMain',
      params: { initialTab: 'wishlist' }
    } as never);
  }, [navigation]);

  const handleCategoryPress = useCallback((category) => {
    Haptics.selectionAsync();
    navigation.navigate('Category' as never, { category } as never);
  }, [navigation]);

  const handleBannerPress = useCallback((banner) => {
    Haptics.selectionAsync();
    navigation.navigate('ProductDetails' as never, { banner } as never);
  }, []);

  const handleSpecialOfferPress = useCallback((offer) => {
    Haptics.selectionAsync();
    navigation.navigate('SpecialOffer' as never, { offer } as never);
  }, [navigation]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time function
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Render functions
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryIcon}>
        <MaterialCommunityIcons name={item.icon} size={24} color="#000" />
      </View>
      <RNText style={styles.categoryName}>{item.name}</RNText>
    </TouchableOpacity>
  );

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.productCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <Image source={item.image} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productInfo}>
        <RNText style={styles.productName} numberOfLines={2}>
          {item.name}
        </RNText>
        <RNText style={styles.productPrice}>${item.price}</RNText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchPress}
            >
              <MaterialCommunityIcons name="magnify" size={24} color="#000" />
              <RNText style={styles.searchButtonText}>Search products</RNText>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleFilterPress}
            >
              <MaterialCommunityIcons name="tune" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotificationsPress}
            >
              <MaterialCommunityIcons name="bell-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleCartPress}
            >
              <MaterialCommunityIcons name="cart-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.content}
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionItem}
              onPress={() => handleQuickActionPress(action)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <MaterialCommunityIcons name={action.icon} size={24} color="#fff" />
              </View>
              <RNText style={styles.quickActionName}>{action.name}</RNText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => renderCategoryItem({ item: category }))}
        </ScrollView>

        {/* Featured Banners */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentBannerIndex(newIndex);
            }}
          >
            {banners.map((banner) => (
              <TouchableOpacity
                key={banner.id}
                style={[styles.bannerItem, { width }]}
                onPress={() => handleBannerPress(banner)}
                activeOpacity={0.9}
              >
                <Image
                  source={banner.image}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.bannerGradient}
                >
                  <View style={styles.bannerContent}>
                    <RNText style={styles.bannerTitle}>{banner.title}</RNText>
                    <RNText style={styles.bannerSubtitle}>
                      {banner.subtitle}
                    </RNText>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Special Offers */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.specialOffersContainer}
        >
          {specialOffers.map((offer) => (
            <TouchableOpacity
              key={offer.id}
              style={[
                styles.specialOfferItem,
                { backgroundColor: offer.backgroundColor },
              ]}
              onPress={() => handleSpecialOfferPress(offer)}
              activeOpacity={0.7}
            >
              <Image
                source={offer.image}
                style={styles.specialOfferImage}
                resizeMode="cover"
              />
              <View style={styles.specialOfferContent}>
                <RNText
                  style={[styles.specialOfferTitle, { color: offer.textColor }]}
                >
                  {offer.title}
                </RNText>
                <RNText
                  style={[styles.specialOfferSubtitle, { color: offer.textColor }]}
                >
                  {offer.subtitle}
                </RNText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Wishlist Preview */}
        {wishlistItems.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <RNText style={styles.sectionTitle}>Your Wishlist</RNText>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={handleSeeAllWishlist}
              >
                <RNText style={styles.seeAllText}>See All</RNText>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.wishlistContainer}
            >
              {wishlistItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.wishlistCard}
                  onPress={() => handleItemPress(item)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={item.image}
                    style={styles.wishlistImage}
                    resizeMode="cover"
                    defaultSource={require('../../assets/icon.png')}
                  />
                  <View style={styles.wishlistInfo}>
                    <RNText style={styles.wishlistName} numberOfLines={1}>
                      {item.name}
                    </RNText>
                    <RNText style={styles.wishlistPrice}>${item.price}</RNText>
                    <RNText style={[
                      styles.stockStatus,
                      { color: item.inStock ? '#00B761' : '#FF4B4B' }
                    ]}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </RNText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

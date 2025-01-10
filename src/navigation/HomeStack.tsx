import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import FiltersScreen from '../screens/FiltersScreen';
import SpecialOfferScreen from '../screens/SpecialOfferScreen';
import CategoryScreen from '../screens/CategoryScreen';
import CollectionScreen from '../screens/CollectionScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CartScreen from '../screens/CartScreen';
import WishlistScreen from '../screens/WishlistScreen';
import OrdersScreen from '../screens/OrdersScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ScannerScreen from '../screens/ScannerScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Filters" component={FiltersScreen} />
      <Stack.Screen name="SpecialOffer" component={SpecialOfferScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';

// Import screens
import ProfileScreen from '../screens/ProfileScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AddressScreen from '../screens/AddressScreen';
import MyReviewsScreen from '../screens/MyReviewsScreen';
import SecurityScreen from '../screens/SecurityScreen';
import MyDetailsScreen from '../screens/MyDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import RewardsScreen from '../screens/RewardsScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'My Orders' }}
      />
      <Stack.Screen 
        name="Address" 
        component={AddressScreen}
        options={{ title: 'My Addresses' }}
      />
      <Stack.Screen 
        name="Reviews" 
        component={MyReviewsScreen}
        options={{ title: 'My Reviews' }}
      />
      <Stack.Screen 
        name="Security" 
        component={SecurityScreen}
        options={{ title: 'Security Settings' }}
      />
      <Stack.Screen 
        name="Details" 
        component={MyDetailsScreen}
        options={{ title: 'Account Details' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="HelpSupport" 
        component={HelpSupportScreen}
        options={{ title: 'Help & Support' }}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
        options={{ title: 'Payment Methods' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen 
        name="Rewards" 
        component={RewardsScreen}
        options={{ title: 'My Rewards' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;

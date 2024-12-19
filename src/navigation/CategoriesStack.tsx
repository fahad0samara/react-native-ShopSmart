import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { CategoriesStackParamList } from './types';

// Import screens
import CategoriesScreen from '../screens/CategoriesScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';

const Stack = createStackNavigator<CategoriesStackParamList>();

const CategoriesStack = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
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
        name="CategoriesMain" 
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Products" 
        component={ProductsScreen}
        options={({ route }) => ({ 
          title: route.params?.category || 'Products',
        })}
      />
      <Stack.Screen 
        name="ItemDetails" 
        component={ItemDetailsScreen}
        options={({ route }) => ({ 
          title: route.params?.item?.name || 'Product Details',
        })}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStack;

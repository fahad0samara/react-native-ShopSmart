import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SPACING } from '../utils/constants';

const ProductDetailsScreen = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const product = route.params?.product;

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={product.image} 
          style={styles.image}
          defaultSource={require('../../assets/icon.png')}
          resizeMode="cover"
        />
        <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {product.name}
          </Text>
          <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
            ${product.price}
          </Text>
          {product.description && (
            <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onSurface }]}>
              {product.description}
            </Text>
          )}
          {product.isOrganic && (
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { color: theme.colors.primary }]}>Organic</Text>
            </View>
          )}
          <Button
            mode="contained"
            onPress={() => {/* Add to cart functionality */}}
            style={styles.button}
          >
            Add to Cart
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: SPACING.large,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  title: {
    marginBottom: SPACING.small,
  },
  price: {
    marginBottom: SPACING.medium,
  },
  description: {
    marginBottom: SPACING.large,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small / 2,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    marginBottom: SPACING.medium,
  },
  badgeText: {
    fontWeight: '600',
  },
  button: {
    marginTop: SPACING.medium,
  },
});

export default ProductDetailsScreen;

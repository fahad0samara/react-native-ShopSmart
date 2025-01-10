import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar, 
  Platform 
} from 'react-native';
import { Text, Button, IconButton, Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Define colors inline to avoid dependency issues
const COLORS = {
  primary: '#00B761',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#FF4444',
  text: '#333333',
  textLight: '#666666',
  border: '#EEEEEE',
};

const ItemDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { addToCart, cartItems } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  
  const product = route.params?.product;

  useEffect(() => {
    if (!product) {
      navigation.goBack();
    }
  }, [product, navigation]);

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const handleQuantityChange = (increment: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(prev => increment ? prev + 1 : Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToCart(product, quantity);
  };

  const toggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorite(!favorite);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <IconButton
          icon={favorite ? 'heart' : 'heart-outline'}
          size={24}
          onPress={toggleFavorite}
          iconColor={favorite ? COLORS.error : theme.colors.onSurface}
          style={styles.favoriteButton}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image */}
        <Image 
          source={product.image} 
          style={styles.image}
          resizeMode="cover"
          defaultSource={require('../../assets/icon.png')}
        />

        {/* Product Info */}
        <Surface style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          
          {product.unit && (
            <Text style={styles.unit}>Per {product.unit}</Text>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}% OFF</Text>
              </View>
            )}
          </View>

          {product.rating && (
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>{product.rating}</Text>
              <Text style={styles.ratingCount}>({product.ratingCount} reviews)</Text>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                onPress={() => handleQuantityChange(false)}
                style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                disabled={quantity === 1}
              >
                <MaterialCommunityIcons name="minus" size={20} color={quantity === 1 ? COLORS.textLight : COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity 
                onPress={() => handleQuantityChange(true)}
                style={styles.quantityButton}
              >
                <MaterialCommunityIcons name="plus" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <Button
            mode="contained"
            onPress={handleAddToCart}
            style={styles.addToCartButton}
            contentStyle={styles.addToCartContent}
          >
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </Button>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 8,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: COLORS.surface,
    margin: 8,
  },
  favoriteButton: {
    backgroundColor: COLORS.surface,
    margin: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  image: {
    width: width,
    height: height * 0.45,
    backgroundColor: COLORS.border,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 34,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  unit: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 8,
    color: COLORS.text,
  },
  ratingCount: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    color: COLORS.text,
  },
  addToCartButton: {
    marginTop: 8,
  },
  addToCartContent: {
    paddingVertical: 8,
  },
});

export default ItemDetailsScreen;

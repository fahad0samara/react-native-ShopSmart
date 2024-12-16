import React, { useState } from 'react';
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
  
  const item = route.params?.item;

  // If no item is provided, navigate back
  if (!item) {
    navigation.goBack();
    return null;
  }

  const handleQuantityChange = (increment: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(prev => increment ? prev + 1 : Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToCart({ ...item, quantity });
    navigation.goBack();
  };

  const toggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorite(!favorite);
  };

  const cartItemCount = cartItems.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.overlay, { paddingTop: insets.top || 16 }]}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={toggleFavorite}
              >
                <MaterialCommunityIcons
                  name={favorite ? "heart" : "heart-outline"}
                  size={24}
                  color={favorite ? COLORS.error : "#fff"}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => navigation.navigate('Cart')}
              >
                <MaterialCommunityIcons name="cart-outline" size={24} color="#fff" />
                {cartItemCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartItemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Surface style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.weight}>{item.weight}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${item.price}</Text>
              <Text style={styles.priceLabel}>per unit</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this item</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Quantity</Text>
            <View style={styles.quantityWrapper}>
              <View style={styles.quantityContainer}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() => handleQuantityChange(false)}
                  disabled={quantity === 1}
                  style={styles.quantityButton}
                />
                <Text style={styles.quantity}>{quantity}</Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => handleQuantityChange(true)}
                  style={styles.quantityButton}
                />
              </View>
              <Text style={styles.stockStatus}>In Stock</Text>
            </View>
          </View>
        </Surface>
      </ScrollView>

      <Surface style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalPrice}>${(item.price * quantity).toFixed(2)}</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleAddToCart}
          style={styles.addButton}
          contentStyle={styles.addButtonContent}
        >
          Add to Cart
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: height * 0.45,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  category: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  weight: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 28,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 4,
  },
  quantityButton: {
    margin: 0,
  },
  quantity: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginHorizontal: 16,
  },
  stockStatus: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalContainer: {
    flex: 1,
    marginRight: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: COLORS.primary,
  },
  addButton: {
    minWidth: 140,
    borderRadius: 12,
  },
  addButtonContent: {
    height: 48,
  },
});

export default ItemDetailsScreen;

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Text, Surface, Button, IconButton, useTheme, Portal, Modal as PaperModal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

const CartScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    placeOrder 
  } = useApp();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const paymentMethods = [
    { id: 'cash', label: 'Cash on Delivery', icon: 'cash' },
    { id: 'card', label: 'Credit Card', icon: 'credit-card' },
    { id: 'paypal', label: 'PayPal', icon: 'credit-card-check' },
  ];

  const handleQuantityChange = (itemId: string, increment: boolean) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      if (!increment && item.quantity <= 1) {
        removeFromCart(itemId);
      } else {
        const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
        updateCartItemQuantity(itemId, newQuantity);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayment(paymentId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPaymentModal(false);
    handlePlaceOrder();
  };

  const handlePlaceOrder = () => {
    placeOrder();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('Orders' as never);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      
      <Surface style={[styles.header, { backgroundColor: theme.colors.elevation.level2 }]}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            Shopping Cart
          </Text>
        </View>
      </Surface>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cartItems.length === 0 ? (
          <Surface style={[styles.emptyContainer, { backgroundColor: theme.colors.elevation.level1 }]}>
            <MaterialCommunityIcons 
              name="cart-outline" 
              size={64} 
              color={theme.colors.primary} 
            />
            <Text 
              variant="titleLarge" 
              style={[styles.emptyText, { color: theme.colors.onSurface }]}
            >
              Your cart is empty
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Home' as never)}
              style={styles.shopButton}
            >
              Start Shopping
            </Button>
          </Surface>
        ) : (
          cartItems.map((item) => (
            <Surface 
              key={item.id} 
              style={[styles.cartItemCard, { backgroundColor: theme.colors.elevation.level1 }]}
              elevation={1}
            >
              <View style={[styles.itemImage, { backgroundColor: 'rgba(0,0,0,0.05)'}]}>
                {typeof item.image === 'number' ? (
                  <Image source={item.image} style={styles.image} />
                ) : (
                  <Image source={{ uri: item.image }} style={styles.image} />
                )}
              </View>
              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  <Text 
                    variant="titleMedium" 
                    style={[styles.itemName, { color: theme.colors.onSurface }]}
                  >
                    {item.name}
                  </Text>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => handleRemoveItem(item.id)}
                    iconColor={theme.colors.error}
                  />
                </View>
                <Text 
                  variant="titleMedium" 
                  style={[styles.itemPrice, { color: theme.colors.primary }]}
                >
                  ${item.price.toFixed(2)}
                </Text>
                <View style={styles.quantityContainer}>
                  <IconButton
                    icon="minus"
                    size={20}
                    onPress={() => handleQuantityChange(item.id, false)}
                    mode="contained-tonal"
                  />
                  <Text 
                    variant="titleMedium" 
                    style={[styles.quantity, { color: theme.colors.onSurface }]}
                  >
                    {item.quantity}
                  </Text>
                  <IconButton
                    icon="plus"
                    size={20}
                    onPress={() => handleQuantityChange(item.id, true)}
                    mode="contained-tonal"
                  />
                </View>
              </View>
            </Surface>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <Surface 
          style={[styles.footer, { 
            backgroundColor: theme.colors.elevation.level2,
            paddingBottom: insets.bottom || 16 
          }]}
          elevation={4}
        >
          <View style={styles.totalContainer}>
            <Text 
              variant="titleLarge" 
              style={[styles.totalLabel, { color: theme.colors.onSurface }]}
            >
              Total Amount
            </Text>
            <Text 
              variant="headlineSmall" 
              style={[styles.totalAmount, { color: theme.colors.primary }]}
            >
              ${total.toFixed(2)}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Home' as never)}
              style={[styles.button, styles.continueButton]}
              contentStyle={styles.buttonContent}
            >
              Continue Shopping
            </Button>
            <Button
              mode="contained"
              onPress={() => setShowPaymentModal(true)}
              style={[styles.button, styles.checkoutButton]}
              contentStyle={styles.buttonContent}
            >
              Checkout & Pay
            </Button>
          </View>
        </Surface>
      )}

      <Portal>
        <PaperModal
          visible={showPaymentModal}
          onDismiss={() => setShowPaymentModal(false)}
          contentContainerStyle={[
            styles.modalContent, 
            { 
              backgroundColor: theme.colors.elevation.level3,
              paddingBottom: insets.bottom || 16 
            }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text 
              variant="titleLarge" 
              style={[styles.modalTitle, { color: theme.colors.onSurface }]}
            >
              Select Payment Method
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowPaymentModal(false)}
              iconColor={theme.colors.onSurfaceVariant}
            />
          </View>
          {paymentMethods.map((method) => (
            <Surface
              key={method.id}
              style={[styles.paymentOption, { backgroundColor: theme.colors.elevation.level1 }]}
              elevation={1}
            >
              <TouchableOpacity
                style={styles.paymentOptionContent}
                onPress={() => handleSelectPayment(method.id)}
              >
                <View style={styles.paymentLeft}>
                  <MaterialCommunityIcons
                    name={method.icon}
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text 
                    variant="titleMedium" 
                    style={[styles.paymentLabel, { color: theme.colors.onSurface }]}
                  >
                    {method.label}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={theme.colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </Surface>
          ))}
        </PaperModal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  emptyText: {
    marginVertical: 16,
  },
  shopButton: {
    marginTop: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    marginVertical: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantity: {
    marginHorizontal: 16,
  },
  footer: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentOption: {
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default CartScreen;

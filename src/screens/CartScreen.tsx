import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  Modal,
} from 'react-native';
import { Text, Surface, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

const COLORS = {
  primary: '#00B761',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  border: '#EEEEEE',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const CartScreen = () => {
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </Surface>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cart-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home' as never)}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => (
            <Surface key={item.id} style={styles.cartItemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveItem(item.id)}
                    style={styles.removeButton}
                  >
                    <MaterialCommunityIcons name="close" size={20} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <View style={styles.quantityContainer}>
                  <IconButton
                    icon="minus"
                    size={20}
                    onPress={() => handleQuantityChange(item.id, false)}
                    style={styles.quantityButton}
                  />
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <IconButton
                    icon="plus"
                    size={20}
                    onPress={() => handleQuantityChange(item.id, true)}
                    style={styles.quantityButton}
                  />
                </View>
              </View>
            </Surface>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <Surface style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
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

      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={[styles.modalContent, { paddingBottom: insets.bottom || 16 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowPaymentModal(false)}
              />
            </View>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.paymentOption}
                onPress={() => handleSelectPayment(method.id)}
              >
                <MaterialCommunityIcons
                  name={method.icon}
                  size={24}
                  color={COLORS.text}
                />
                <Text style={styles.paymentLabel}>{method.label}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            ))}
          </Surface>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: 16,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  shopButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '500',
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.background,
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
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    alignSelf: 'flex-start',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    margin: 0,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  footer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: COLORS.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  continueButton: {
    borderColor: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
  },
  buttonContent: {
    height: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  paymentLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
    flex: 1,
  },
});

export default CartScreen;

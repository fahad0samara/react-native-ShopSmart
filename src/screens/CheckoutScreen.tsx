import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING } from '../utils/constants';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { cartItems } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('OrderConfirmation');
    }, 2000);
  };

  if (isProcessing) {
    return (
      <View style={styles.processingContainer}>
        <LottieView
          source={require('../assets/animations/payment-processing.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.processingText}>Processing Payment...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: width < 380 ? SPACING.sm : SPACING.md },
        ]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TextInput
            mode="outlined"
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Phone"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <TextInput
            mode="outlined"
            label="Address"
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <TextInput
            mode="outlined"
            label="Card Number"
            value={formData.cardNumber}
            onChangeText={(value) => handleInputChange('cardNumber', value)}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Expiry Date"
              value={formData.expiryDate}
              onChangeText={(value) => handleInputChange('expiryDate', value)}
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
            />
            <TextInput
              mode="outlined"
              label="CVV"
              value={formData.cvv}
              onChangeText={(value) => handleInputChange('cvv', value)}
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>${totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Shipping</Text>
            <Text>$5.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>
              ${(totalAmount + 5).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleCheckout}
          style={styles.checkoutButton}
        >
          Place Order
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingVertical: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  input: {
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  orderSummary: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: '#fff',
  },
  checkoutButton: {
    width: '100%',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: 200,
    height: 200,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
});

export default CheckoutScreen;

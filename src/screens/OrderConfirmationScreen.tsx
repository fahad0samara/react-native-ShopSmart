import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import orderSuccessAnimation from '../assets/animations/order-success.json';
import { COLORS, SPACING } from '../utils/constants';

const OrderConfirmationScreen = () => {
  const navigation = useNavigation();
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LottieView
          source={orderSuccessAnimation}
          autoPlay
          loop={false}
          style={styles.animation}
        />
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.message}>
          Your order has been confirmed and will be delivered soon.
        </Text>
        <Text style={styles.orderNumber}>Order #123456</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={24}
              color={COLORS.primary}
            />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Estimated Delivery</Text>
              <Text style={styles.infoValue}>30-45 minutes</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={24}
              color={COLORS.primary}
            />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Delivery Address</Text>
              <Text style={styles.infoValue}>123 Main St, City</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  content: {
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  trackButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    width: '100%',
    marginBottom: SPACING.md,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
  },
  homeButton: {
    padding: SPACING.md,
    width: '100%',
  },
  homeButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OrderConfirmationScreen;

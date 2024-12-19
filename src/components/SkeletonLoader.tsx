import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
  borderRadius?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  style,
  borderRadius = 4,
}) => {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceVariant,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <SkeletonLoader height={150} style={styles.image} />
      <View style={styles.content}>
        <SkeletonLoader width={120} height={20} style={styles.title} />
        <SkeletonLoader width={80} height={16} style={styles.price} />
        <SkeletonLoader width={100} height={36} style={styles.button} />
      </View>
    </View>
  );
};

export const OrderCardSkeleton = () => {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <SkeletonLoader width={100} height={20} />
        <SkeletonLoader width={80} height={20} />
      </View>
      <View style={styles.orderItems}>
        <SkeletonLoader height={16} style={styles.orderItem} />
        <SkeletonLoader height={16} style={styles.orderItem} />
        <SkeletonLoader height={16} style={styles.orderItem} />
      </View>
      <View style={styles.orderFooter}>
        <SkeletonLoader width={120} height={20} />
        <SkeletonLoader width={100} height={36} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  card: {
    margin: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  price: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 18,
  },
  orderCard: {
    margin: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

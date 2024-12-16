import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { COLORS, SPACING } from '../utils/constants';
import { useApp } from '../context/AppContext';

interface PopularItemsProps {
  onAddToCart: (product: Product) => void;
}

const PopularItems: React.FC<PopularItemsProps> = ({ onAddToCart }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { products, isLoading } = useApp();

  const numColumns = width > 768 ? 4 : width > 480 ? 3 : 2;
  const itemWidth = (width - (SPACING.md * 2) - (SPACING.sm * (numColumns - 1))) / numColumns;

  const handleItemPress = (item: Product) => {
    navigation.navigate('ItemDetails', { item });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            onPress={() => handleItemPress(item)}
            onAddToCart={() => onAddToCart(item)}
            index={index}
            width={itemWidth}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        columnWrapperStyle={[
          styles.columnWrapper,
          { gap: SPACING.sm },
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  loadingContainer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: COLORS.primary,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.md,
  },
  listContent: {
    paddingBottom: SPACING.md,
  },
});

export default PopularItems;

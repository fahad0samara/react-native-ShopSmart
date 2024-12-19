import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data for wishlist items
const mockWishlistItems = [
  {
    id: '1',
    name: 'Fresh Apples',
    price: '$2.99',
    image: 'https://example.com/apple.jpg',
    description: 'Fresh and juicy apples from local farms',
  },
  {
    id: '2',
    name: 'Organic Bananas',
    price: '$3.99',
    image: 'https://example.com/banana.jpg',
    description: 'Organic bananas perfect for smoothies',
  },
  // Add more mock items as needed
];

const WishlistScreen = () => {
  const theme = useTheme();

  const renderWishlistItem = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Title
        title={item.name}
        subtitle={item.price}
        right={(props) => (
          <MaterialCommunityIcons
            {...props}
            name="heart"
            size={24}
            color={theme.colors.error}
            onPress={() => {/* Handle remove from wishlist */}}
          />
        )}
      />
      <Card.Content>
        <Text variant="bodyMedium">{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => {/* Handle add to cart */}}
        >
          Add to Cart
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {mockWishlistItems.length > 0 ? (
        <FlatList
          data={mockWishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="heart-outline"
            size={64}
            color={theme.colors.secondary}
          />
          <Text variant="headlineSmall" style={styles.emptyText}>
            Your wishlist is empty
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Save items you love by tapping the heart icon
          </Text>
          <Button
            mode="contained"
            onPress={() => {/* Navigate to home or categories */}}
            style={styles.browseButton}
          >
            Browse Products
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  browseButton: {
    marginTop: 24,
  },
});

export default WishlistScreen;

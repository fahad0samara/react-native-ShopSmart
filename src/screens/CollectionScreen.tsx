import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text as RNText } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CollectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { collection } = route.params as { collection: any };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <RNText style={styles.headerTitle}>{collection.name}</RNText>
        <View style={{ width: 24 }} />
      </View>

      <Image
        source={collection.image}
        style={styles.collectionImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.collectionInfo}>
          <RNText style={styles.collectionName}>{collection.name}</RNText>
          <RNText style={styles.itemCount}>{collection.itemCount} items</RNText>
        </View>

        <RNText style={styles.description}>
          Explore our curated collection of premium products.
        </RNText>

        {/* Add your collection products here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  collectionImage: {
    width: '100%',
    height: 200,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  collectionInfo: {
    marginBottom: 16,
  },
  collectionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
});

export default CollectionScreen;

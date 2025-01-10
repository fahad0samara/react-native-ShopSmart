import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text as RNText } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { category } = route.params as { category: any };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <RNText style={styles.headerTitle}>{category.name}</RNText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <RNText style={styles.sectionTitle}>Products</RNText>
        {/* Add your category products here */}
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
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
});

export default CategoryScreen;

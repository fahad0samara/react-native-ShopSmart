import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text as RNText } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FiltersScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    'Electronics',
    'Fashion',
    'Home',
    'Beauty',
    'Sports',
    'Books',
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'newest', label: 'Newest First' },
    { id: 'price_low', label: 'Price: Low to High' },
    { id: 'price_high', label: 'Price: High to Low' },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="close"
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <RNText style={styles.headerTitle}>Filters</RNText>
        <TouchableOpacity onPress={() => {
          setSelectedCategories([]);
          setPriceRange([0, 1000]);
          setSortBy('popular');
        }}>
          <RNText style={styles.resetText}>Reset</RNText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>Categories</RNText>
          <View style={styles.categoriesContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategories.includes(category) && styles.categoryChipSelected,
                ]}
                onPress={() => toggleCategory(category)}
              >
                <RNText
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(category) && styles.categoryTextSelected,
                  ]}
                >
                  {category}
                </RNText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>Sort By</RNText>
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.sortOption}
              onPress={() => setSortBy(option.id)}
            >
              <RNText style={styles.sortOptionText}>{option.label}</RNText>
              {sortBy === option.id && (
                <MaterialCommunityIcons name="check" size={24} color="#000" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.goBack()}
        >
          <RNText style={styles.applyButtonText}>Apply Filters</RNText>
        </TouchableOpacity>
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
  resetText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  sortOptionText: {
    fontSize: 16,
    color: '#000',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FiltersScreen;

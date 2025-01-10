import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { getCategories } from '../services/api';
import { Category } from '../types';

const CategoryList = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const getIconName = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      Snacks: 'food',
      Breakfast: 'food-croissant',
      Canned: 'food-variant',
      Sauce: 'sauce',
      Drinks: 'cup',
      Fish: 'fish',
      Meat: 'food-steak',
      Vegetables: 'food-apple',
    };
    return iconMap[categoryName] || 'food';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Categories</Text>
        <TouchableOpacity>
          <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryItem}>
            <View style={[
              styles.iconContainer, 
              { 
                backgroundColor: theme.dark ? theme.colors.elevation.level2 : theme.colors.surfaceVariant,
                borderColor: theme.colors.outline,
              }
            ]}>
              <MaterialCommunityIcons 
                name={getIconName(category.name)} 
                size={24} 
                color={theme.colors.primary}
              />
            </View>
            <Text style={[styles.categoryName, { color: theme.colors.onSurface }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
  },
  scrollView: {
    paddingLeft: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CategoryList;

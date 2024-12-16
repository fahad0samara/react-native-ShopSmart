import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  IconButton,
  Checkbox,
  Button,
  useTheme,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { PRODUCTS } from '../data/products';

const { width } = Dimensions.get('window');

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  completed: boolean;
  note?: string;
  category?: string;
  productId?: string;
}

const ShoppingListScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemNote, setNewItemNote] = useState('');
  const [suggestions, setSuggestions] = useState<typeof PRODUCTS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addItem = () => {
    if (newItemName.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newItem: ShoppingListItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        quantity: parseInt(newItemQuantity) || 1,
        unit: newItemUnit.trim(),
        completed: false,
        note: newItemNote.trim(),
      };
      setItems([newItem, ...items]);
      setNewItemName('');
      setNewItemQuantity('1');
      setNewItemUnit('');
      setNewItemNote('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const toggleItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, increment: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + (increment ? 1 : -1)),
            }
          : item
      )
    );
  };

  const handleSearch = (text: string) => {
    setNewItemName(text);
    if (text.length > 1) {
      const filtered = PRODUCTS.filter(
        (product) =>
          product.name.toLowerCase().includes(text.toLowerCase()) ||
          product.description.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (product: typeof PRODUCTS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNewItemName(product.name);
    setNewItemUnit(product.unit || '');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.headerTitle}>Shopping List</Text>
      <View style={styles.addItemContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.itemNameInput}
            placeholder="Add item..."
            value={newItemName}
            onChangeText={handleSearch}
            right={
              <TextInput.Icon
                icon="plus-circle"
                onPress={addItem}
                disabled={!newItemName.trim()}
              />
            }
          />
        </View>
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.suggestionItem}
                onPress={() => selectSuggestion(product)}
              >
                <Text>{product.name}</Text>
                <Text style={styles.suggestionPrice}>
                  ${product.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.quantityInput}
            placeholder="Qty"
            value={newItemQuantity}
            onChangeText={setNewItemQuantity}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.unitInput}
            placeholder="Unit"
            value={newItemUnit}
            onChangeText={setNewItemUnit}
          />
        </View>
        <TextInput
          style={styles.noteInput}
          placeholder="Add note (optional)"
          value={newItemNote}
          onChangeText={setNewItemNote}
        />
      </View>
    </View>
  );

  const renderItem = (item: ShoppingListItem) => (
    <View key={item.id} style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleItem(item.id)}
        />
        <View>
          <Text
            style={[
              styles.itemName,
              item.completed && styles.completedItemName,
            ]}
          >
            {item.name}
          </Text>
          {item.note && (
            <Text style={styles.itemNote}>{item.note}</Text>
          )}
        </View>
      </View>
      <View style={styles.itemRight}>
        <View style={styles.quantityContainer}>
          <IconButton
            icon="minus"
            size={20}
            onPress={() => updateQuantity(item.id, false)}
          />
          <Text style={styles.quantity}>
            {item.quantity} {item.unit}
          </Text>
          <IconButton
            icon="plus"
            size={20}
            onPress={() => updateQuantity(item.id, true)}
          />
        </View>
        <IconButton
          icon="delete-outline"
          size={20}
          onPress={() => removeItem(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      <ScrollView style={styles.list}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={48}
              color={COLORS.textLight}
            />
            <Text style={styles.emptyText}>
              Your shopping list is empty
            </Text>
            <Text style={styles.emptySubtext}>
              Add items to get started
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                {items.filter((item) => !item.completed).length} items remaining
              </Text>
              {items.some((item) => item.completed) && (
                <Button
                  onPress={() => {
                    Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Medium
                    );
                    setItems(items.filter((item) => !item.completed));
                  }}
                >
                  Clear completed
                </Button>
              )}
            </View>
            {items.map(renderItem)}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: SPACING.sm,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: SPACING.sm,
  },
  addItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  itemNameInput: {
    flex: 1,
    backgroundColor: '#fff',
  },
  quantityInput: {
    flex: 1,
    backgroundColor: '#fff',
  },
  unitInput: {
    flex: 2,
    backgroundColor: '#fff',
  },
  noteInput: {
    backgroundColor: '#fff',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: SPACING.xs,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionPrice: {
    color: COLORS.textLight,
  },
  list: {
    flex: 1,
    padding: SPACING.sm,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginLeft: SPACING.xs,
  },
  completedItemName: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  itemNote: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    minWidth: 40,
    textAlign: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryText: {
    color: COLORS.textLight,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});

export default ShoppingListScreen;

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme, IconButton, FAB, Portal, Modal, TextInput, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/constants';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const AddressScreen = () => {
  const theme = useTheme();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Office',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });

  const handleAddAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
    };
    setAddresses([...addresses, newAddress]);
    setShowAddModal(false);
    resetForm();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleEditAddress = () => {
    if (editingAddress) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...addr, ...formData } : addr
        )
      );
      setEditingAddress(null);
      resetForm();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetForm = () => {
    setFormData({
      label: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    });
  };

  const renderAddressCard = (address: Address) => (
    <View key={address.id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons
            name={address.label.toLowerCase() === 'home' ? 'home' : 'office-building'}
            size={24}
            color={theme.colors.primary}
          />
          <Text style={[styles.addressLabel, { color: theme.colors.onSurface }]}>
            {address.label}
          </Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.actionButtons}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => {
              setEditingAddress(address);
              setFormData({
                label: address.label,
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
                isDefault: address.isDefault,
              });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
          {!address.isDefault && (
            <IconButton
              icon="delete"
              size={20}
              iconColor={theme.colors.error}
              onPress={() => handleDeleteAddress(address.id)}
            />
          )}
        </View>
      </View>
      <View style={styles.addressDetails}>
        <Text style={[styles.addressText, { color: theme.colors.onSurface }]}>
          {address.street}
        </Text>
        <Text style={[styles.addressText, { color: theme.colors.onSurface }]}>
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text style={[styles.addressText, { color: theme.colors.onSurface }]}>
          {address.country}
        </Text>
      </View>
      {!address.isDefault && (
        <Button
          mode="outlined"
          onPress={() => setDefaultAddress(address.id)}
          style={styles.setDefaultButton}
        >
          Set as Default
        </Button>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.elevation.level2 }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Delivery Addresses</Text>
        </Surface>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {addresses.map(renderAddressCard)}
        </ScrollView>

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            setShowAddModal(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />

        <Portal>
          <Modal
            visible={showAddModal || editingAddress !== null}
            onDismiss={() => {
              setShowAddModal(false);
              setEditingAddress(null);
              resetForm();
            }}
            contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.elevation.level3 }]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </Text>
            <TextInput
              label="Label (e.g., Home, Office)"
              value={formData.label}
              onChangeText={(text) => setFormData({ ...formData, label: text })}
              style={styles.input}
              mode="outlined"
              theme={theme}
            />
            <TextInput
              label="Street Address"
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
              style={styles.input}
              mode="outlined"
              theme={theme}
            />
            <TextInput
              label="City"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              style={styles.input}
              mode="outlined"
              theme={theme}
            />
            <TextInput
              label="State"
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              style={styles.input}
              mode="outlined"
              theme={theme}
            />
            <TextInput
              label="ZIP Code"
              value={formData.zipCode}
              onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
              style={styles.input}
              mode="outlined"
              theme={theme}
              keyboardType="number-pad"
            />
            <TextInput
              label="Country"
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              style={styles.input}
              mode="outlined"
              theme={theme}
            />
            <Button
              mode="contained"
              onPress={editingAddress ? handleEditAddress : handleAddAddress}
              style={styles.modalButton}
            >
              {editingAddress ? 'Save Changes' : 'Add Address'}
            </Button>
          </Modal>
        </Portal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  addressDetails: {
    marginBottom: 12,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 4,
  },
  setDefaultButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modal: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default AddressScreen;

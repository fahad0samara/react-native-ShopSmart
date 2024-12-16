import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme, IconButton, FAB, Portal, Modal, TextInput, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/constants';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

const PaymentMethodsScreen = () => {
  const theme = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit',
      cardNumber: '**** **** **** 1234',
      cardHolder: 'John Doe',
      expiryDate: '12/24',
      isDefault: true,
    },
    {
      id: '2',
      type: 'debit',
      cardNumber: '**** **** **** 5678',
      cardHolder: 'John Doe',
      expiryDate: '06/25',
      isDefault: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Omit<PaymentMethod, 'id'>>({
    type: 'credit',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    isDefault: false,
  });

  const handleAddCard = () => {
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      ...formData,
    };
    setPaymentMethods([...paymentMethods, newCard]);
    setShowAddModal(false);
    resetForm();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleEditCard = () => {
    if (editingCard) {
      setPaymentMethods(
        paymentMethods.map((card) =>
          card.id === editingCard.id ? { ...card, ...formData } : card
        )
      );
      setEditingCard(null);
      resetForm();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter((card) => card.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const setDefaultCard = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((card) => ({
        ...card,
        isDefault: card.id === id,
      }))
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetForm = () => {
    setFormData({
      type: 'credit',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      isDefault: false,
    });
  };

  const getCardIcon = (type: 'credit' | 'debit') => {
    return type === 'credit' ? 'credit-card' : 'credit-card-outline';
  };

  const renderCard = (card: PaymentMethod) => (
    <View key={card.id} style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTypeContainer}>
          <MaterialCommunityIcons
            name={getCardIcon(card.type)}
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.cardType}>
            {card.type.charAt(0).toUpperCase() + card.type.slice(1)} Card
          </Text>
          {card.isDefault && (
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
              setEditingCard(card);
              setFormData({
                type: card.type,
                cardNumber: card.cardNumber,
                cardHolder: card.cardHolder,
                expiryDate: card.expiryDate,
                isDefault: card.isDefault,
              });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
          {!card.isDefault && (
            <IconButton
              icon="delete"
              size={20}
              iconColor={theme.colors.error}
              onPress={() => handleDeleteCard(card.id)}
            />
          )}
        </View>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardNumber}>{card.cardNumber}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardInfoText}>{card.cardHolder}</Text>
          <Text style={styles.cardInfoText}>Expires: {card.expiryDate}</Text>
        </View>
      </View>
      {!card.isDefault && (
        <Button
          mode="outlined"
          onPress={() => setDefaultCard(card.id)}
          style={styles.setDefaultButton}
        >
          Set as Default
        </Button>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment Methods</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {paymentMethods.map(renderCard)}
        </ScrollView>

        <Portal>
          <Modal
            visible={showAddModal || editingCard !== null}
            onDismiss={() => {
              setShowAddModal(false);
              setEditingCard(null);
              resetForm();
            }}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>
              {editingCard ? 'Edit Card' : 'Add New Card'}
            </Text>
            <View style={styles.cardTypeSwitch}>
              <Text>Card Type:</Text>
              <Switch
                value={formData.type === 'credit'}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value ? 'credit' : 'debit' })
                }
              />
              <Text>{formData.type === 'credit' ? 'Credit' : 'Debit'}</Text>
            </View>
            <TextInput
              label="Card Number"
              value={formData.cardNumber}
              onChangeText={(text) => setFormData({ ...formData, cardNumber: text })}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
            />
            <TextInput
              label="Card Holder Name"
              value={formData.cardHolder}
              onChangeText={(text) => setFormData({ ...formData, cardHolder: text })}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Expiry Date (MM/YY)"
              value={formData.expiryDate}
              onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
              style={styles.input}
              mode="outlined"
            />
            <Button
              mode="contained"
              onPress={editingCard ? handleEditCard : handleAddCard}
              style={styles.modalButton}
            >
              {editingCard ? 'Save Changes' : 'Add Card'}
            </Button>
          </Modal>
        </Portal>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            setShowAddModal(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
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
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
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
  cardDetails: {
    marginBottom: 12,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfoText: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardTypeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default PaymentMethodsScreen;

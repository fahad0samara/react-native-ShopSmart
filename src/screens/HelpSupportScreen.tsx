import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  Text,
  List,
  useTheme,
  Button,
  Portal,
  Modal,
  TextInput,
  Searchbar,
  Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/constants';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const HelpSupportScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I track my order?',
      answer:
        'You can track your order by going to the Orders section in your profile. Click on the specific order to view its current status and tracking information.',
      category: 'Orders',
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer:
        'We accept various payment methods including credit/debit cards, PayPal, and Apple Pay. You can manage your payment methods in the Payment Methods section.',
      category: 'Payments',
    },
    {
      id: '3',
      question: 'How do I return an item?',
      answer:
        'To return an item, go to your Orders section, select the order containing the item you want to return, and click on "Return Item". Follow the instructions to complete the return process.',
      category: 'Returns',
    },
    {
      id: '4',
      question: 'How do I change my delivery address?',
      answer:
        'You can change your delivery address by going to the Address Book section in your profile. Add a new address or edit existing ones, and set your preferred default address.',
      category: 'Delivery',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSendMessage = () => {
    // Add message sending logic here
    setShowContactModal(false);
    setMessage('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Searchbar
            placeholder="Search FAQs..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchBar}
          />

          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => setShowContactModal(true)}
                style={styles.actionButton}
                icon="email"
              >
                Contact Support
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  // Add live chat logic
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={styles.actionButton}
                icon="chat"
              >
                Live Chat
              </Button>
            </View>
          </View>

          <View style={styles.faqSection}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {filteredFAQs.map((faq) => (
              <Card
                key={faq.id}
                style={styles.faqCard}
                onPress={() => toggleFAQ(faq.id)}
              >
                <Card.Content>
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <MaterialCommunityIcons
                      name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>
                  {expandedFAQ === faq.id && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{faq.category}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <List.Item
              title="Customer Support"
              description="Available 24/7"
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="headphones"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
              right={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="phone"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
              onPress={() => {
                // Add phone call logic
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <List.Item
              title="Email Support"
              description="support@example.com"
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="email"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
              onPress={() => {
                // Add email logic
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          </View>
        </ScrollView>

        <Portal>
          <Modal
            visible={showContactModal}
            onDismiss={() => setShowContactModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Contact Support</Text>
            <TextInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              style={styles.messageInput}
              mode="outlined"
            />
            <Button
              mode="contained"
              onPress={handleSendMessage}
              style={styles.modalButton}
            >
              Send Message
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
  searchBar: {
    marginBottom: 16,
    elevation: 0,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  faqSection: {
    marginBottom: 24,
  },
  faqCard: {
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  faqAnswer: {
    marginTop: 8,
    color: '#666',
  },
  categoryBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  contactInfo: {
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
  messageInput: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default HelpSupportScreen;

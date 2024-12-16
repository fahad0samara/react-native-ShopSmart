import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, Switch, List, useTheme, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/constants';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  type: string;
  enabled: boolean;
  icon: string;
}

const NotificationsScreen = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Order Updates',
      description: 'Get notified about your order status',
      type: 'order',
      enabled: true,
      icon: 'package-variant',
    },
    {
      id: '2',
      title: 'Promotions',
      description: 'Receive special offers and discounts',
      type: 'promo',
      enabled: true,
      icon: 'tag',
    },
    {
      id: '3',
      title: 'Price Alerts',
      description: 'Get notified when items in your wishlist go on sale',
      type: 'price',
      enabled: true,
      icon: 'bell-ring',
    },
    {
      id: '4',
      title: 'New Products',
      description: 'Be the first to know about new products',
      type: 'product',
      enabled: false,
      icon: 'new-box',
    },
    {
      id: '5',
      title: 'Delivery Updates',
      description: 'Track your delivery in real-time',
      type: 'delivery',
      enabled: true,
      icon: 'truck-delivery',
    },
    {
      id: '6',
      title: 'Stock Alerts',
      description: 'Get notified when out-of-stock items are available',
      type: 'stock',
      enabled: true,
      icon: 'store',
    },
  ]);

  const [masterToggle, setMasterToggle] = useState(true);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) => {
        if (setting.id === id) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          return { ...setting, enabled: !setting.enabled };
        }
        return setting;
      })
    );
  };

  const toggleAll = () => {
    const newState = !masterToggle;
    setMasterToggle(newState);
    setSettings(
      settings.map((setting) => ({
        ...setting,
        enabled: newState,
      }))
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderNotificationGroup = (type: string) => {
    const groupSettings = settings.filter((setting) => setting.type === type);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Notifications
        </Text>
        {groupSettings.map((setting) => (
          <List.Item
            key={setting.id}
            title={setting.title}
            description={setting.description}
            left={(props) => (
              <MaterialCommunityIcons
                {...props}
                name={setting.icon}
                size={24}
                color={theme.colors.primary}
                style={styles.icon}
              />
            )}
            right={() => (
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                color={theme.colors.primary}
              />
            )}
            style={styles.listItem}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Switch
            value={masterToggle}
            onValueChange={toggleAll}
            color={theme.colors.primary}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Notification Summary</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Active Notifications</Text>
                <Text style={styles.summaryValue}>
                  {settings.filter((s) => s.enabled).length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Inactive Notifications</Text>
                <Text style={styles.summaryValue}>
                  {settings.filter((s) => !s.enabled).length}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsContainer}>
            {renderNotificationGroup('order')}
            {renderNotificationGroup('promo')}
            {renderNotificationGroup('delivery')}
          </View>

          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>Quiet Hours</Text>
            <Text style={styles.scheduleDescription}>
              During quiet hours, you won't receive any notifications except for critical
              updates about your orders.
            </Text>
            <Button
              mode="outlined"
              onPress={() => {
                // Add quiet hours setup logic
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={styles.scheduleButton}
            >
              Set Quiet Hours
            </Button>
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listItem: {
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  scheduleCard: {
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
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  scheduleButton: {
    marginTop: 8,
  },
});

export default NotificationsScreen;

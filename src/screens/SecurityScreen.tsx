import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, Switch, List, useTheme, Button, Portal, Modal, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/constants';

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: string;
}

const SecurityScreen = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState<SecuritySetting[]>([
    {
      id: '1',
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face ID to login',
      enabled: true,
      icon: 'fingerprint',
    },
    {
      id: '2',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      enabled: false,
      icon: 'shield-lock',
    },
    {
      id: '3',
      title: 'Remember Me',
      description: 'Stay logged in on this device',
      enabled: true,
      icon: 'account-check',
    },
    {
      id: '4',
      title: 'App Lock',
      description: 'Require authentication when opening the app',
      enabled: false,
      icon: 'lock',
    },
  ]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleSetting = (id: string) => {
    if (id === '2') {
      // Two-Factor Authentication
      setShowTwoFactorModal(true);
      return;
    }

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

  const handlePasswordChange = () => {
    // Add password change logic here
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleTwoFactorSetup = () => {
    // Add two-factor setup logic here
    setShowTwoFactorModal(false);
    setSettings(
      settings.map((setting) => {
        if (setting.id === '2') {
          return { ...setting, enabled: true };
        }
        return setting;
      })
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Security</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.securityScore}>
            <Text style={styles.scoreTitle}>Security Score</Text>
            <View style={styles.scoreContainer}>
              <View style={[styles.scoreBar, { width: '75%' }]} />
              <Text style={styles.scoreText}>75%</Text>
            </View>
            <Text style={styles.scoreHint}>
              Enable two-factor authentication to improve your security score
            </Text>
          </View>

          <View style={styles.settingsContainer}>
            {settings.map((setting) => (
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

          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              onPress={() => setShowPasswordModal(true)}
              style={styles.actionButton}
              icon="key"
            >
              Change Password
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                // Add logout from all devices logic
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              style={styles.actionButton}
              icon="logout"
            >
              Logout from All Devices
            </Button>
          </View>

          <View style={styles.recentActivity}>
            <Text style={styles.activityTitle}>Recent Activity</Text>
            <List.Item
              title="Password Changed"
              description="2 days ago • New York, USA"
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="key-change"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
            />
            <List.Item
              title="New Login"
              description="5 days ago • London, UK"
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="login"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
            />
          </View>
        </ScrollView>

        <Portal>
          <Modal
            visible={showPasswordModal}
            onDismiss={() => setShowPasswordModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />
            <Button
              mode="contained"
              onPress={handlePasswordChange}
              style={styles.modalButton}
            >
              Change Password
            </Button>
          </Modal>

          <Modal
            visible={showTwoFactorModal}
            onDismiss={() => setShowTwoFactorModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Setup Two-Factor Authentication</Text>
            <Text style={styles.modalDescription}>
              Two-factor authentication adds an extra layer of security to your account.
              We'll send you a verification code via SMS when you sign in.
            </Text>
            <TextInput
              label="Phone Number"
              keyboardType="phone-pad"
              style={styles.input}
              mode="outlined"
            />
            <Button
              mode="contained"
              onPress={handleTwoFactorSetup}
              style={styles.modalButton}
            >
              Enable Two-Factor Authentication
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
  securityScore: {
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
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scoreContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
    position: 'relative',
  },
  scoreBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  scoreText: {
    position: 'absolute',
    right: 0,
    top: -20,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scoreHint: {
    fontSize: 14,
    color: '#666',
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
  listItem: {
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  recentActivity: {
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
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default SecurityScreen;

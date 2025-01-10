import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, Switch, List, useTheme, Button, Portal, Modal, TextInput, Surface, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: string;
}

const SecurityScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <View style={styles.container}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.elevation.level2 }]}>
          <View style={styles.headerTop}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <Text variant="headlineMedium" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
              Security
            </Text>
          </View>
        </Surface>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Surface style={[styles.securityScore, { backgroundColor: theme.colors.elevation.level1 }]}>
            <Text style={[styles.scoreTitle, { color: theme.colors.onSurface }]}>Security Score</Text>
            <View style={styles.scoreContainer}>
              <View style={[styles.scoreBar, { width: '75%', backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.scoreText, { color: theme.colors.onSurface }]}>75%</Text>
            </View>
            <Text style={[styles.scoreHint, { color: theme.colors.onSurfaceVariant }]}>
              Enable two-factor authentication to improve your security score
            </Text>
          </Surface>

          <Surface style={[styles.settingsContainer, { backgroundColor: theme.colors.elevation.level1 }]}>
            {settings.map((setting) => (
              <List.Item
                key={setting.id}
                title={setting.title}
                description={setting.description}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
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
          </Surface>

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

          <Surface style={[styles.recentActivity, { backgroundColor: theme.colors.elevation.level1 }]}>
            <Text style={[styles.activityTitle, { color: theme.colors.onSurface }]}>Recent Activity</Text>
            <List.Item
              title="Password Changed"
              description="2 days ago • New York, USA"
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
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
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              left={(props) => (
                <MaterialCommunityIcons
                  {...props}
                  name="login"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
            />
          </Surface>
        </ScrollView>

        <Portal>
          <Modal
            visible={showPasswordModal}
            onDismiss={() => setShowPasswordModal(false)}
            contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.elevation.level3 }]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Change Password</Text>
            <TextInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={[styles.input, { backgroundColor: theme.colors.elevation.level1 }]}
              textColor={theme.colors.onSurface}
              mode="outlined"
            />
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={[styles.input, { backgroundColor: theme.colors.elevation.level1 }]}
              textColor={theme.colors.onSurface}
              mode="outlined"
            />
            <TextInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={[styles.input, { backgroundColor: theme.colors.elevation.level1 }]}
              textColor={theme.colors.onSurface}
              mode="outlined"
            />
            <View style={styles.modalActions}>
              <Button mode="contained" onPress={handlePasswordChange}>
                Update Password
              </Button>
              <Button mode="outlined" onPress={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
            </View>
          </Modal>

          <Modal
            visible={showTwoFactorModal}
            onDismiss={() => setShowTwoFactorModal(false)}
            contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.elevation.level3 }]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Setup Two-Factor Authentication</Text>
            <Text style={[styles.modalText, { color: theme.colors.onSurfaceVariant }]}>
              Two-factor authentication adds an extra layer of security to your account. We'll send a verification code to your email or phone number when you sign in.
            </Text>
            <View style={styles.modalActions}>
              <Button mode="contained" onPress={handleTwoFactorSetup}>
                Enable
              </Button>
              <Button mode="outlined" onPress={() => setShowTwoFactorModal(false)}>
                Cancel
              </Button>
            </View>
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
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  securityScore: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreContainer: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginBottom: 8,
    position: 'relative',
  },
  scoreBar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  scoreHint: {
    fontSize: 14,
    marginTop: 8,
  },
  settingsContainer: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  recentActivity: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  modalText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default SecurityScreen;

import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Button, Avatar, Modal, TextInput, Badge, Chip, Divider, Switch, IconButton, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../utils/theme';
import { auth } from '../config/firebase';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

const ProfileScreen = () => {
  const { logout, user } = useAuth();
  const { theme } = useAppTheme();

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.photoURL || 'https://i.pravatar.cc/300');

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    theme.toggleTheme();
  };

  const handleThemeModeChange = (mode: 'light' | 'dark' | 'system') => {
    theme.setThemeMode(mode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowThemeModal(false);
  };

  // Add animated values for stats
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    // Start with initial values
    scale.value = 0.3;
    opacity.value = 0;
    translateY.value = 50;

    // Animate to final values
    scale.value = withSpring(1, { mass: 0.5, damping: 15 });
    opacity.value = withTiming(1, { duration: 800 });
    translateY.value = withSpring(0, { mass: 0.5, damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
      opacity: opacity.value,
    };
  });

  const stats = [
    { 
      label: 'Orders', 
      value: user?.stats?.ordersCompleted,
      icon: 'package-variant',
      onPress: () => navigation.navigate('Orders'),
      color: theme.colors.primary
    },
    { 
      label: 'Reviews', 
      value: user?.stats?.reviewsGiven,
      icon: 'star',
      onPress: () => navigation.navigate('Reviews'),
      color: '#FFD700'
    },
    { 
      label: 'Wishlist', 
      value: user?.stats?.wishlistItems,
      icon: 'heart',
      onPress: () => navigation.navigate('MyDetails'),
      color: '#FF69B4'
    },
  ];

  // Navigation menu items
  const navigationItems = [
    {
      title: 'My Orders',
      icon: 'package-variant',
      onPress: () => navigation.navigate('Orders'),
      badge: user?.stats?.ordersInProgress?.toString() || '0',
    },
    {
      title: 'My Addresses',
      icon: 'map-marker',
      onPress: () => navigation.navigate('Address'),
      badge: user?.addresses?.length?.toString() || '0',
    },
    {
      title: 'Payment Methods',
      icon: 'credit-card',
      onPress: () => navigation.navigate('PaymentMethods'),
      badge: user?.paymentMethods?.length?.toString() || '0',
    },
    {
      title: 'My Reviews',
      icon: 'star',
      onPress: () => navigation.navigate('Reviews'),
      badge: user?.stats?.reviewsGiven?.toString() || '0',
    },
    {
      title: 'Security',
      icon: 'shield-check',
      onPress: () => navigation.navigate('Security'),
    },
    {
      title: 'Account Details',
      icon: 'account-details',
      onPress: () => navigation.navigate('Details'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      title: 'Settings',
      icon: 'cog',
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  // Settings menu items
  const settingsItems = [
    {
      title: 'Theme',
      icon: theme.dark ? 'weather-night' : 'white-balance-sunny',
      onPress: () => setShowThemeModal(true),
      rightContent: () => (
        <View style={styles.themeIndicator}>
          <MaterialCommunityIcons 
            name={theme.dark ? 'weather-night' : 'white-balance-sunny'} 
            size={20} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.themeText, { color: theme.colors.onBackground }]}>
            {theme.themeMode.charAt(0).toUpperCase() + theme.themeMode.slice(1)}
          </Text>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color={theme.colors.onBackground} 
          />
        </View>
      ),
    },
    {
      title: 'Push Notifications',
      icon: 'bell-ring',
      isSwitch: true,
      value: notificationsEnabled,
      onValueChange: () => {
        setNotificationsEnabled(!notificationsEnabled);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    },
    {
      title: 'Biometric Login',
      icon: 'fingerprint',
      isSwitch: true,
      value: biometricEnabled,
      onValueChange: () => {
        setBiometricEnabled(!biometricEnabled);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleLogout = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await logout();
      // Navigation will be handled by the auth state listener
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const handleMenuItemPress = (onPress) => {
    if (onPress) {
      onPress();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const scrollY = useSharedValue(0);
  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 200],
            [0, -100],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      <Card style={styles.header}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Text 
            size={80} 
            label={user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : '??'} 
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onSurface }]}>
              {user?.displayName || 'User'}
            </Text>
            <Text variant="bodyMedium" style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
              {user?.email || 'No email'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Stats Section */}
        <View style={[styles.statsContainer, { 
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 15,
          paddingHorizontal: 16,
          marginHorizontal: 16,
          marginBottom: 20,
          borderRadius: 12,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { 
              fontSize: 20,
              fontWeight: 'bold',
              marginVertical: 4,
            }]}>
              {user?.stats?.orders || '0'}
            </Text>
            <Text style={[styles.statLabel, { 
              fontSize: 12,
              opacity: 0.7,
            }]}>
              Orders
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { 
              fontSize: 20,
              fontWeight: 'bold',
              marginVertical: 4,
            }]}>
              {user?.stats?.reviews || '0'}
            </Text>
            <Text style={[styles.statLabel, { 
              fontSize: 12,
              opacity: 0.7,
            }]}>
              Reviews
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { 
              fontSize: 20,
              fontWeight: 'bold',
              marginVertical: 4,
            }]}>
              {user?.stats?.points || '0'}
            </Text>
            <Text style={[styles.statLabel, { 
              fontSize: 12,
              opacity: 0.7,
            }]}>
              Points
            </Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={[styles.menuTitle, { 
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 12,
            marginLeft: 4,
          }]}>Account</Text>
          {navigationItems.map((item, index) => (
            <TouchableOpacity 
              key={item.title} 
              style={[styles.menuItem, { 
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                marginBottom: index === navigationItems.length - 1 ? 20 : 8,
              }]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.menuItemText, { 
                  fontSize: 16,
                  marginLeft: 12,
                  flex: 1,
                  fontWeight: '500',
                }]}>
                  {item.title}
                </Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <Badge style={styles.badge}>
                    {item.badge}
                  </Badge>
                )}
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={24} 
                  color={theme.colors.onSurfaceVariant} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={[styles.button, styles.logoutButton]}
            contentStyle={styles.buttonContent}
            onPress={handleLogout}
          >
            Logout
          </Button>
          <Button
            mode="outlined"
            style={[styles.button, styles.deleteButton]}
            contentStyle={styles.buttonContent}
            textColor={theme.colors.error}
            onPress={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </View>
      </Animated.ScrollView>

      <Modal
        visible={isEditing}
        onDismiss={() => setIsEditing(false)}
        contentContainerStyle={styles.editContainer}
      >
        <Text style={[styles.modalTitle, { 
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
        }]}>
          Edit Profile
        </Text>
        <TextInput
          label="Name"
          value={editedName}
          onChangeText={setEditedName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Email"
          value={editedEmail}
          onChangeText={setEditedEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.editButtons}>
          <Button
            mode="outlined"
            onPress={() => setIsEditing(false)}
            style={{ flex: 1, marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSaveProfile}
            style={{ flex: 1, marginLeft: 8 }}
          >
            Save
          </Button>
        </View>
      </Modal>

      <Modal
        visible={showThemeModal}
        onDismiss={() => setShowThemeModal(false)}
        contentContainerStyle={styles.themeModalContainer}
      >
        <Text style={[styles.themeModalTitle, { 
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
        }]}>
          Select Theme
        </Text>
        <View style={styles.themeOptions}>
          <TouchableOpacity 
            style={styles.themeOption}
            onPress={() => handleThemeModeChange('light')}
          >
            <MaterialCommunityIcons 
              name="white-balance-sunny" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={styles.themeOptionText}>
              Light
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.themeOption}
            onPress={() => handleThemeModeChange('dark')}
          >
            <MaterialCommunityIcons 
              name="weather-night" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={styles.themeOptionText}>
              Dark
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.themeOption}
            onPress={() => handleThemeModeChange('system')}
          >
            <MaterialCommunityIcons 
              name="cellphone-settings" 
              size={24} 
              color={theme.colors.primary} 
            />
            <Text style={styles.themeOptionText}>
              System Default
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 180,
    paddingBottom: 32,
  },
  gradient: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  header: {
    margin: 16,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  menuSection: {
    marginTop: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    marginRight: 8,
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  button: {
    marginVertical: 6,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  editContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  themeModalContainer: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  themeModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  themeOptions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  themeOptionText: {
    fontSize: 14,
    marginLeft: 12,
  },
  themeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default ProfileScreen;

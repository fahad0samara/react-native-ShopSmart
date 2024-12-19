import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Linking } from 'react-native';
import { Text, Button, Avatar, Switch, Divider, Portal, Modal, TextInput, useTheme, IconButton, Badge, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/constants';
import { ProfileStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const theme = useTheme();
  const { logout } = useAuth();
  
  const [editMode, setEditMode] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/300');
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Green Street, New York, NY 10001',
    memberSince: 'Jan 2024',
    preferences: {
      diet: ['Vegetarian', 'Organic'],
      allergies: ['Nuts', 'Dairy'],
    },
    rewards: {
      points: 2450,
      tier: 'Gold',
      nextTier: {
        name: 'Platinum',
        pointsNeeded: 550,
      },
    },
    stats: {
      ordersCompleted: 12,
      reviewsGiven: 8,
      wishlistItems: 24,
    },
    paymentMethods: [
      { type: 'visa', last4: '4242', isDefault: true },
      { type: 'mastercard', last4: '8888', isDefault: false },
    ],
    addresses: [
      { type: 'home', address: '123 Green Street, New York, NY 10001', isDefault: true },
      { type: 'work', address: '456 Business Ave, New York, NY 10002', isDefault: false },
    ],
  });

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
      value: userData.stats.ordersCompleted,
      icon: 'package-variant',
      onPress: () => navigation.navigate('Orders'),
      color: COLORS.primary
    },
    { 
      label: 'Reviews', 
      value: userData.stats.reviewsGiven,
      icon: 'star',
      onPress: () => navigation.navigate('Reviews'),
      color: '#FFD700'
    },
    { 
      label: 'Wishlist', 
      value: userData.stats.wishlistItems,
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
      badge: '2',
    },
    {
      title: 'My Addresses',
      icon: 'map-marker',
      onPress: () => navigation.navigate('Address'),
      badge: userData.addresses.length.toString(),
    },
    {
      title: 'Payment Methods',
      icon: 'credit-card',
      onPress: () => navigation.navigate('PaymentMethods'),
      badge: userData.paymentMethods.length.toString(),
    },
    {
      title: 'Notification Settings',
      icon: 'bell',
      onPress: () => navigation.navigate('Notifications'),
      badge: '3',
    },
    {
      title: 'Security',
      icon: 'shield-check',
      onPress: () => navigation.navigate('Security'),
    },
    {
      title: 'My Reviews',
      icon: 'star',
      onPress: () => navigation.navigate('Reviews'),
      badge: userData.stats.reviewsGiven.toString(),
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
      title: 'Dark Mode',
      icon: darkMode ? 'weather-night' : 'white-balance-sunny',
      isSwitch: true,
      value: darkMode,
      onValueChange: () => {
        setDarkMode(!darkMode);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
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

  const handleEditProfile = () => {
    setEditMode(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveProfile = () => {
    setEditMode(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Here you would typically save the changes to your backend
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLogout = async () => {
    try {
      await logout();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Logout error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.primary + '20', '#fff']}
        style={styles.gradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <Animated.View style={[styles.header, animatedStyle]}>
            <TouchableOpacity onPress={pickImage}>
              <Avatar.Image
                size={120}
                source={{ uri: profileImage }}
                style={styles.avatar}
              />
              <View style={styles.editIconContainer}>
                <MaterialCommunityIcons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>

            {editMode ? (
              <View style={styles.editContainer}>
                <TextInput
                  mode="outlined"
                  label="Name"
                  value={userData.name}
                  onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                  style={styles.input}
                />
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={userData.email}
                  onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  mode="outlined"
                  label="Phone"
                  value={userData.phone}
                  onChangeText={(text) => setUserData(prev => ({ ...prev, phone: text }))}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
                <View style={styles.editButtons}>
                  <Button 
                    mode="contained" 
                    onPress={handleSaveProfile}
                    style={[styles.editButton, { flex: 1, marginRight: 8 }]}
                    contentStyle={styles.buttonContent}
                  >
                    Save
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={handleCancelEdit}
                    style={[styles.editButton, { flex: 1, marginLeft: 8 }]}
                    contentStyle={styles.buttonContent}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            ) : (
              <Animated.View style={[styles.userInfo, animatedStyle]}>
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userEmail}>{userData.email}</Text>
                <View style={styles.memberInfo}>
                  <MaterialCommunityIcons 
                    name="clock" 
                    size={16} 
                    color={COLORS.primary} 
                  />
                  <Text style={styles.memberSince}>
                    Member since {userData.memberSince}
                  </Text>
                </View>
                <View style={styles.rewardsInfo}>
                  <Chip 
                    icon="crown" 
                    mode="outlined" 
                    style={[styles.tierChip, { borderColor: COLORS.primary }]}
                    textStyle={{ color: COLORS.primary, fontWeight: 'bold' }}
                  >
                    {userData.rewards.tier} Member
                  </Chip>
                  <Text style={styles.pointsText}>
                    <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
                      {userData.rewards.points}
                    </Text> points • {userData.rewards.nextTier.pointsNeeded} until{' '}
                    <Text style={{ color: COLORS.primary }}>
                      {userData.rewards.nextTier.name}
                    </Text>
                  </Text>
                </View>
                <View style={styles.preferencesContainer}>
                  {userData.preferences.diet.map((pref) => (
                    <Chip 
                      key={pref}
                      style={[styles.preferenceChip, { backgroundColor: COLORS.primary + '20' }]}
                      textStyle={{ fontSize: 12, color: COLORS.primary }}
                    >
                      {pref}
                    </Chip>
                  ))}
                </View>
                <Button
                  mode="outlined"
                  onPress={handleEditProfile}
                  style={[styles.editButton, { borderColor: COLORS.primary }]}
                  icon="account-edit"
                  textColor={COLORS.primary}
                >
                  Edit Profile
                </Button>
              </Animated.View>
            )}
          </Animated.View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => {
              const statScale = useSharedValue(0.3);
              
              useEffect(() => {
                const timeout = setTimeout(() => {
                  statScale.value = withSpring(1, {
                    mass: 0.5,
                    damping: 15,
                    delay: index * 100
                  });
                }, index * 100);
                
                return () => clearTimeout(timeout);
              }, []);

              const statAnimatedStyle = useAnimatedStyle(() => {
                return {
                  transform: [{ scale: statScale.value }],
                };
              });

              return (
                <Animated.View
                  key={stat.label}
                  style={[
                    styles.statItem,
                    { backgroundColor: stat.color + '10' },
                    statAnimatedStyle
                  ]}
                >
                  <TouchableOpacity 
                    style={styles.statButton}
                    onPress={stat.onPress}
                  >
                    <MaterialCommunityIcons 
                      name={stat.icon} 
                      size={24} 
                      color={stat.color} 
                    />
                    <Text style={[styles.statValue, { color: stat.color }]}>
                      {stat.value}
                    </Text>
                    <Text style={[styles.statLabel, { color: stat.color }]}>
                      {stat.label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          <Divider style={styles.divider} />

          {/* Navigation Menu */}
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menu</Text>
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.onPress)}
              >
                <View style={styles.menuItemLeft}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.badge && (
                    <Badge size={22} style={styles.badge}>
                      {item.badge}
                    </Badge>
                  )}
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={theme.colors.backdrop}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Divider style={styles.divider} />

          {/* Settings Menu */}
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Settings</Text>
            {settingsItems.map((item) => (
              <View key={item.title} style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.onValueChange}
                  color={theme.colors.primary}
                />
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={[styles.button, styles.logoutButton]}
              icon="logout"
            >
              Log Out
            </Button>
            <Button
              mode="outlined"
              onPress={handleDeleteAccount}
              style={[styles.button, styles.deleteButton]}
              textColor={theme.colors.error}
              icon="delete"
            >
              Delete Account
            </Button>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    backgroundColor: '#f5f5f5',
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userEmail: {
    fontSize: 16,
    color: '#636E72',
    marginBottom: 15,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  memberSince: {
    fontSize: 14,
    color: '#636E72',
    marginLeft: 8,
    fontWeight: '500',
  },
  rewardsInfo: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  tierChip: {
    marginBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  pointsText: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  preferenceChip: {
    margin: 4,
    paddingHorizontal: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    width: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  statButton: {
    alignItems: 'center',
    width: '100%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  badge: {
    marginRight: 10,
    backgroundColor: COLORS.primary,
  },
  divider: {
    marginVertical: 15,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 10,
  },
  button: {
    marginBottom: 10,
    borderRadius: 8,
  },
  editButton: {
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
  buttonContent: {
    height: 40,
  },
  editContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
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
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default ProfileScreen;

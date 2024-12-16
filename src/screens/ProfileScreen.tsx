import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Linking } from 'react-native';
import { Text, Button, Avatar, Switch, Divider, Portal, Modal, TextInput, useTheme, IconButton, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/constants';

type ProfileStackParamList = {
  ProfileScreen: undefined;
  Details: undefined;
  Address: undefined;
  PaymentMethods: undefined;
  Notifications: undefined;
  Security: undefined;
  HelpSupport: undefined;
  Reviews: undefined;
  Rewards: undefined;
  Settings: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/300');
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    address: '123 Green Street, New York, NY 10001',
  });

  const stats = [
    { label: 'Orders', value: '12', icon: 'package-variant' },
    { label: 'Wishlist', value: '24', icon: 'heart' },
    { label: 'Points', value: '2,450', icon: 'star' },
  ];

  const menuItems = [
    {
      id: '1',
      title: 'My Orders',
      icon: 'clipboard-list',
      screen: 'Orders',
      badge: '2',
      badgeColor: theme.colors.primary,
    },
    {
      id: '2',
      title: 'My Details',
      icon: 'account-circle',
      screen: 'Details',
    },
    {
      id: '3',
      title: 'Delivery Address',
      icon: 'map-marker',
      screen: 'Address',
    },
    {
      id: '4',
      title: 'Payment Methods',
      icon: 'credit-card',
      screen: 'PaymentMethods',
    },
    {
      id: '5',
      title: 'My Reviews',
      icon: 'star',
      screen: 'Reviews',
      badge: '2',
      badgeColor: theme.colors.secondary,
    },
    {
      id: '6',
      title: 'Rewards & Points',
      icon: 'gift',
      screen: 'Rewards',
      badge: 'New',
      badgeColor: theme.colors.primary,
    },
    {
      id: '7',
      title: 'Notifications',
      icon: 'bell',
      screen: 'Notifications',
      badge: '3',
      badgeColor: theme.colors.secondary,
    },
    {
      id: '8',
      title: 'Security',
      icon: 'shield-check',
      screen: 'Security',
    },
    {
      id: '9',
      title: 'Help & Support',
      icon: 'help-circle',
      screen: 'HelpSupport',
    },
    {
      id: '10',
      title: 'Settings',
      icon: 'cog',
      screen: 'Settings',
    },
    {
      id: '11',
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
      id: '12',
      title: 'Notifications',
      icon: 'bell',
      isSwitch: true,
      value: notificationsEnabled,
      onValueChange: () => {
        setNotificationsEnabled(!notificationsEnabled);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    },
    {
      id: '13',
      title: 'Biometric Authentication',
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSaveProfile = () => {
    setEditMode(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleLogout = () => {
    // Implement logout logic here
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const handleMenuItemPress = (screen) => {
    if (screen) {
      navigation.navigate(screen);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            <Avatar.Image
              size={100}
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
                onChangeText={(text) => setUserData({ ...userData, name: text })}
                style={styles.input}
              />
              <TextInput
                mode="outlined"
                label="Email"
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                style={styles.input}
              />
              <TextInput
                mode="outlined"
                label="Phone"
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                style={styles.input}
              />
              <Button
                mode="contained"
                onPress={handleSaveProfile}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.email}>{userData.email}</Text>
              <Button
                mode="outlined"
                onPress={handleEditProfile}
                style={styles.editButton}
              >
                Edit Profile
              </Button>
            </>
          )}
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <MaterialCommunityIcons
                name={stat.icon}
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => !item.isSwitch && handleMenuItemPress(item.screen)}
              >
                <View style={styles.menuItemLeft}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                {item.isSwitch ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    color={theme.colors.primary}
                  />
                ) : (
                  <View style={styles.menuItemRight}>
                    {item.badge && (
                      <Badge
                        size={22}
                        style={[styles.badge, { backgroundColor: item.badgeColor }]}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>
                )}
              </TouchableOpacity>
              <Divider />
            </React.Fragment>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={[styles.button, styles.logoutButton]}
            textColor={theme.colors.error}
          >
            Logout
          </Button>
          <Button
            mode="text"
            onPress={handleDeleteAccount}
            textColor={theme.colors.error}
          >
            Delete Account
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editButton: {
    marginTop: 10,
  },
  editContainer: {
    width: '90%',
    marginTop: 20,
  },
  input: {
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    marginLeft: 15,
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: 10,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 20,
  },
  button: {
    marginBottom: 10,
  },
  logoutButton: {
    borderColor: 'red',
  },
});

export default ProfileScreen;

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, StatusBar, SafeAreaView } from 'react-native';
import { Text, Badge, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  showCart?: boolean;
  showLocation?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  showBack = false,
  title,
  showCart = true,
  showLocation = true,
}) => {
  const navigation = useNavigation();
  const { cartItems } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.primary }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            {showBack && (
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.backButton}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            {showLocation ? (
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.locationLabel}>DELIVER TO</Text>
                <View style={styles.locationContainer}>
                  <MaterialCommunityIcons name="map-marker" size={20} color="#fff" />
                  <Text style={styles.location} numberOfLines={1}>
                    Green way 3000, Sylhet
                  </Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.title}>{title}</Text>
            )}
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Search')}
            >
              <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
            </TouchableOpacity>

            {showCart && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('Cart')}
              >
                <MaterialCommunityIcons name="cart-outline" size={24} color="#fff" />
                {cartItems.length > 0 && (
                  <Badge
                    size={20}
                    style={styles.badge}
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Avatar.Image
                size={32}
                source={{ uri: 'https://ui-avatars.com/api/?name=John+Doe&background=ffffff&color=000' }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <MaterialCommunityIcons name="magnify" size={24} color={COLORS.textLight} />
          <Text style={styles.searchText}>Search for products</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primary,
  },
  container: {
    backgroundColor: COLORS.primary,
    paddingBottom: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  locationButton: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  location: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconButton: {
    position: 'relative',
    padding: SPACING.xs,
  },
  profileButton: {
    marginLeft: SPACING.xs,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    padding: SPACING.sm,
    borderRadius: SPACING.sm,
    gap: SPACING.xs,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default Header;

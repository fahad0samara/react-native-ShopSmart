import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, StatusBar, Animated } from 'react-native';
import { Text, Badge, Avatar, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  showCart?: boolean;
  showLocation?: boolean;
  scrollY?: Animated.Value;
}

const HEADER_HEIGHT = 45;
const HEADER_SCROLL_RANGE = 40;

const Header: React.FC<HeaderProps> = ({
  showBack = false,
  title,
  showCart = true,
  showLocation = true,
  scrollY = new Animated.Value(0),
}) => {
  const navigation = useNavigation();
  const { cartItems } = useApp();
  const insets = useSafeAreaInsets();

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_RANGE],
    outputRange: [HEADER_HEIGHT + (Platform.OS === 'ios' ? insets.top : 0), HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_RANGE],
    outputRange: [1, 0.98],
    extrapolate: 'clamp',
  });

  const handlePress = (route: string) => {
    Haptics.selectionAsync();
    navigation.navigate(route);
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          height: headerHeight,
          paddingTop: Platform.OS === 'ios' ? insets.top : 0,
          opacity: headerOpacity,
        }
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            {showBack && (
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.iconButton}
              >
                <MaterialCommunityIcons 
                  name="arrow-left" 
                  size={24} 
                  color={theme.colors.onPrimary} 
                />
              </TouchableOpacity>
            )}
            {showLocation ? (
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={() => handlePress('Profile')}
              >
                <Text style={styles.locationLabel}>DELIVER TO</Text>
                <View style={styles.locationContainer}>
                  <MaterialCommunityIcons 
                    name="map-marker" 
                    size={20} 
                    color={theme.colors.onPrimary}
                  />
                  <Text style={styles.location} numberOfLines={1}>
                    Green way 3000, Sylhet
                  </Text>
                  <MaterialCommunityIcons 
                    name="chevron-down" 
                    size={20} 
                    color={theme.colors.onPrimary}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.title}>{title}</Text>
            )}
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handlePress('Search')}
            >
              <MaterialCommunityIcons 
                name="magnify" 
                size={24} 
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>

            {showCart && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handlePress('Cart')}
              >
                <MaterialCommunityIcons 
                  name="cart-outline" 
                  size={24} 
                  color={theme.colors.onPrimary}
                />
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
              onPress={() => handlePress('Profile')}
            >
              <Surface style={styles.avatarContainer}>
                <Avatar.Image
                  size={32}
                  source={{ uri: 'https://ui-avatars.com/api/?name=John+Doe&background=ffffff&color=000' }}
                />
              </Surface>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 100,
    elevation: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  locationButton: {
    flex: 1,
    marginLeft: 4,
  },
  locationLabel: {
    fontSize: 10,
    color: theme.colors.onPrimary,
    opacity: 0.7,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  location: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.error,
  },
  profileButton: {
    marginLeft: 4,
  },
  avatarContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
});

export default Header;

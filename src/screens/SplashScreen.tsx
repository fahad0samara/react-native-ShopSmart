import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, isLoading } = useAuth();
  const scaleValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('@onboarding_complete');
        setOnboardingComplete(value === 'true');
      } catch (err) {
        console.log('Error @getItem: ', err);
      }
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 20,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2000),
    ]).start(() => {
      // Navigate to appropriate screen based on auth state and onboarding status
      if (!isLoading) {
        if (user) {
          navigation.replace('MainTabs');
        } else if (!onboardingComplete) {
          navigation.replace('Onboarding');
        } else {
          navigation.replace('Login');
        }
      }
    });
  }, [isLoading, user, onboardingComplete]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleValue }],
            opacity: fadeValue,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="shopping"
          size={100}
          color={theme.colors.primary}
        />
        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
          Grocery App
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.secondary }]}>
          Your daily shopping companion
        </Text>
      </Animated.View>

      <LottieView
        source={require('../assets/animations/loading.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Animated.View style={[styles.footer, { opacity: fadeValue }]}>
        <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
          Version 1.0.0
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  lottie: {
    width: width * 0.5,
    height: width * 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
});

export default SplashScreen;

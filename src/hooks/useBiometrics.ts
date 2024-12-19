import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export const useBiometrics = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    checkBiometricAvailability();
    loadBiometricPreference();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setIsAvailable(hasHardware && isEnrolled);

      if (hasHardware && isEnrolled) {
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const loadBiometricPreference = async () => {
    try {
      const enabled = await AsyncStorage.getItem('@biometric_enabled');
      setIsEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading biometric preference:', error);
    }
  };

  const toggleBiometrics = async () => {
    try {
      const newState = !isEnabled;
      await AsyncStorage.setItem('@biometric_enabled', String(newState));
      setIsEnabled(newState);
      Haptics.notificationAsync(
        newState
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );
      return true;
    } catch (error) {
      console.error('Error toggling biometrics:', error);
      return false;
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      if (!isAvailable || !isEnabled) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      return result.success;
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return false;
    }
  };

  return {
    isAvailable,
    isEnabled,
    biometricType,
    authenticate,
    toggleBiometrics,
  };
};

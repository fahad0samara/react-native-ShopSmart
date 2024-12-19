import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { SPACING } from '../constants/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  message?: string;
  overlay?: boolean;
}

export const LoadingScreen: React.FC<Props> = ({ 
  message = 'Loading...', 
  overlay = false 
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    { paddingTop: insets.top }
  ];

  return (
    <View style={containerStyle}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <ActivityIndicator 
            size="large" 
            color={theme.colors.primary} 
            style={styles.spinner}
          />
          <Text style={[styles.message, { color: theme.colors.onSurface }]}>
            {message}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  spinner: {
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal, Text, useTheme } from 'react-native-paper';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message }) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Portal>
      <View style={[
        StyleSheet.absoluteFill,
        styles.overlay,
        { backgroundColor: `${theme.colors.backdrop}CC` }
      ]}>
        <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          {message && (
            <Text style={[styles.message, { color: theme.colors.onSurface }]}>
              {message}
            </Text>
          )}
        </View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
});

export default LoadingOverlay;

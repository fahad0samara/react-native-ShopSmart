import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RatingProps {
  value: number;
  size?: number;
  onValueChange?: (value: number) => void;
}

const Rating: React.FC<RatingProps> = ({ value, size = 16, onValueChange }) => {
  const theme = useTheme();
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <MaterialCommunityIcons
        key={i}
        name={i <= value ? 'star' : 'star-outline'}
        size={size}
        color={theme.colors.primary}
        onPress={() => onValueChange?.(i)}
      />
    );
  }

  return <View style={styles.rating}>{stars}</View>;
};

const styles = StyleSheet.create({
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Rating;

import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { COLORS } from './constants';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    error: '#FF4444',
    background: '#F7F7F7',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    placeholder: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: COLORS.primary,
  },
  roundness: 12,
};

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Appearance } from 'react-native';

const brandColors = {
  primary: '#2E7D32', // Forest Green
  secondary: '#1976D2', // Ocean Blue
  tertiary: '#9C27B0', // Purple
  error: '#D32F2F',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  accent: '#FF9800',
};

const darkBrandColors = {
  ...brandColors,
  primary: '#4CAF50',
  secondary: '#42A5F5',
  background: '#121212',
  surface: '#1E1E1E',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...brandColors,
    elevation: {
      level0: 'transparent',
      level1: '#fff',
      level2: '#f5f5f5',
      level3: '#e0e0e0',
      level4: '#bdbdbd',
      level5: '#9e9e9e',
    },
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkBrandColors,
    elevation: {
      level0: '#121212',
      level1: '#1E1E1E',
      level2: '#222222',
      level3: '#242424',
      level4: '#272727',
      level5: '#2C2C2C',
    },
  },
  roundness: 12,
};

export const getTheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export const shadowProps = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

const theme = getTheme();
export default theme;

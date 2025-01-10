import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import type { MD3Typescale, MD3Colors } from 'react-native-paper/lib/typescript/types';
import { Platform } from 'react-native';

interface ExtendedMD3Theme extends MD3Theme {
  colors: MD3Colors & {
    elevation: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
      level4: string;
      level5: string;
    };
  };
}

const baseFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const fonts: MD3Typescale = {
  default: {
    fontFamily: baseFont,
    fontWeight: '400',
    letterSpacing: 0,
  },
  displayLarge: { fontFamily: baseFont, fontSize: 57, fontWeight: '400', letterSpacing: 0, lineHeight: 64 },
  displayMedium: { fontFamily: baseFont, fontSize: 45, fontWeight: '400', letterSpacing: 0, lineHeight: 52 },
  displaySmall: { fontFamily: baseFont, fontSize: 36, fontWeight: '400', letterSpacing: 0, lineHeight: 44 },
  headlineLarge: { fontFamily: baseFont, fontSize: 32, fontWeight: '400', letterSpacing: 0, lineHeight: 40 },
  headlineMedium: { fontFamily: baseFont, fontSize: 28, fontWeight: '400', letterSpacing: 0, lineHeight: 36 },
  headlineSmall: { fontFamily: baseFont, fontSize: 24, fontWeight: '400', letterSpacing: 0, lineHeight: 32 },
  titleLarge: { fontFamily: baseFont, fontSize: 22, fontWeight: '400', letterSpacing: 0, lineHeight: 28 },
  titleMedium: { fontFamily: baseFont, fontSize: 16, fontWeight: '500', letterSpacing: 0.15, lineHeight: 24 },
  titleSmall: { fontFamily: baseFont, fontSize: 14, fontWeight: '500', letterSpacing: 0.1, lineHeight: 20 },
  labelLarge: { fontFamily: baseFont, fontSize: 14, fontWeight: '500', letterSpacing: 0.1, lineHeight: 20 },
  labelMedium: { fontFamily: baseFont, fontSize: 12, fontWeight: '500', letterSpacing: 0.5, lineHeight: 16 },
  labelSmall: { fontFamily: baseFont, fontSize: 11, fontWeight: '500', letterSpacing: 0.5, lineHeight: 16 },
  bodyLarge: { fontFamily: baseFont, fontSize: 16, fontWeight: '400', letterSpacing: 0.15, lineHeight: 24 },
  bodyMedium: { fontFamily: baseFont, fontSize: 14, fontWeight: '400', letterSpacing: 0.25, lineHeight: 20 },
  bodySmall: { fontFamily: baseFont, fontSize: 12, fontWeight: '400', letterSpacing: 0.4, lineHeight: 16 },
};

export const lightTheme: ExtendedMD3Theme = {
  ...MD3LightTheme,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#00A76F',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E8F5E9',
    onPrimaryContainer: '#004D40',
    secondary: '#4D6356',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#F5F5F5',
    onSecondaryContainer: '#1B1B1B',
    tertiary: '#3D6373',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#E3F2FD',
    onTertiaryContainer: '#1A237E',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    background: '#FFFFFF',
    onBackground: '#1B1B1B',
    surface: '#FFFFFF',
    onSurface: '#1B1B1B',
    surfaceVariant: '#F5F5F5',
    onSurfaceVariant: '#424242',
    outline: '#E0E0E0',
    outlineVariant: '#EEEEEE',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#1B1B1B',
    inverseOnSurface: '#FFFFFF',
    inversePrimary: '#78DC9C',
    elevation: {
      level0: '#FFFFFF',
      level1: '#FFFFFF',
      level2: '#FAFAFA',
      level3: '#F5F5F5',
      level4: '#F2F2F2',
      level5: '#EFEFEF',
    },
  },
} as ExtendedMD3Theme;

export const darkTheme: ExtendedMD3Theme = {
  ...MD3DarkTheme,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#78DC9C',
    onPrimary: '#00391B',
    primaryContainer: '#00522A',
    onPrimaryContainer: '#95F9B7',
    secondary: '#B3CCBD',
    onSecondary: '#1F352A',
    secondaryContainer: '#35493F',
    onSecondaryContainer: '#CFE9D9',
    tertiary: '#A5CCDF',
    onTertiary: '#063543',
    tertiaryContainer: '#244C5B',
    onTertiaryContainer: '#C1E8FB',
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    background: '#121212',
    onBackground: '#E2E3DE',
    surface: '#1E1E1E',
    onSurface: '#E2E3DE',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#C0C9C0',
    outline: '#3F3F3F',
    outlineVariant: '#2C2C2C',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#E2E3DE',
    inverseOnSurface: '#2E312E',
    inversePrimary: '#00A76F',
    elevation: {
      level0: '#121212',
      level1: '#1E1E1E',
      level2: '#222222',
      level3: '#242424',
      level4: '#272727',
      level5: '#2C2C2C',
    },
  },
} as ExtendedMD3Theme;

export type { ExtendedMD3Theme };

export default darkTheme;

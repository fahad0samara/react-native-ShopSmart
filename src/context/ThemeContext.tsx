import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: typeof lightTheme;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: 'system',
  setThemeType: () => {},
  isDarkMode: false,
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');

  useEffect(() => {
    loadThemeType();
  }, []);

  const loadThemeType = async () => {
    try {
      const savedThemeType = await AsyncStorage.getItem('@theme_type');
      if (savedThemeType) {
        setThemeType(savedThemeType as ThemeType);
      }
    } catch (error) {
      console.log('Error loading theme type:', error);
    }
  };

  const setAndSaveThemeType = async (type: ThemeType) => {
    try {
      await AsyncStorage.setItem('@theme_type', type);
      setThemeType(type);
    } catch (error) {
      console.log('Error saving theme type:', error);
    }
  };

  const isDarkMode =
    themeType === 'system' ? colorScheme === 'dark' : themeType === 'dark';

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeType,
        setThemeType: setAndSaveThemeType,
        isDarkMode,
      }}
    >
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

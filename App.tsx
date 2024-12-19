import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import MainTabs from './src/navigation/MainTabs';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/navigation/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { LoadingScreen } from './src/components/LoadingScreen';

const RootStack = createStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { userToken, isLoading } = useAuth();
  const { theme, isDarkMode } = useAppTheme();

  if (isLoading) {
    return <LoadingScreen message="Starting up..." />;
  }

  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {userToken ? (
        <MainTabs />
      ) : (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Register" component={RegisterScreen} />
          <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider>
              <AppThemeContent />
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const AppThemeContent = () => {
  const { theme } = useAppTheme();
  
  return (
    <PaperProvider theme={theme}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </PaperProvider>
  );
};

export default App;

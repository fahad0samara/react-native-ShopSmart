import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { UserProvider } from './src/context/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/navigation/types';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { LoadingScreen } from './src/components/LoadingScreen';
import './src/config/firebase';
import MainTabs from './src/navigation/MainTabs';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import { useAuth } from './src/context/AuthContext';
import { useAppTheme } from './src/context/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { userToken, isLoading } = useAuth();
  const { theme } = useAppTheme();

  if (isLoading) {
    return <LoadingScreen message="Starting up..." />;
  }

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userToken ? (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </PaperProvider>
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
              <AppProvider>
                <UserProvider>
                  <AppContent />
                </UserProvider>
              </AppProvider>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;

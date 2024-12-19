import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import MainTabs from './src/navigation/MainTabs';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from './src/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/navigation/types';

const RootStack = createStackNavigator<RootStackParamList>();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

const App = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            {userToken ? (
              // User is signed in
              <MainTabs />
            ) : (
              // No token found, user isn't signed in
              <RootStack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
                <RootStack.Screen name="Login" component={LoginScreen} />
                <RootStack.Screen name="Register" component={RegisterScreen} />
                <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              </RootStack.Navigator>
            )}
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
};

export default function AppWrapper() {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="auto" />
        <App />
      </AppProvider>
    </AuthProvider>
  );
}

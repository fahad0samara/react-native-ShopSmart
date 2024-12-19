import { useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

WebBrowser.maybeCompleteAuthSession();

// Replace these with your actual client IDs
const GOOGLE_CLIENT_ID = 'your-google-client-id';
const FACEBOOK_APP_ID = 'your-facebook-app-id';

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    expoClientId: GOOGLE_CLIENT_ID,
  });

  const [fbRequest, fbResponse, promptFacebookAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID,
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const response = await promptGoogleAsync();
      
      if (response?.type === 'success') {
        const { authentication } = response;
        
        // TODO: Send token to your backend
        // const result = await yourBackendApi.googleSignIn(authentication.accessToken);
        
        // For demo, we'll just store the token
        await AsyncStorage.setItem('@auth_token', authentication.accessToken);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Google sign in error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const response = await promptFacebookAsync();
      
      if (response?.type === 'success') {
        const { authentication } = response;
        
        // TODO: Send token to your backend
        // const result = await yourBackendApi.facebookSignIn(authentication.accessToken);
        
        // For demo, we'll just store the token
        await AsyncStorage.setItem('@auth_token', authentication.accessToken);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Facebook sign in error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleGoogleSignIn,
    handleFacebookSignIn,
  };
};

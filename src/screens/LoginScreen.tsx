import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  IconButton,
  Surface,
  Divider,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBiometrics } from '../hooks/useBiometrics';
import { useSocialAuth } from '../hooks/useSocialAuth';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const { login } = useAuth();
  const { isAvailable, isEnabled, biometricType, authenticate } = useBiometrics();
  const { isLoading: isSocialLoading, handleGoogleSignIn, handleFacebookSignIn } = useSocialAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setSnackbarVisible(true);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setSnackbarVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage('Logging in...');
      await login(email, password);
      // Login successful - navigation will be handled by App.tsx
    } catch (error) {
      setError('Invalid email or password');
      setSnackbarVisible(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setLoadingMessage(`Connecting to ${provider}...`);
      setIsLoading(true);
      
      const success = await (provider === 'google' ? handleGoogleSignIn() : handleFacebookSignIn());
      
      if (success) {
        setLoadingMessage('Success! Redirecting...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError(`${provider} login failed`);
      setSnackbarVisible(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[theme.colors.primary + '20', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Animatable.View 
            animation="bounceIn" 
            duration={1500} 
            delay={500}
            style={styles.logoContainer}
          >
            <Surface style={styles.logoContainer}>
              <MaterialCommunityIcons
                name="shopping"
                size={50}
                color={theme.colors.primary}
              />
            </Surface>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={700}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              error={error.includes('email')}
              left={<TextInput.Icon icon="email" />}
            />
            {error.includes('email') && (
              <HelperText type="error" visible={true}>
                {error}
              </HelperText>
            )}
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={900}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              error={error.includes('password')}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={1100}>
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            >
              Login
            </Button>

            <View style={styles.socialButtons}>
              <Button
                mode="outlined"
                onPress={() => handleSocialLogin('google')}
                style={[styles.socialButton, { marginRight: 8 }]}
                icon="google"
                disabled={isLoading}
              >
                Google
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleSocialLogin('facebook')}
                style={styles.socialButton}
                icon="facebook"
                disabled={isLoading}
              >
                Facebook
              </Button>
            </View>
          </Animatable.View>

          <Animatable.View 
            animation="fadeIn" 
            delay={1300} 
            style={styles.footer}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.footerButton}
            >
              <Text>Don't have an account? </Text>
              <Text style={{ color: theme.colors.primary }}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={[styles.footerButton, { marginTop: 8 }]}
            >
              <Text style={{ color: theme.colors.primary }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animated.View>
      </ScrollView>

      <LoadingOverlay visible={isLoading} message={loadingMessage} />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 32,
    elevation: 4,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LoginScreen;

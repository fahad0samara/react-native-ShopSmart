import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  StatusBar,
  FlatList,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;

const scaledSize = (size: number) => Math.round(size * scale);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const slides = [
  {
    id: '1',
    title: 'Welcome to Our App',
    description: 'Discover amazing features and possibilities',
    icon: 'rocket',
    secondaryIcon: 'star',
    features: [
      'Fast and reliable',
      'Easy to use',
      'Secure and private'
    ],
  },
  {
    id: '2',
    title: 'Smart Features',
    description: 'Experience the power of intelligent technology',
    icon: 'brain',
    secondaryIcon: 'lightning-bolt',
    features: [
      'AI-powered solutions',
      'Real-time updates',
      'Smart notifications'
    ],
  },
  {
    id: '3',
    title: 'Get Started',
    description: 'Join us and start your journey today',
    icon: 'flag-checkered',
    secondaryIcon: 'check-circle',
    features: [
      'Quick setup',
      'Personalized experience',
      'Ready to go'
    ],
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const swipeHintAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('@onboarding_completed');
      if (value === 'true') {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const completeOnboarding = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(swipeHintAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.replace('Login');
      });
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showSwipeHint) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(swipeHintAnim, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(swipeHintAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showSwipeHint]);

  useEffect(() => {
    if (currentIndex > 0) {
      setShowSwipeHint(false);
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    completeOnboarding();
  };

  const renderSwipeHint = () => {
    if (!showSwipeHint) return null;
    
    return (
      <Animated.View
        style={[
          styles.swipeHint,
          {
            opacity: swipeHintAnim,
            transform: [{
              translateX: swipeHintAnim.interpolate({
                inputRange: [0.7, 1],
                outputRange: [0, 20],
              }),
            }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name="gesture-swipe-horizontal"
          size={30}
          color="rgba(255, 255, 255, 0.8)"
        />
        <Text style={styles.swipeHintText}>Swipe to explore</Text>
      </Animated.View>
    );
  };

  const renderDot = (index) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1.2, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.1, 0, -width * 0.1],
    });

    return (
      <Animated.View
        style={[
          styles.slideContainer,
          { 
            transform: [
              { scale },
              { translateX },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{
                translateX: scrollX.interpolate({
                  inputRange,
                  outputRange: [-30, 0, 30],
                }),
              }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={scaledSize(60)}
            color="#fff"
          />
          <Animatable.View
            animation="bounceIn"
            delay={1000}
            style={styles.secondaryIconContainer}
          >
            <MaterialCommunityIcons
              name={item.secondaryIcon}
              size={scaledSize(24)}
              color="#fff"
            />
          </Animatable.View>
        </Animated.View>
        
        <Animatable.Text 
          animation="fadeInUp"
          delay={300}
          style={styles.title}
        >
          {item.title}
        </Animatable.Text>
        
        <Animatable.Text
          animation="fadeInUp"
          delay={400}
          style={styles.description}
        >
          {item.description}
        </Animatable.Text>
        
        <View style={styles.featuresContainer}>
          {item.features.map((feature, idx) => (
            <Animatable.View
              key={idx}
              animation="fadeInUp"
              delay={500 + idx * 200}
              style={styles.featureItem}
            >
              <Text style={styles.featureText}>{feature}</Text>
            </Animatable.View>
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#064e3b', '#065f46', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <TouchableOpacity
        style={[styles.skipButton, isLoading && styles.disabledButton]}
        onPress={handleSkip}
        disabled={isLoading}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {renderSwipeHint()}

      <AnimatedFlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => renderDot(index))}
        </View>
        
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                transform: [{
                  scaleX: scrollX.interpolate({
                    inputRange: [0, width * (slides.length - 1)],
                    outputRange: [0.01, 1],
                    extrapolate: 'clamp',
                  })
                }],
                transformOrigin: 'left',
              },
            ]}
          />
        </View>

        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleComplete}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleNext}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? scaledSize(44) : StatusBar.currentHeight,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: scaledSize(20),
    paddingVertical: scaledSize(10),
    borderRadius: scaledSize(25),
    position: 'absolute',
    top: Platform.OS === 'ios' ? scaledSize(44) : StatusBar.currentHeight + scaledSize(10),
    right: scaledSize(20),
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: scaledSize(16),
    fontWeight: '600',
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.1,
    width: width,
  },
  iconContainer: {
    width: scaledSize(100),
    height: scaledSize(100),
    borderRadius: scaledSize(50),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaledSize(40),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: scaledSize(32),
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: scaledSize(16),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: scaledSize(16),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: scaledSize(32),
    lineHeight: scaledSize(24),
  },
  featuresContainer: {
    width: '100%',
    paddingHorizontal: scaledSize(16),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: scaledSize(16),
    borderRadius: scaledSize(12),
    marginBottom: scaledSize(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: scaledSize(15),
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: width * 0.1,
    paddingVertical: scaledSize(20),
    paddingBottom: Platform.OS === 'ios' ? scaledSize(40) : scaledSize(20),
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaledSize(20),
  },
  dot: {
    width: scaledSize(8),
    height: scaledSize(8),
    borderRadius: scaledSize(4),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: scaledSize(4),
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: scaledSize(24),
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: scaledSize(56),
    borderRadius: scaledSize(28),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scaledSize(18),
    fontWeight: 'bold',
  },
  progressBar: {
    height: scaledSize(4),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scaledSize(2),
    overflow: 'hidden',
    marginVertical: scaledSize(16),
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  swipeHint: {
    position: 'absolute',
    bottom: height * 0.15,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: scaledSize(10),
    borderRadius: scaledSize(20),
    flexDirection: 'row',
  },
  swipeHintText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: scaledSize(8),
    fontSize: scaledSize(14),
  },
  secondaryIconContainer: {
    position: 'absolute',
    top: -scaledSize(10),
    right: -scaledSize(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scaledSize(15),
    padding: scaledSize(5),
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default OnboardingScreen;

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Text, Button, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import LoadingOverlay from '../components/LoadingOverlay';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to GroceryApp',
    description: 'Your one-stop shop for all your grocery needs',
    icon: 'shopping',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Easy Shopping',
    description: 'Browse through categories and add items to your cart',
    icon: 'cart',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Fast Delivery',
    description: 'Get your groceries delivered right to your doorstep',
    icon: 'truck-delivery',
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Save & Reorder',
    description: 'Save your favorite items and reorder with one tap',
    icon: 'heart',
    color: '#E91E63',
  },
  {
    id: '5',
    title: 'Secure Payments',
    description: 'Multiple payment options for your convenience',
    icon: 'credit-card',
    color: '#9C27B0',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
      setIsLastSlide(viewableItems[0].index === slides.length - 1);
      Haptics.selectionAsync();
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      try {
        setIsLoading(true);
        setLoadingMessage('Preparing your experience...');
        await AsyncStorage.setItem('@onboarding_complete', 'true');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigation.replace('Login');
      } catch (err) {
        console.log('Error @setItem: ', err);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const skip = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage('Skipping onboarding...');
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await new Promise(resolve => setTimeout(resolve, 800));
      navigation.replace('Login');
    } catch (err) {
      console.log('Error @setItem: ', err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const Slide = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [100, 0, 100],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.slide,
          {
            transform: [{ translateY }, { scale }],
            opacity,
          }
        ]}
      >
        <Animatable.View
          animation="bounceIn"
          duration={1500}
          delay={500}
          style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={80}
            color={item.color}
          />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" delay={700}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            {item.title}
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.description, { color: theme.colors.secondary }]}
          >
            {item.description}
          </Text>
        </Animatable.View>
      </Animated.View>
    );
  };

  const Pagination = () => {
    return (
      <Animatable.View 
        style={styles.pagination}
        animation="fadeInUp"
        delay={1000}
      >
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.3, 1],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  transform: [{ scale }],
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          );
        })}
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary + '20', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={[styles.skipButton, { opacity: isLastSlide ? 0 : 1 }]}
          onPress={skip}
          disabled={isLastSlide || isLoading}
        >
          <Text style={{ color: theme.colors.primary }}>Skip</Text>
        </TouchableOpacity>

        <FlatList
          data={slides}
          renderItem={({ item, index }) => <Slide item={item} index={index} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={item => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />

        <Pagination />

        <Animatable.View
          style={styles.footer}
          animation="fadeInUp"
          delay={1200}
        >
          <Button
            mode="contained"
            onPress={scrollTo}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLastSlide ? "Let's Start" : 'Next'}
          </Button>
        </Animatable.View>
      </Animated.View>

      <LoadingOverlay visible={isLoading} message={loadingMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  slide: {
    width,
    paddingHorizontal: 20,
    paddingTop: height * 0.1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    maxWidth: '80%',
    alignSelf: 'center',
    opacity: 0.7,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  footer: {
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 8,
  },
});

export default OnboardingScreen;

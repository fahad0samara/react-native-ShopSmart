import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { Portal, Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface AppTourProps {
  steps: TourStep[];
  onFinish: () => void;
  tourKey: string;
}

export const AppTour: React.FC<AppTourProps> = ({ steps, onFinish, tourKey }) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetLayout, setTargetLayout] = useState<any>(null);
  const [tooltipLayout, setTooltipLayout] = useState<any>(null);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    checkTourStatus();
  }, []);

  useEffect(() => {
    if (targetLayout) {
      showTooltip();
    }
  }, [targetLayout, currentStep]);

  const checkTourStatus = async () => {
    try {
      const tourComplete = await AsyncStorage.getItem(`@tour_complete_${tourKey}`);
      if (tourComplete === 'true') {
        onFinish();
      }
    } catch (error) {
      console.error('Error checking tour status:', error);
    }
  };

  const showTooltip = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideTooltip = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleTargetLayout = (event: LayoutChangeEvent) => {
    setTargetLayout(event.nativeEvent.layout);
  };

  const handleTooltipLayout = (event: LayoutChangeEvent) => {
    setTooltipLayout(event.nativeEvent.layout);
  };

  const getTooltipPosition = () => {
    if (!targetLayout || !tooltipLayout) return {};

    const { position = 'bottom' } = steps[currentStep];
    const margin = 12;

    switch (position) {
      case 'top':
        return {
          top: targetLayout.y - tooltipLayout.height - margin,
          left: targetLayout.x + targetLayout.width / 2 - tooltipLayout.width / 2,
        };
      case 'bottom':
        return {
          top: targetLayout.y + targetLayout.height + margin,
          left: targetLayout.x + targetLayout.width / 2 - tooltipLayout.width / 2,
        };
      case 'left':
        return {
          top: targetLayout.y + targetLayout.height / 2 - tooltipLayout.height / 2,
          left: targetLayout.x - tooltipLayout.width - margin,
        };
      case 'right':
        return {
          top: targetLayout.y + targetLayout.height / 2 - tooltipLayout.height / 2,
          left: targetLayout.x + targetLayout.width + margin,
        };
      default:
        return {};
    }
  };

  const handleNext = async () => {
    hideTooltip();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await AsyncStorage.setItem(`@tour_complete_${tourKey}`, 'true');
        onFinish();
      } catch (error) {
        console.error('Error saving tour status:', error);
      }
    }
  };

  const currentTarget = document.querySelector(steps[currentStep]?.target);
  if (currentTarget) {
    currentTarget.addEventListener('layout', handleTargetLayout);
  }

  return (
    <Portal>
      <TouchableWithoutFeedback onPress={handleNext}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.tooltip,
              getTooltipPosition(),
              { opacity, backgroundColor: theme.colors.surface },
            ]}
            onLayout={handleTooltipLayout}
          >
            <Text variant="titleMedium" style={styles.title}>
              {steps[currentStep].title}
            </Text>
            <Text variant="bodyMedium" style={styles.content}>
              {steps[currentStep].content}
            </Text>
            <Text variant="labelSmall" style={styles.counter}>
              {currentStep + 1}/{steps.length}
            </Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tooltip: {
    position: 'absolute',
    padding: 16,
    borderRadius: 8,
    maxWidth: width * 0.8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 16,
  },
  counter: {
    alignSelf: 'flex-end',
    opacity: 0.7,
  },
});

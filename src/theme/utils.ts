import { Dimensions, Platform, StatusBar } from 'react-native';
import { SPACING } from '../constants/spacing';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive sizing utilities
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Typography scale
export const FONT_SIZES = {
  xs: moderateScale(12),
  sm: moderateScale(14),
  md: moderateScale(16),
  lg: moderateScale(18),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
} as const;

// Line heights
export const LINE_HEIGHTS = {
  xs: moderateScale(16),
  sm: moderateScale(20),
  md: moderateScale(24),
  lg: moderateScale(28),
  xl: moderateScale(32),
  xxl: moderateScale(36),
  xxxl: moderateScale(44),
} as const;

// Font weights
export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Border radiuses
export const BORDER_RADIUS = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(24),
  round: 999,
} as const;

// Shadows
export const createShadow = (elevation: number) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: 0.15,
      shadowRadius: elevation * 0.75,
    };
  }

  return {
    elevation,
  };
};

// Status bar height
export const STATUS_BAR_HEIGHT = Platform.select({
  ios: 20,
  android: StatusBar.currentHeight,
  default: 0,
});

// Common styles
export const commonStyles = {
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  padding: {
    padding: SPACING.md,
  },
  margin: {
    margin: SPACING.md,
  },
  shadow: createShadow(3),
} as const;

// Animation durations
export const ANIMATION = {
  scale: {
    duration: 200,
    easing: 'easeInOut',
  },
  fade: {
    duration: 150,
    easing: 'easeIn',
  },
  slide: {
    duration: 300,
    easing: 'easeInOut',
  },
} as const;

// Z-index values
export const Z_INDEX = {
  base: 0,
  card: 1,
  header: 2,
  modal: 3,
  overlay: 4,
  tooltip: 5,
  toast: 6,
} as const;

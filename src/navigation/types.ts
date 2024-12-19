import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Orders: undefined;
  Address: undefined;
  Reviews: undefined;
  Security: undefined;
  Details: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  PaymentMethods: undefined;
  Notifications: undefined;
  Rewards: undefined;
};

export type CategoriesStackParamList = {
  CategoriesMain: undefined;
  Products: {
    category: string;
    subcategory?: string;
  };
  ItemDetails: {
    item: {
      id: string;
      name: string;
      price: number;
      category: string;
      image: string;
      description: string;
      rating: number;
      reviews: number;
      isOrganic?: boolean;
      unit: string;
      inStock: boolean;
    };
  };
};

export type MainTabsParamList = {
  Home: undefined;
  Categories: NavigatorScreenParams<CategoriesStackParamList>;
  Orders: undefined;
  Cart: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

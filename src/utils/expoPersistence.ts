import * as SecureStore from 'expo-secure-store';

export const expoPersistence = {
  async setItem(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  },

  async getItem(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving auth data:', error);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  }
};

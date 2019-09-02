import AsyncStorage from '@react-native-community/async-storage';

export const _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
};
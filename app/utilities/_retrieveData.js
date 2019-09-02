import AsyncStorage from '@react-native-community/async-storage';

export const _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        console.log(value);
        return value
      }
    } catch (error) {
      // Error retrieving data
    }
};

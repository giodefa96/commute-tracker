import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@commutes';

export const loadCommutes = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading commutes:', error);
    return [];
  }
};

export const saveCommutes = async (commutes) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(commutes));
  } catch (error) {
    console.error('Error saving commutes:', error);
  }
};

// Funzione di debug per vedere tutti i dati salvati
export const getAllData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    console.log('=== DATI SALVATI ===');
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error reading data:', error);
  }
};

// Funzione per cancellare tutti i dati (utile per test)
export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('Tutti i dati sono stati cancellati');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
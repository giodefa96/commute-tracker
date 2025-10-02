import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const USER_KEY = '@user_credentials';
const AUTH_TOKEN_KEY = '@auth_token';

/**
 * Hash della password usando SHA256
 */
const hashPassword = async (password) => {
  try {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

/**
 * Registra un nuovo utente
 */
export const register = async (username, email, password) => {
  try {
    // Controlla se esiste già un utente
    const existingUser = await AsyncStorage.getItem(USER_KEY);
    if (existingUser) {
      return { success: false, error: 'Un utente è già registrato' };
    }

    // Validazione base
    if (!username || username.trim().length < 3) {
      return { success: false, error: 'Username deve essere almeno 3 caratteri' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Email non valida' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password deve essere almeno 6 caratteri' };
    }

    // Hash della password
    const hashedPassword = await hashPassword(password);

    // Salva le credenziali
    const userData = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    
    // Crea un token di autenticazione
    const token = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${username}${email}${Date.now()}`
    );
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

    return { success: true, user: { username: userData.username, email: userData.email } };
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false, error: 'Errore durante la registrazione' };
  }
};

/**
 * Login dell'utente
 */
export const login = async (emailOrUsername, password) => {
  try {
    // Carica l'utente salvato
    const userDataStr = await AsyncStorage.getItem(USER_KEY);
    if (!userDataStr) {
      return { success: false, error: 'Nessun utente registrato. Registrati prima.' };
    }

    const userData = JSON.parse(userDataStr);
    const hashedPassword = await hashPassword(password);

    // Verifica le credenziali
    const isEmailMatch = userData.email === emailOrUsername.trim().toLowerCase();
    const isUsernameMatch = userData.username === emailOrUsername.trim();
    const isPasswordMatch = userData.password === hashedPassword;

    if ((isEmailMatch || isUsernameMatch) && isPasswordMatch) {
      // Crea un nuovo token di autenticazione
      const token = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${userData.username}${userData.email}${Date.now()}`
      );
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

      return { 
        success: true, 
        user: { username: userData.username, email: userData.email } 
      };
    }

    return { success: false, error: 'Credenziali non valide' };
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, error: 'Errore durante il login' };
  }
};

/**
 * Logout dell'utente
 */
export const logout = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error during logout:', error);
    return { success: false, error: 'Errore durante il logout' };
  }
};

/**
 * Controlla se l'utente è autenticato
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return token !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Ottieni i dati dell'utente corrente
 */
export const getCurrentUser = async () => {
  try {
    const userDataStr = await AsyncStorage.getItem(USER_KEY);
    if (!userDataStr) {
      return null;
    }
    const userData = JSON.parse(userDataStr);
    return { username: userData.username, email: userData.email };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Controlla se esiste un utente registrato
 */
export const hasRegisteredUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData !== null;
  } catch (error) {
    console.error('Error checking registered user:', error);
    return false;
  }
};

/**
 * Elimina completamente l'utente (per test o reset)
 */
export const deleteUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Errore durante l\'eliminazione' };
  }
};

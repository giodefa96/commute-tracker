import AsyncStorage from '@react-native-async-storage/async-storage';

const PATHS_KEY = '@commute_paths';
const SETUP_DONE_KEY = '@setup_done';

/**
 * Struttura di un Commute Path:
 * {
 *   id: string,
 *   name: string,              // es: "Casa - Lavoro"
 *   emoji: string,             // es: "🏠→🏢"
 *   steps: [                   // Tappe configurate
 *     { id: string, name: string, emoji: string, enabled: boolean }
 *   ],
 *   isDefault: boolean,
 *   createdAt: string,
 *   updatedAt: string
 * }
 */

// Tappe predefinite disponibili
export const AVAILABLE_STEPS = [
  { id: 'departure', name: 'Partenza', emoji: '🏠', field: 'departureTime' },
  { id: 'platform', name: 'Arrivo Banchina', emoji: '🚏', field: 'arrivalPlatformTime' },
  { id: 'bus', name: 'Arrivo Autobus', emoji: '🚌', field: 'arrivalBusTime' },
  { id: 'destination', name: 'Arrivo Destinazione', emoji: '📍', field: 'arrivalDestinationTime' },
  { id: 'final', name: 'Arrivo Finale', emoji: '🎯', field: 'finalArrivalTime' },
];

/**
 * Controlla se il setup iniziale è stato completato
 */
export const isSetupDone = async () => {
  try {
    const done = await AsyncStorage.getItem(SETUP_DONE_KEY);
    return done === 'true';
  } catch (error) {
    console.error('Errore verifica setup:', error);
    return false;
  }
};

/**
 * Marca il setup come completato
 */
export const markSetupDone = async () => {
  try {
    await AsyncStorage.setItem(SETUP_DONE_KEY, 'true');
    return true;
  } catch (error) {
    console.error('Errore mark setup done:', error);
    return false;
  }
};

/**
 * Carica tutti i paths salvati
 */
export const loadPaths = async () => {
  try {
    const data = await AsyncStorage.getItem(PATHS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Errore caricamento paths:', error);
    return [];
  }
};

/**
 * Salva un nuovo path
 */
export const savePath = async (path) => {
  try {
    const paths = await loadPaths();
    
    const newPath = {
      ...path,
      id: path.id || Date.now().toString(),
      createdAt: path.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    paths.push(newPath);
    await AsyncStorage.setItem(PATHS_KEY, JSON.stringify(paths));
    
    console.log('Path salvato:', newPath);
    return newPath;
  } catch (error) {
    console.error('Errore salvataggio path:', error);
    throw error;
  }
};

/**
 * Aggiorna un path esistente
 */
export const updatePath = async (id, updates) => {
  try {
    const paths = await loadPaths();
    const index = paths.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Path non trovato');
    }
    
    paths[index] = {
      ...paths[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(PATHS_KEY, JSON.stringify(paths));
    console.log('Path aggiornato:', paths[index]);
    return paths[index];
  } catch (error) {
    console.error('Errore aggiornamento path:', error);
    throw error;
  }
};

/**
 * Elimina un path
 */
export const deletePath = async (id) => {
  try {
    const paths = await loadPaths();
    const filtered = paths.filter(p => p.id !== id);
    await AsyncStorage.setItem(PATHS_KEY, JSON.stringify(filtered));
    console.log('Path eliminato:', id);
    return true;
  } catch (error) {
    console.error('Errore eliminazione path:', error);
    throw error;
  }
};

/**
 * Ottieni il path di default
 */
export const getDefaultPath = async () => {
  try {
    const paths = await loadPaths();
    return paths.find(p => p.isDefault) || paths[0] || null;
  } catch (error) {
    console.error('Errore caricamento default path:', error);
    return null;
  }
};

/**
 * Imposta un path come default
 */
export const setDefaultPath = async (id) => {
  try {
    const paths = await loadPaths();
    
    // Rimuovi default da tutti
    const updated = paths.map(p => ({
      ...p,
      isDefault: p.id === id,
      updatedAt: p.id === id ? new Date().toISOString() : p.updatedAt,
    }));
    
    await AsyncStorage.setItem(PATHS_KEY, JSON.stringify(updated));
    console.log('Default path impostato:', id);
    return true;
  } catch (error) {
    console.error('Errore set default path:', error);
    throw error;
  }
};

/**
 * Ottieni un path per ID
 */
export const getPathById = async (id) => {
  try {
    const paths = await loadPaths();
    return paths.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Errore get path by id:', error);
    return null;
  }
};

/**
 * Crea un path di default iniziale
 */
export const createDefaultPath = async () => {
  const defaultPath = {
    name: 'Percorso Principale',
    emoji: '🏠→🏢',
    steps: AVAILABLE_STEPS.map(step => ({
      ...step,
      enabled: true,
    })),
    isDefault: true,
  };
  
  return await savePath(defaultPath);
};

/**
 * Reset completo dei paths (per debug)
 */
export const resetPaths = async () => {
  try {
    await AsyncStorage.removeItem(PATHS_KEY);
    await AsyncStorage.removeItem(SETUP_DONE_KEY);
    console.log('Paths resettati');
    return true;
  } catch (error) {
    console.error('Errore reset paths:', error);
    return false;
  }
};

// jest.setup.js
import 'react-native-gesture-handler/jestSetup';

// Setup Jest globals
global.jest = require('jest');

// Mock AsyncStorage
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock SQLite
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(() => ({ lastInsertRowId: 1, changes: 1 })),
    getAllSync: jest.fn(() => []),
    getFirstSync: jest.fn(() => null),
  })),
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock Vector Icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock Expo modules
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(() => Promise.resolve()),
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-constants', () => ({
  default: {
    appOwnership: 'expo',
  },
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
}));

// Mock React Native components and modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Mock problematic components
  RN.NativeModules = {
    ...RN.NativeModules,
    DevMenu: {
      show: jest.fn(),
      reload: jest.fn(),
    },
    SettingsManager: {
      settings: {
        AppleLocale: 'en_US',
        AppleLanguages: ['en'],
      },
    },
    I18nManager: {
      allowRTL: jest.fn(),
      forceRTL: jest.fn(),
      swapLeftAndRightInRTL: jest.fn(),
      isRTL: false,
    },
  };

  // Mock TurboModuleRegistry
  RN.TurboModuleRegistry = {
    ...RN.TurboModuleRegistry,
    getEnforcing: jest.fn(() => ({
      show: jest.fn(),
      reload: jest.fn(),
    })),
  };

  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

// Global test utilities
global.mockAlert = jest.fn();
global.window = global.window || {};
global.window.alert = global.mockAlert;
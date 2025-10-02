// jest.setup.js
// Minimal setup for Jest with React Native Testing Library

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
};

// Mock SQLite
const mockDb = {
  execSync: jest.fn(),
  runSync: jest.fn(() => ({ lastInsertRowId: 1, changes: 1 })),
  getAllSync: jest.fn(() => []),
  getFirstSync: jest.fn(() => null),
};

// Mock React Native modules
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => mockDb),
}));

// Make mocks available globally for test files
global.mockAsyncStorage = mockAsyncStorage;
global.mockDb = mockDb;

// Mock console methods to avoid noise
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
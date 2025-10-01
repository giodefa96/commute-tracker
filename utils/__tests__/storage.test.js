import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Storage from '../storage';

// Mock AsyncStorage is already set up in jest.setup.js

describe('Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('loadCommutes', () => {
    it('loads commutes from storage successfully', async () => {
      const mockCommutes = [
        { id: 1, date: '2025-01-15', departureTime: '08:00' },
        { id: 2, date: '2025-01-16', departureTime: '09:00' }
      ];

      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockCommutes));

      const result = await Storage.loadCommutes();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@commutes');
      expect(result).toEqual(mockCommutes);
    });

    it('returns empty array when no data exists', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await Storage.loadCommutes();

      expect(result).toEqual([]);
    });

    it('returns empty array when storage is empty string', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('');

      const result = await Storage.loadCommutes();

      expect(result).toEqual([]);
    });

    it('handles JSON parse errors gracefully', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('invalid json');
      
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await Storage.loadCommutes();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading commutes:',
        expect.any(SyntaxError)
      );

      consoleSpy.mockRestore();
    });

    it('handles AsyncStorage errors gracefully', async () => {
      const error = new Error('Storage error');
      AsyncStorage.getItem.mockRejectedValueOnce(error);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await Storage.loadCommutes();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error loading commutes:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('saveCommutes', () => {
    it('saves commutes to storage successfully', async () => {
      const mockCommutes = [
        { id: 1, date: '2025-01-15', departureTime: '08:00' },
        { id: 2, date: '2025-01-16', departureTime: '09:00' }
      ];

      await Storage.saveCommutes(mockCommutes);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@commutes',
        JSON.stringify(mockCommutes)
      );
    });

    it('saves empty array', async () => {
      await Storage.saveCommutes([]);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@commutes',
        JSON.stringify([])
      );
    });

    it('handles save errors gracefully', async () => {
      const error = new Error('Save error');
      AsyncStorage.setItem.mockRejectedValueOnce(error);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await Storage.saveCommutes([{ id: 1 }]);

      expect(consoleSpy).toHaveBeenCalledWith('Error saving commutes:', error);

      consoleSpy.mockRestore();
    });

    it('handles large data sets', async () => {
      const largeCommutes = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        date: '2025-01-15',
        departureTime: '08:00'
      }));

      await Storage.saveCommutes(largeCommutes);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@commutes',
        JSON.stringify(largeCommutes)
      );
    });
  });

  describe('getAllData', () => {
    it('retrieves and logs all data', async () => {
      const mockData = JSON.stringify([{ id: 1, date: '2025-01-15' }]);
      AsyncStorage.getItem.mockResolvedValueOnce(mockData);
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await Storage.getAllData();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@commutes');
      expect(result).toBe(mockData);
      expect(consoleSpy).toHaveBeenCalledWith('=== DATI SALVATI ===');
      expect(consoleSpy).toHaveBeenCalledWith(mockData);

      consoleSpy.mockRestore();
    });

    it('handles null data', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await Storage.getAllData();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(null);

      consoleSpy.mockRestore();
    });

    it('handles errors gracefully', async () => {
      const error = new Error('Get data error');
      AsyncStorage.getItem.mockRejectedValueOnce(error);
      
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await Storage.getAllData();

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error getting all data:',
        error
      );

      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearData', () => {
    it('clears all commute data', async () => {
      await Storage.clearData();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@commutes');
    });

    it('handles clear errors gracefully', async () => {
      const error = new Error('Clear error');
      AsyncStorage.removeItem.mockRejectedValueOnce(error);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await Storage.clearData();

      expect(consoleSpy).toHaveBeenCalledWith('Error clearing data:', error);

      consoleSpy.mockRestore();
    });
  });
});
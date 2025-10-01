import * as Database from '../database';

// Mock expo-sqlite
const mockDb = {
  execSync: jest.fn(),
  runSync: jest.fn(() => ({ lastInsertRowId: 1, changes: 1 })),
  getAllSync: jest.fn(() => []),
  getFirstSync: jest.fn(() => null),
};

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => mockDb),
}));

describe('Database Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the database instance
    require('../database').__resetDatabase?.();
  });

  describe('initDatabase', () => {
    it('creates database and commutes table', () => {
      Database.initDatabase();

      expect(mockDb.execSync).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS commutes')
      );
    });

    it('handles database initialization errors', () => {
      mockDb.execSync.mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      expect(() => Database.initDatabase()).toThrow('Database error');
    });
  });

  describe('saveCommute', () => {
    const mockCommute = {
      date: '2025-01-15',
      departureTime: '08:00',
      arrivalPlatformTime: '08:15',
      arrivalBusTime: '08:20',
      arrivalDestinationTime: '08:45',
      finalArrivalTime: '09:00',
      isOutbound: true,
      duration: '1h 0m',
      transport: 'Treno + Bus',
      notes: 'Test commute'
    };

    it('saves commute successfully', () => {
      const result = Database.saveCommute(mockCommute);

      expect(mockDb.runSync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO commutes'),
        expect.arrayContaining([
          mockCommute.date,
          mockCommute.departureTime,
          mockCommute.arrivalPlatformTime,
          mockCommute.arrivalBusTime,
          mockCommute.arrivalDestinationTime,
          mockCommute.finalArrivalTime,
          1, // isOutbound converted to integer
          mockCommute.duration,
          mockCommute.transport,
          mockCommute.notes
        ])
      );

      expect(result).toEqual({ lastInsertRowId: 1, changes: 1 });
    });

    it('handles save errors', () => {
      mockDb.runSync.mockImplementationOnce(() => {
        throw new Error('Save error');
      });

      expect(() => Database.saveCommute(mockCommute)).toThrow('Save error');
    });

    it('converts boolean isOutbound to integer', () => {
      const commuteWithFalseOutbound = { ...mockCommute, isOutbound: false };
      Database.saveCommute(commuteWithFalseOutbound);

      expect(mockDb.runSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([0]) // false should be converted to 0
      );
    });
  });

  describe('getCommutes', () => {
    const mockCommuteData = [
      {
        id: 1,
        date: '2025-01-15',
        departureTime: '08:00',
        finalArrivalTime: '09:00',
        isOutbound: 1,
        duration: '1h 0m'
      },
      {
        id: 2,
        date: '2025-01-16',
        departureTime: '17:30',
        finalArrivalTime: '18:30',
        isOutbound: 0,
        duration: '1h 0m'
      }
    ];

    it('retrieves all commutes', () => {
      mockDb.getAllSync.mockReturnValueOnce(mockCommuteData);

      const commutes = Database.getCommutes();

      expect(mockDb.getAllSync).toHaveBeenCalledWith(
        'SELECT * FROM commutes ORDER BY date DESC, departureTime DESC'
      );
      expect(commutes).toEqual(mockCommuteData);
    });

    it('returns empty array when no commutes found', () => {
      mockDb.getAllSync.mockReturnValueOnce([]);

      const commutes = Database.getCommutes();

      expect(commutes).toEqual([]);
    });

    it('handles database query errors', () => {
      mockDb.getAllSync.mockImplementationOnce(() => {
        throw new Error('Query error');
      });

      expect(() => Database.getCommutes()).toThrow('Query error');
    });
  });

  describe('deleteCommute', () => {
    it('deletes commute by id', () => {
      const result = Database.deleteCommute(1);

      expect(mockDb.runSync).toHaveBeenCalledWith(
        'DELETE FROM commutes WHERE id = ?',
        [1]
      );
      expect(result).toEqual({ lastInsertRowId: 1, changes: 1 });
    });

    it('handles delete errors', () => {
      mockDb.runSync.mockImplementationOnce(() => {
        throw new Error('Delete error');
      });

      expect(() => Database.deleteCommute(1)).toThrow('Delete error');
    });
  });

  describe('getCommutesByPeriod', () => {
    it('gets commutes for today', () => {
      const today = '2025-01-15';
      Database.getCommutesByPeriod('today');

      expect(mockDb.getAllSync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE date = ?'),
        expect.arrayContaining([expect.any(String)])
      );
    });

    it('gets commutes for current week', () => {
      Database.getCommutesByPeriod('week');

      expect(mockDb.getAllSync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE date BETWEEN ? AND ?'),
        expect.any(Array)
      );
    });

    it('gets commutes for current month', () => {
      Database.getCommutesByPeriod('month');

      expect(mockDb.getAllSync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE date LIKE ?'),
        expect.any(Array)
      );
    });

    it('gets commutes for current year', () => {
      Database.getCommutesByPeriod('year');

      expect(mockDb.getAllSync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE date LIKE ?'),
        expect.any(Array)
      );
    });

    it('gets all commutes for unknown period', () => {
      Database.getCommutesByPeriod('unknown');

      expect(mockDb.getAllSync).toHaveBeenCalledWith(
        'SELECT * FROM commutes ORDER BY date DESC, departureTime DESC'
      );
    });
  });
});
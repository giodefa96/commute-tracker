// Simple test to verify the database module loads and has expected exports
describe('Database Module', () => {
  it('exports expected functions', () => {
    const Database = require('../database');
    
    expect(typeof Database.initDatabase).toBe('function');
    expect(typeof Database.saveCommute).toBe('function');
    expect(typeof Database.loadCommutes).toBe('function');
    expect(typeof Database.deleteCommute).toBe('function');
    expect(typeof Database.loadTodayCommutes).toBe('function');
    expect(typeof Database.loadWeekCommutes).toBe('function');
    expect(typeof Database.loadMonthCommutes).toBe('function');
    expect(typeof Database.loadYearCommutes).toBe('function');
    expect(typeof Database.getAllData).toBe('function');
    expect(typeof Database.clearAllData).toBe('function');
  });

  it('has working error handling for database functions', () => {
    const Database = require('../database');
    
    // These functions should return empty arrays when database fails
    expect(Database.loadCommutes()).toEqual([]);
    expect(Database.loadTodayCommutes()).toEqual([]);
    expect(Database.loadWeekCommutes()).toEqual([]);
    expect(Database.loadMonthCommutes()).toEqual([]);
    expect(Database.loadYearCommutes()).toEqual([]);
    expect(Database.getAllData()).toEqual([]);
  });
});
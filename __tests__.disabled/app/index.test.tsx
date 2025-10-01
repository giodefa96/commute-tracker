import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import Index from '../index';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useFocusEffect: jest.fn(),
}));

// Mock database utilities
jest.mock('../../utils/database', () => ({
  deleteCommute: jest.fn(),
  getAllData: jest.fn(),
  loadCommutes: jest.fn(() => []),
  loadMonthCommutes: jest.fn(() => []),
  loadTodayCommutes: jest.fn(() => []),
  loadWeekCommutes: jest.fn(() => []),
  loadYearCommutes: jest.fn(() => []),
}));

// Mock components
jest.mock('../../components/CommuteList', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return function MockCommuteList({ commutes, onDelete }: any) {
    return (
      <View testID="commute-list">
        <Text>{commutes.length} commutes</Text>
        {commutes.map((commute: any, index: number) => (
          <TouchableOpacity
            key={commute.id || index}
            testID={`delete-button-${commute.id}`}
            onPress={() => onDelete(commute.id)}
          >
            <Text>Delete {commute.id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
});

jest.mock('../../components/FilterBar', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return function MockFilterBar({ currentFilter, onFilterChange }: any) {
    const filters = ['all', 'today', 'week', 'month', 'year'];
    return (
      <View testID="filter-bar">
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            testID={`filter-${filter}`}
            onPress={() => onFilterChange(filter)}
          >
            <Text>{filter} {currentFilter === filter ? '(active)' : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
});

jest.mock('../../components/PeriodIndicator', () => {
  const { View, Text } = require('react-native');
  return function MockPeriodIndicator({ filter, count }: any) {
    return (
      <View testID="period-indicator">
        <Text>Period: {filter}, Count: {count}</Text>
      </View>
    );
  };
});

jest.mock('../../components/StatsCard', () => {
  const { View, Text } = require('react-native');
  return function MockStatsCard({ commutes }: any) {
    return (
      <View testID="stats-card">
        <Text>Stats for {commutes.length} commutes</Text>
      </View>
    );
  };
});

describe('Index Screen', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });

    // Mock useFocusEffect
    const { useFocusEffect } = require('expo-router');
    useFocusEffect.mockImplementation((callback) => {
      callback();
    });
  });

  it('renders correctly with initial state', () => {
    const { getByText, getByTestId } = render(<Index />);

    expect(getByText('📊 Commute Tracker')).toBeTruthy();
    expect(getByText('➕ Aggiungi')).toBeTruthy();
    expect(getByTestId('commute-list')).toBeTruthy();
    expect(getByTestId('filter-bar')).toBeTruthy();
  });

  it('navigates to add commute screen when add button is pressed', () => {
    const { getByText } = render(<Index />);

    const addButton = getByText('➕ Aggiungi');
    fireEvent.press(addButton);

    expect(mockPush).toHaveBeenCalledWith('/add-commute');
  });

  it('loads different data based on filter selection', async () => {
    const { loadCommutes, loadTodayCommutes, loadWeekCommutes } = require('../../utils/database');
    
    const { getByTestId } = render(<Index />);

    // Test today filter
    const todayFilter = getByTestId('filter-today');
    fireEvent.press(todayFilter);

    await waitFor(() => {
      expect(loadTodayCommutes).toHaveBeenCalled();
    });

    // Test week filter
    const weekFilter = getByTestId('filter-week');
    fireEvent.press(weekFilter);

    await waitFor(() => {
      expect(loadWeekCommutes).toHaveBeenCalled();
    });
  });

  it('handles commute deletion', async () => {
    const { deleteCommute, loadCommutes } = require('../../utils/database');
    
    const mockCommutes = [
      { id: 1, date: '2025-01-15', departureTime: '08:00' },
      { id: 2, date: '2025-01-16', departureTime: '09:00' }
    ];

    loadCommutes.mockReturnValue(mockCommutes);
    deleteCommute.mockReturnValue({ changes: 1 });

    const { getByTestId, rerender } = render(<Index />);

    // Simulate delete action
    const deleteButton = getByTestId('delete-button-1');
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(deleteCommute).toHaveBeenCalledWith(1);
    });
  });

  it('displays period indicator with correct count', () => {
    const { loadCommutes } = require('../../utils/database');
    const mockCommutes = [
      { id: 1, date: '2025-01-15' },
      { id: 2, date: '2025-01-16' }
    ];

    loadCommutes.mockReturnValue(mockCommutes);

    const { getByTestId, getByText } = render(<Index />);

    expect(getByText('Period: all, Count: 2')).toBeTruthy();
  });

  it('displays stats card with commutes data', () => {
    const { loadCommutes } = require('../../utils/database');
    const mockCommutes = [
      { id: 1, duration: '1h 30m' },
      { id: 2, duration: '1h 15m' }
    ];

    loadCommutes.mockReturnValue(mockCommutes);

    const { getByText } = render(<Index />);

    expect(getByText('Stats for 2 commutes')).toBeTruthy();
  });

  it('refreshes data when screen comes into focus', () => {
    const { loadCommutes } = require('../../utils/database');

    render(<Index />);

    expect(loadCommutes).toHaveBeenCalled();
  });

  it('handles empty commutes list', () => {
    const { loadCommutes } = require('../../utils/database');
    loadCommutes.mockReturnValue([]);

    const { getByText } = render(<Index />);

    expect(getByText('0 commutes')).toBeTruthy();
    expect(getByText('Period: all, Count: 0')).toBeTruthy();
  });

  it('calls getAllData for debugging', async () => {
    const { getAllData } = require('../../utils/database');

    render(<Index />);

    await waitFor(() => {
      expect(getAllData).toHaveBeenCalled();
    });
  });
});
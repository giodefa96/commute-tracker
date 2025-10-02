import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import AddCommute from '../add-commute';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock database utilities
jest.mock('../../utils/database', () => ({
  saveCommute: jest.fn(),
}));

// Mock CommuteForm component
jest.mock('../../components/CommuteForm', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return function MockCommuteForm({ onSave, onCancel }: any) {
    const mockCommute = {
      date: '2025-01-15',
      departureTime: '08:00',
      arrivalPlatformTime: '08:15',
      finalArrivalTime: '09:00',
      isOutbound: true,
      duration: '1h 0m'
    };

    return (
      <View testID="commute-form">
        <TouchableOpacity
          testID="save-button"
          onPress={() => onSave(mockCommute)}
        >
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="cancel-button"
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

describe('AddCommute Screen', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();
  const mockCanGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
      canGoBack: mockCanGoBack,
    });

    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<AddCommute />);

    expect(getByTestId('commute-form')).toBeTruthy();
    expect(getByTestId('save-button')).toBeTruthy();
    expect(getByTestId('cancel-button')).toBeTruthy();
  });

  it('calls onCancel and navigates back when cancel is pressed', () => {
    const { getByTestId } = render(<AddCommute />);

    const cancelButton = getByTestId('cancel-button');
    fireEvent.press(cancelButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('saves commute and navigates back when canGoBack is true', async () => {
    const { saveCommute } = require('../../utils/database');
    saveCommute.mockReturnValue(1);
    mockCanGoBack.mockReturnValue(true);

    const { getByTestId } = render(<AddCommute />);

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(saveCommute).toHaveBeenCalledWith({
        date: '2025-01-15',
        departureTime: '08:00',
        arrivalPlatformTime: '08:15',
        finalArrivalTime: '09:00',
        isOutbound: true,
        duration: '1h 0m'
      });
    });

    expect(mockCanGoBack).toHaveBeenCalled();
    expect(mockBack).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('saves commute and navigates to home when canGoBack is false', async () => {
    const { saveCommute } = require('../../utils/database');
    saveCommute.mockReturnValue(1);
    mockCanGoBack.mockReturnValue(false);

    const { getByTestId } = render(<AddCommute />);

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(saveCommute).toHaveBeenCalled();
    });

    expect(mockCanGoBack).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('handles save errors gracefully', async () => {
    const { saveCommute } = require('../../utils/database');
    const error = new Error('Database error');
    saveCommute.mockImplementation(() => {
      throw error;
    });

    // Mock alert
    global.alert = jest.fn();

    const { getByTestId } = render(<AddCommute />);

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(saveCommute).toHaveBeenCalled();
    });

    expect(global.alert).toHaveBeenCalledWith(
      'Errore durante il salvataggio: Database error'
    );
    expect(mockBack).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles unknown errors gracefully', async () => {
    const { saveCommute } = require('../../utils/database');
    saveCommute.mockImplementation(() => {
      throw 'Unknown error';
    });

    global.alert = jest.fn();

    const { getByTestId } = render(<AddCommute />);

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(saveCommute).toHaveBeenCalled();
    });

    expect(global.alert).toHaveBeenCalledWith(
      'Errore durante il salvataggio: Errore sconosciuto'
    );
  });

  it('logs navigation attempts correctly', async () => {
    const { saveCommute } = require('../../utils/database');
    saveCommute.mockReturnValue(1);
    mockCanGoBack.mockReturnValue(true);

    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(<AddCommute />);

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'AddCommute handleSave chiamato con:',
        expect.any(Object)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Commute salvato nel database con ID:',
        1
      );
      expect(consoleSpy).toHaveBeenCalledWith('Uso router.back()');
    });
  });

  it('logs cancel action correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const { getByTestId } = render(<AddCommute />);

    const cancelButton = getByTestId('cancel-button');
    fireEvent.press(cancelButton);

    expect(consoleSpy).toHaveBeenCalledWith('Annullamento premuto');
  });
});
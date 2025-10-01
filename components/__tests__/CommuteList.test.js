import { fireEvent, render } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';
import CommuteList from '../CommuteList';

// Mock the Alert module
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

describe('CommuteList', () => {
  const mockOnDelete = jest.fn();
  
  const mockCommutes = [
    {
      id: 1,
      date: '2025-01-15',
      departureTime: '08:00',
      arrivalPlatformTime: '08:15',
      arrivalBusTime: '08:20',
      arrivalDestinationTime: '08:45',
      finalArrivalTime: '09:00',
      isOutbound: 1,
      duration: '1h 0m',
      transport: 'Treno + Bus',
      notes: 'Test commute'
    },
    {
      id: 2,
      date: '2025-01-16',
      departureTime: '17:30',
      arrivalPlatformTime: '17:45',
      arrivalBusTime: '17:50',
      arrivalDestinationTime: '18:15',
      finalArrivalTime: '18:30',
      isOutbound: 0,
      duration: '1h 0m',
      transport: 'Treno + Bus',
      notes: 'Return commute'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.mockAlert.mockClear();
    // Reset Platform.OS to default
    Platform.OS = 'ios';
  });

  it('renders correctly with commutes', () => {
    const { getByText } = render(
      <CommuteList commutes={mockCommutes} onDelete={mockOnDelete} />
    );

    expect(getByText('15/01/2025')).toBeTruthy();
    expect(getByText('16/01/2025')).toBeTruthy();
    expect(getByText('08:00 → 09:00')).toBeTruthy();
    expect(getByText('17:30 → 18:30')).toBeTruthy();
  });

  it('renders empty state when no commutes', () => {
    const { getByText } = render(
      <CommuteList commutes={[]} onDelete={mockOnDelete} />
    );

    expect(getByText('Nessun commute registrato')).toBeTruthy();
  });

  it('shows delete confirmation on mobile platforms', async () => {
    Platform.OS = 'ios';
    
    const { getAllByTestId } = render(
      <CommuteList commutes={mockCommutes} onDelete={mockOnDelete} />
    );

    const deleteButtons = getAllByTestId('delete-button');
    fireEvent.press(deleteButtons[0]);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Elimina',
      'Vuoi eliminare questo commute?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Annulla', style: 'cancel' }),
        expect.objectContaining({ text: 'Elimina', style: 'destructive' })
      ])
    );
  });

  it('shows delete confirmation on web platform', async () => {
    Platform.OS = 'web';
    global.window.confirm = jest.fn(() => true);
    
    const { getAllByTestId } = render(
      <CommuteList commutes={mockCommutes} onDelete={mockOnDelete} />
    );

    const deleteButtons = getAllByTestId('delete-button');
    fireEvent.press(deleteButtons[0]);

    expect(global.window.confirm).toHaveBeenCalledWith('Vuoi eliminare questo commute?');
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('cancels delete when user dismisses confirmation', async () => {
    Platform.OS = 'web';
    global.window.confirm = jest.fn(() => false);
    
    const { getAllByTestId } = render(
      <CommuteList commutes={mockCommutes} onDelete={mockOnDelete} />
    );

    const deleteButtons = getAllByTestId('delete-button');
    fireEvent.press(deleteButtons[0]);

    expect(global.window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('formats dates correctly', () => {
    const { getByText } = render(
      <CommuteList commutes={mockCommutes} onDelete={mockOnDelete} />
    );

    // Test Italian date format
    expect(getByText('15/01/2025')).toBeTruthy();
    expect(getByText('16/01/2025')).toBeTruthy();
  });

  it('displays direction indicators correctly', () => {
    const { getByText } = render(
      <CommuteList commutes={mockCommutes} onDelete={mockOnDelete} />
    );

    expect(getByText('🚀 Andata')).toBeTruthy();
    expect(getByText('🏠 Ritorno')).toBeTruthy();
  });

  it('shows duration and transport information', () => {
    const { getByText } = render(
      <CommuteList commutes={mockCommutes} onDelete={mockOnDelete} />
    );

    expect(getByText('Durata: 1h 0m')).toBeTruthy();
    expect(getByText('Mezzo: Treno + Bus')).toBeTruthy();
  });

  it('displays notes when present', () => {
    const { getByText } = render(
      <CommuteList commutes={mockCommutes} onDelete={mockOnDelete} />
    );

    expect(getByText('Test commute')).toBeTruthy();
    expect(getByText('Return commute')).toBeTruthy();
  });

  it('handles missing optional fields gracefully', () => {
    const incompleteCommute = [{
      id: 3,
      date: '2025-01-17',
      departureTime: '08:00',
      finalArrivalTime: '09:00',
      isOutbound: 1
    }];

    const { getByText } = render(
      <CommuteList commutes={incompleteCommute} onDelete={mockOnDelete} />
    );

    expect(getByText('17/01/2025')).toBeTruthy();
    expect(getByText('08:00 → 09:00')).toBeTruthy();
  });
});
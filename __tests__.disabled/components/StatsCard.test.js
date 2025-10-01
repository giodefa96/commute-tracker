import { render } from '@testing-library/react-native';
import StatsCard from '../StatsCard';

describe('StatsCard', () => {
  const mockCommutes = [
    {
      id: 1,
      duration: '1h 30m',
      date: '2025-01-15'
    },
    {
      id: 2,
      duration: '1h 15m',
      date: '2025-01-16'
    },
    {
      id: 3,
      duration: '1h 45m',
      date: '2025-01-17'
    }
  ];

  it('renders correctly with commutes data', () => {
    const { getByText } = render(
      <StatsCard commutes={mockCommutes} />
    );

    expect(getByText('3')).toBeTruthy();
    expect(getByText('Totale viaggi')).toBeTruthy();
    expect(getByText('Tempo medio')).toBeTruthy();
  });

  it('calculates average time correctly', () => {
    const { getByText } = render(
      <StatsCard commutes={mockCommutes} />
    );

    // Average of 1h 30m (90 min), 1h 15m (75 min), 1h 45m (105 min) = 90 min = 1h 30m
    expect(getByText('1h 30m')).toBeTruthy();
  });

  it('handles single commute correctly', () => {
    const singleCommute = [{ id: 1, duration: '2h 15m' }];
    
    const { getByText } = render(
      <StatsCard commutes={singleCommute} />
    );

    expect(getByText('1')).toBeTruthy();
    expect(getByText('2h 15m')).toBeTruthy();
  });

  it('handles different duration formats', () => {
    const commutesWithVariedDurations = [
      { id: 1, duration: '0h 45m' },
      { id: 2, duration: '2h 0m' },
      { id: 3, duration: '1h 15m' }
    ];
    
    const { getByText } = render(
      <StatsCard commutes={commutesWithVariedDurations} />
    );

    // Average of 45min, 120min, 75min = 80min = 1h 20m
    expect(getByText('1h 20m')).toBeTruthy();
  });

  it('returns null when no commutes', () => {
    const { queryByText } = render(
      <StatsCard commutes={[]} />
    );

    expect(queryByText('Totale viaggi')).toBeNull();
    expect(queryByText('Tempo medio')).toBeNull();
  });

  it('handles edge case with zero minutes', () => {
    const commuteWithZeroMinutes = [
      { id: 1, duration: '1h 0m' },
      { id: 2, duration: '2h 0m' }
    ];
    
    const { getByText } = render(
      <StatsCard commutes={commuteWithZeroMinutes} />
    );

    // Average of 60min and 120min = 90min = 1h 30m
    expect(getByText('1h 30m')).toBeTruthy();
  });

  it('rounds average time correctly', () => {
    const commutesForRounding = [
      { id: 1, duration: '1h 0m' },  // 60 min
      { id: 2, duration: '1h 1m' }   // 61 min
    ];
    
    const { getByText } = render(
      <StatsCard commutes={commutesForRounding} />
    );

    // Average of 60.5 min should round to 61 min = 1h 1m
    expect(getByText('1h 1m')).toBeTruthy();
  });
});
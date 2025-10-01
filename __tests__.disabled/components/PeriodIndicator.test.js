import { render } from '@testing-library/react-native';
import PeriodIndicator from '../PeriodIndicator';

// Mock Date to ensure consistent testing
const mockDate = new Date('2025-01-15T10:00:00Z');
global.Date = jest.fn(() => mockDate);
global.Date.UTC = Date.UTC;
global.Date.parse = Date.parse;
global.Date.now = Date.now;

describe('PeriodIndicator', () => {
  beforeEach(() => {
    // Reset the mock date before each test
    jest.clearAllMocks();
  });

  it('renders today filter correctly', () => {
    const { getByText } = render(
      <PeriodIndicator filter="today" count={5} />
    );

    expect(getByText(/Oggi/)).toBeTruthy();
    expect(getByText('5 commute trovati')).toBeTruthy();
  });

  it('renders week filter correctly', () => {
    const { getByText } = render(
      <PeriodIndicator filter="week" count={12} />
    );

    expect(getByText('Questa settimana')).toBeTruthy();
    expect(getByText('12 commute trovati')).toBeTruthy();
  });

  it('renders month filter correctly', () => {
    const { getByText } = render(
      <PeriodIndicator filter="month" count={30} />
    );

    expect(getByText(/gennaio 2025/)).toBeTruthy();
    expect(getByText('30 commute trovati')).toBeTruthy();
  });

  it('renders year filter correctly', () => {
    const { getByText } = render(
      <PeriodIndicator filter="year" count={150} />
    );

    expect(getByText('Anno 2025')).toBeTruthy();
    expect(getByText('150 commute trovati')).toBeTruthy();
  });

  it('renders all filter correctly', () => {
    const { getByText } = render(
      <PeriodIndicator filter="all" count={200} />
    );

    expect(getByText('Tutti i commute')).toBeTruthy();
    expect(getByText('200 commute trovati')).toBeTruthy();
  });

  it('renders unknown filter as default', () => {
    const { getByText } = render(
      <PeriodIndicator filter="unknown" count={10} />
    );

    expect(getByText('Tutti i commute')).toBeTruthy();
    expect(getByText('10 commute trovati')).toBeTruthy();
  });

  it('handles singular count correctly', () => {
    const { getByText } = render(
      <PeriodIndicator filter="today" count={1} />
    );

    expect(getByText('1 commute trovato')).toBeTruthy();
  });

  it('returns null when count is zero', () => {
    const { queryByText } = render(
      <PeriodIndicator filter="today" count={0} />
    );

    expect(queryByText(/commute/)).toBeNull();
    expect(queryByText(/Oggi/)).toBeNull();
  });

  it('handles large numbers correctly', () => {
    const { getByText } = render(
      <PeriodIndicator filter="all" count={1000} />
    );

    expect(getByText('1000 commute trovati')).toBeTruthy();
  });

  it('formats Italian date correctly for month', () => {
    const { getByText } = render(
      <PeriodIndicator filter="month" count={25} />
    );

    // Should show Italian month name
    expect(getByText(/gennaio/)).toBeTruthy();
  });
});
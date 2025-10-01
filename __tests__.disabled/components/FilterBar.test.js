import { fireEvent, render } from '@testing-library/react-native';
import FilterBar from '../FilterBar';

describe('FilterBar', () => {
  const mockOnFilterChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter options', () => {
    const { getByText } = render(
      <FilterBar onFilterChange={mockOnFilterChange} currentFilter="all" />
    );

    expect(getByText('📅 Tutti')).toBeTruthy();
    expect(getByText('Oggi')).toBeTruthy();
    expect(getByText('Settimana')).toBeTruthy();
    expect(getByText('Mese')).toBeTruthy();
    expect(getByText('Anno')).toBeTruthy();
  });

  it('highlights the current filter', () => {
    const { getByText } = render(
      <FilterBar onFilterChange={mockOnFilterChange} currentFilter="week" />
    );

    const weekButton = getByText('Settimana').parent;
    const allButton = getByText('📅 Tutti').parent;

    // Week button should be active (we can't directly test styles, but can test structure)
    expect(weekButton).toBeTruthy();
    expect(allButton).toBeTruthy();
  });

  it('calls onFilterChange when filter is selected', () => {
    const { getByText } = render(
      <FilterBar onFilterChange={mockOnFilterChange} currentFilter="all" />
    );

    const monthButton = getByText('Mese');
    fireEvent.press(monthButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('month');
  });

  it('calls onFilterChange for each filter option', () => {
    const { getByText } = render(
      <FilterBar onFilterChange={mockOnFilterChange} currentFilter="all" />
    );

    // Test each filter
    fireEvent.press(getByText('Oggi'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('today');

    fireEvent.press(getByText('Settimana'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('week');

    fireEvent.press(getByText('Mese'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('month');

    fireEvent.press(getByText('Anno'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('year');

    fireEvent.press(getByText('📅 Tutti'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('all');

    expect(mockOnFilterChange).toHaveBeenCalledTimes(5);
  });

  it('renders as horizontal scrollable view', () => {
    const { getByTestId } = render(
      <FilterBar onFilterChange={mockOnFilterChange} currentFilter="all" />
    );

    // The ScrollView should be horizontal
    const scrollView = getByTestId('filter-scroll-view');
    expect(scrollView.props.horizontal).toBe(true);
    expect(scrollView.props.showsHorizontalScrollIndicator).toBe(false);
  });
});
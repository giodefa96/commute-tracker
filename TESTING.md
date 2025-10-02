# Testing Guide for Commute Tracker

This project includes a comprehensive testing suite using Jest and React Native Testing Library. This document explains how to run tests and integrate them into your CI/CD pipeline.

## Test Structure

```
├── components/
│   ├── __tests__/
│   │   ├── CommuteForm.test.js
│   │   ├── CommuteList.test.js
│   │   ├── FilterBar.test.js
│   │   ├── PeriodIndicator.test.js
│   │   └── StatsCard.test.js
├── utils/
│   ├── __tests__/
│   │   ├── database.test.js
│   │   └── storage.test.js
├── app/
│   ├── __tests__/
│   │   ├── index.test.tsx
│   │   └── add-commute.test.tsx
├── jest.config.js
├── jest.setup.js
└── .github/workflows/
    ├── ci.yml
    └── test.yml
```

## Available Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI (no watch, with coverage)
npm run test:ci
```

## Test Categories

### Component Tests
Tests for React Native components including:
- **CommuteForm**: Form validation, user interactions, date/time pickers
- **CommuteList**: List rendering, delete functionality, platform differences
- **FilterBar**: Filter selection and state management
- **PeriodIndicator**: Date formatting and period calculations
- **StatsCard**: Statistics calculation and display

### Utility Tests
Tests for utility functions:
- **Database**: SQLite operations, CRUD operations, error handling
- **Storage**: AsyncStorage operations, data persistence, error recovery

### Screen Tests
Tests for main application screens:
- **Index**: Main screen navigation, data loading, filtering
- **AddCommute**: Form submission, navigation, error handling

## Running Specific Test Suites

```bash
# Run only component tests
npm test -- --testPathPattern="components/__tests__"

# Run only utility tests
npm test -- --testPathPattern="utils/__tests__"

# Run only screen tests
npm test -- --testPathPattern="app/__tests__"

# Run tests for a specific file
npm test -- CommuteForm.test.js

# Run tests with verbose output
npm test -- --verbose
```

## Test Coverage

The project is configured to collect coverage from:
- `components/**/*.{js,jsx,ts,tsx}`
- `utils/**/*.{js,jsx,ts,tsx}`
- `app/**/*.{js,jsx,ts,tsx}`

Coverage reports are generated in multiple formats:
- **Text**: Console output
- **LCOV**: For CI integration
- **HTML**: Detailed web report in `coverage/` directory

### Coverage Thresholds
Currently no specific thresholds are set, but you can add them to `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

## CI/CD Integration

### GitHub Actions Workflows

The project includes two GitHub Actions workflows:

#### 1. Main CI Pipeline (`.github/workflows/ci.yml`)
- Runs on push to `main` and `develop` branches
- Includes multiple jobs:
  - **Test**: Runs full test suite on Node.js 18.x and 20.x
  - **Security Audit**: Checks for vulnerabilities
  - **Build**: Builds the project for web
  - **Type Check**: TypeScript compilation check
  - **Test Coverage**: Coverage reporting for PRs

#### 2. Test-specific Pipeline (`.github/workflows/test.yml`)
- Runs on code changes
- Separate jobs for different test categories
- Provides detailed test summaries

### Setting up CI for your repository

1. **Enable GitHub Actions** in your repository settings
2. **Add secrets** if needed (currently none required)
3. **Configure branch protection** rules to require tests to pass
4. **Optional**: Add Codecov integration for coverage reporting

## Mocking Strategy

The test setup includes comprehensive mocking for:

### React Native Modules
- **AsyncStorage**: For data persistence testing
- **SQLite**: For database operation testing
- **Platform**: For cross-platform behavior testing
- **Alert**: For user interaction testing

### Expo Modules
- **expo-router**: For navigation testing
- **expo-sqlite**: For database testing
- **expo-font**: For font loading
- **expo-splash-screen**: For app initialization

### External Libraries
- **DateTimePicker**: For date/time selection
- **Vector Icons**: For icon rendering
- **Gesture Handler**: For touch interactions

## Writing New Tests

### Component Test Template

```javascript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<YourComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('handles user interaction', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = render(
      <YourComponent onPress={mockCallback} />
    );
    
    fireEvent.press(getByTestId('button'));
    expect(mockCallback).toHaveBeenCalled();
  });
});
```

### Utility Test Template

```javascript
import * as YourUtility from '../yourUtility';

describe('YourUtility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('performs expected operation', () => {
    const result = YourUtility.someFunction('input');
    expect(result).toBe('expected output');
  });

  it('handles errors gracefully', () => {
    expect(() => YourUtility.someFunction(null)).toThrow();
  });
});
```

## Best Practices

1. **Test IDs**: Use `testID` props for reliable element selection
2. **Mock External Dependencies**: Always mock external API calls and native modules
3. **Clear Mocks**: Use `jest.clearAllMocks()` in `beforeEach`
4. **Async Testing**: Use `waitFor` for asynchronous operations
5. **Error Testing**: Test both success and error scenarios
6. **Platform Testing**: Test platform-specific behavior when applicable

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Check mock setup in `jest.setup.js`
2. **React Native component errors**: Ensure proper mocking of native modules
3. **Async/await issues**: Use `waitFor` from testing library
4. **Platform-specific tests**: Mock `Platform.OS` appropriately

### Debug Mode

Run tests with additional debugging:

```bash
# Verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="specific test" --verbose

# Debug with console output
npm test -- --silent=false
```

## Contributing

When adding new features:
1. Write tests for new components and utilities
2. Ensure all tests pass before submitting PR
3. Maintain or improve code coverage
4. Update this documentation if adding new test patterns
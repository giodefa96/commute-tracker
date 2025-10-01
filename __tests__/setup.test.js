// Simple smoke test
describe('Jest Setup', () => {
  it('should be able to run basic tests', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to Jest globals', () => {
    expect(typeof jest).toBe('object');
    expect(typeof expect).toBe('function');
    expect(typeof describe).toBe('function');
    expect(typeof it).toBe('function');
  });
});
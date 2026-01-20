/**
 * Jest Setup File
 * Global test configuration and mocks
 */

import '@testing-library/jest-dom';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.alert
global.alert = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock environment variables
process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:5000';

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  fetch.mockClear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

// Global test utilities
global.testUtils = {
  // Helper to create mock session data
  createMockSession: (overrides = {}) => ({
    id: 'test-session-id',
    sessionName: 'Test Session',
    lastMessage: 'Test message',
    privacy_settings: {
      is_locked: false,
      auto_delete_after: null,
      expires_at: null
    },
    ...overrides
  }),

  // Helper to create mock API responses
  createMockApiResponse: (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  }),

  // Helper to wait for async operations
  waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))
};
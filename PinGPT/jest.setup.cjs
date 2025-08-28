// Jest setup file for Chrome extension testing
// Setup global test environment

// Mock Chrome APIs
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    onInstalled: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn(),
    lastError: null
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    },
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    executeScript: jest.fn()
  },
  scripting: {
    executeScript: jest.fn()
  }
};

// Mock fetch for any network requests
global.fetch = jest.fn();

// Mock URL constructor
global.URL = jest.fn();

// Mock Date for consistent timestamps in tests
const mockDate = new Date('2023-01-01T00:00:00.000Z');
global.Date = jest.fn(() => mockDate);
global.Date.now = jest.fn(() => mockDate.getTime());

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn()
};
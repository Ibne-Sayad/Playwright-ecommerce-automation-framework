export const STORAGE_STATE_PATH = 'storageState.json';

export const DEFAULT_BASE_URL = 'https://automationexercise.com';

export const DEFAULT_TEST_TIMEOUT = 60_000;

export const DEFAULT_VIEWPORT = {
  width: 1440,
  height: 900
};

export const PROJECT_NAMES = {
  chromium: 'chromium',
  firefox: 'firefox',
  webkit: 'webkit',
  mobileChrome: 'mobile-chrome'
} as const;

export const TEST_TAGS = {
  smoke: '@smoke',
  regression: '@regression',
  sanity: '@sanity'
} as const;

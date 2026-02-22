import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright' as any,
      instances: [
        { browser: 'chromium' }, // This replaces the old 'name' property
      ],
      headless: true,
    },
  },
});

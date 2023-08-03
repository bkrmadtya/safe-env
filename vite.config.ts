import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'Test suites for "safe-env"',
    include: ['tests/**/*.test.ts'],
  },
});

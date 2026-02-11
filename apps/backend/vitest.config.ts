import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/unit/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/**',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.config.ts',
        '**/index.ts',
      ],
    },
    include: ['src/tests/unit/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['src/tests/e2e/**', 'src/tests/api/**', 'node_modules', 'dist'],
  },
});

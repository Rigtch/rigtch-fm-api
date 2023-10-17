import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/migrations/**',
        '**/types/**',
        '**/constants/**',
        '**/tests/**',
        '**/index.ts',
        '**/main.ts',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.d.ts',
        '**/*.entity.ts',
        '**/*.module.ts',
        '**/*.schema.ts',
        '**/*.mock.ts',
        '**/*.enum.ts',
        '**/*.dto.ts',
        '**/*.svg.*',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.cjs',
        '**/*.mjs',
      ],
      all: true,
    },
  },
  resolve: {
    alias: {
      '~': './src',
      '@modules': './src/modules',
      '@common': './src/common',
      '@config': './src/config',
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})

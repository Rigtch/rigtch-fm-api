module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': 'typescript',
    settings: {
      'import/resolver': {
        node: {
          paths: ['~/', '@lib/common', '@lib/utils'],
          extensions: ['.js', '.ts'],
        },
        alias: {
          map: [
            ['~', './'],
            ['@lib/common', './libs/common/src'],
            ['@lib/utils', './libs/utils/src'],
            ['@app/auth', './apps/auth/src'],
            ['@app/statistics', './apps/statistics/src'],
            ['@app/player', './apps/player/src'],
          ],
          extensions: ['.ts', '.js'],
        },
      },
    },
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'eslint-plugin-import-helpers',
    'nestjs',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:nestjs/recommended',
    'plugin:eslint-comments/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        'sonarjs/no-duplicate-string': 'off',
      },
    },
  ],
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    'README.md',
    'webpack.config.js',
    'stryker.conf.mjs',
  ],
  rules: {
    'prettier/prettier': 'warn',
    'prefer-const': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
      },
    ],
    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          e: false,
        },
      },
    ],
  },
}

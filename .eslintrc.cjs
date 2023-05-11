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
          paths: [
            '~/',
            '@modules/adapter',
            '@modules/app',
            '@modules/auth',
            '@modules/player',
            '@modules/statistics',
            '@common/dtos',
            '@common/mocks',
            '@common/types',
          ],
          extensions: ['.js', '.ts'],
        },
        alias: {
          map: [
            ['~', './'],
            ['@modules/adapter', './src/modules/adapter'],
            ['@modules/app', './src/modules/app'],
            ['@modules/auth', './src/modules/auth'],
            ['@modules/player', './src/modules/player'],
            ['@modules/statistics', './src/modules/statistics'],
            ['@common/dtos', './src/common/dtos'],
            ['@common/mocks', './src/common/mocks'],
            ['@common/types', './src/common/types'],
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
      files: ['*.spec.ts', '*.mock.ts'],
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
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],
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

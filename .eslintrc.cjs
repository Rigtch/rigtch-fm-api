module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/parsers': '@typescript-eslint/parser',
    'import/resolver': {
      node: {
        project: './tsconfig.json',
        paths: ['@modules', '@common', '@config'],
        extensions: ['.js', '.ts'],
      },
      typescript: {
        project: './tsconfig.json',
        alwaysTryTypes: true,
      },
      alias: {
        map: [
          ['@modules', './src/modules'],
          ['@common', './src/common'],
          ['@config', './src/config'],
        ],
        extensions: ['.ts', '.js'],
      },
    },
    'import/ignore': ['node_modules'],
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'nestjs',
    'eslint-plugin-import-helpers',
    'prettier',
  ],
  extends: [
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:nestjs/recommended',
    'plugin:eslint-comments/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.spec.ts', '*.mock.ts'],
      extends: ['plugin:vitest/recommended'],
      rules: {
        'sonarjs/no-duplicate-string': 'off',
      },
    },
  ],
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    'README.md',
    '.eslintrc.cjs',
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
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
      },
    ],
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          e: false,
        },
        allowList: {
          param: true,
          params: true,
          Param: true,
          Params: true,
          args: true,
          env: true,
        },
      },
    ],
  },
}

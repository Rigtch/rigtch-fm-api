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
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      node: {
        project: './tsconfig.json',
        paths: ['@modules', '@common', '@config', '@migrations'],
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
          ['@migrations', './src/migrations'],
        ],
        extensions: ['.ts', '.js'],
      },
    },
    'import/ignore': ['node_modules'],
  },
  plugins: [
    '@typescript-eslint',
    '@trilon/eslint-plugin',
    'import',
    'nestjs',
    'sonarjs',
    'eslint-plugin-import-helpers',
    'prettier',
  ],
  extends: [
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@trilon/recommended',
    'plugin:sonarjs/recommended-legacy',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'plugin:nestjs/recommended',
    'prettier',
    'plugin:@eslint-community/eslint-comments/recommended',
  ],
  overrides: [
    {
      files: ['*.spec.ts', '*.mock.ts'],
      extends: ['plugin:vitest/recommended'],
      rules: {
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-nested-functions': 'off',
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
      { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNumber: true,
      },
    ],
    '@trilon/detect-circular-reference': 'off',
    'nestjs/use-validation-pipe': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
      },
    ],
    'import/no-cycle': 'warn',
    'sonarjs/function-return-type': 'off',
    'sonarjs/no-nested-conditional': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/throw-new-error': 'off',
    'unicorn/no-array-method-this-argument': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          e: false,
        },
        allowList: {
          param: true,
          params: true,
          ref: true,
          Ref: true,
          Param: true,
          Params: true,
          args: true,
          env: true,
          Env: true,
          doc: true,
        },
      },
    ],
  },
}

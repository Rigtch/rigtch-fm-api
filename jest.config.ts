import type { Config } from 'jest'

const configuration: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  verbose: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/.stryker-tmp/',
    '.js',
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
    '^@lib/common(.*)$': '<rootDir>/libs/common/src/$1',
    '^@lib/utils(.*)$': '<rootDir>/libs/utils/src/$1',
    '^@app/auth(.*)$': '<rootDir>/apps/auth/src/$1',
    '^@app/statistics(.*)$': '<rootDir>/apps/statistics/src/$1',
    '^@app/player(.*)$': '<rootDir>/apps/player/src/$1',
  },
  coveragePathIgnorePatterns: [
    '.*\\.(interface|module|schema|entity|repository|dto|enum).ts',
    '.*\\.e2e-spec.ts',
    'index.ts',
    'main.ts',
  ],
  coverageReporters: ['clover', 'json', 'lcov'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps', '<rootDir>/libs'],
}

export default configuration

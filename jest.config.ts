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
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@modules/adapter(.*)$': '<rootDir>/src/modules/adapter/$1',
    '^@modules/app(.*)$': '<rootDir>/src/modules/app/$1',
    '^@modules/auth(.*)$': '<rootDir>/src/modules/auth/$1',
    '^@modules/player(.*)$': '<rootDir>/src/modules/player/$1',
    '^@modules/statistics(.*)$': '<rootDir>/src/modules/statistics/$1',
    '^@common/dtos(.*)$': '<rootDir>/src/common/dtos/$1',
    '^@common/mocks(.*)$': '<rootDir>/src/common/mocks/$1',
    '^@common/types(.*)$': '<rootDir>/src/common/types/$1',
  },
  coveragePathIgnorePatterns: [
    '.*\\.(interface|module|schema|entity|repository|dto|enum).ts',
    '.*\\.e2e-spec.ts',
    'index.ts',
    'main.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
}

export default configuration

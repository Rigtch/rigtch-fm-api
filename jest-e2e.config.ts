import type { Config } from 'jest'

import defaultJestConfig from './jest.config'

const {
  moduleFileExtensions,
  rootDir,
  transform,
  moduleNameMapper,
  testEnvironment,
  testPathIgnorePatterns,
} = defaultJestConfig

const configuration: Config = {
  moduleFileExtensions,
  rootDir,
  testEnvironment,
  transform,
  moduleNameMapper,
  testPathIgnorePatterns,
  testRegex: '.e2e-spec.ts$',
}

export default configuration

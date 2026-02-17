module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: { '^@onsite360/types$': '<rootDir>/../types/src' },
  collectCoverageFrom: ['src/**/*.ts', '!**/*.d.ts'],
};

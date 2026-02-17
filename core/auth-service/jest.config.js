module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.d.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@onsite360/types$': '<rootDir>/../../../packages/types/src',
    '^@onsite360/common$': '<rootDir>/../../../packages/common/src',
    '^@onsite360/schemas$': '<rootDir>/../../../packages/schemas/schemas',
    '^@onsite360/ui$': '<rootDir>/../../../packages/ui/src'
  },
};

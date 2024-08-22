module.exports = {
  preset: 'ts-jest',
  transformIgnorePatterns: ['/node_modules'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  }
};
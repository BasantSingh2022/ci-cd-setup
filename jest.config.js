// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '*.js',
    'routes/**/*.js',
    'config/**/*.js',
    '!*.test.js',
    '!routes/**/*.test.js',
    '!config/**/*.test.js'
  ],
  setupFilesAfterEnv: ['./jest.setup.js']
};
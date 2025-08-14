module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest'],
  },
  maxWorkers: 1,
  moduleNameMapper: require('ts-jest').pathsToModuleNameMapper(
    require('../tsconfig.json').compilerOptions.paths || {},
    {
      prefix: '<rootDir>/',
    },
  ),
};

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/.*__fixtures__",
    "<rootDir>/.*\\.fixture\\.ts$",
  ],
  clearMocks: true,
};

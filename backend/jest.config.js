/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/tests/**/*.test.ts"],
  setupFiles: ["<rootDir>/src/tests/setupEnv.ts"],
  clearMocks: true
};

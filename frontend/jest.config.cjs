module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  testMatch: ["**/src/tests/**/*.test.tsx"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/src/tests/styleMock.cjs"
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.app.json"
      }
    ]
  }
};

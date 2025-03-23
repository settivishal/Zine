const customJestConfig = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest", // Use babel-jest for transforming .js, .jsx, .ts, .tsx files
  },
  testEnvironment: "jsdom", // Simulates a browser-like environment for testing React components
  moduleNameMapper: {
    "^next/image$": "<rootDir>/imageMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/filemock.js",
  },
};

export default customJestConfig;

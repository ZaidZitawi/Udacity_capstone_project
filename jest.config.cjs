// jest.config.cjs
module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  // Use 'jsdom' if most tests require browser-like globals (DOM).
  // If you want Node environment for server tests, you can override or do inline doc blocks.
  testEnvironment: "jest-environment-jsdom",

  moduleFileExtensions: ["js", "json", "node"],
};

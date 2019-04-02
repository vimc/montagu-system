var config = {
    testResultsProcessor: "<rootdir>/node_modules/jest-teamcity-reporter",
    transform: {
        "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$"
};

module.export = config;
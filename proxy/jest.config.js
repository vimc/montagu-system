var config = {
    transform: {
        "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$"
};

module.exports = config;
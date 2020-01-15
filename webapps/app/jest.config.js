module.exports = {
    "setupFiles": ["./src/test/helper.ts"],
    "globals": {
        "ts-jest": {
            tsConfig: 'tsconfig.json',
            "diagnostics": {
                "warnOnly": false
            }
        }
    },
    "testResultsProcessor": "jest-teamcity-reporter",
    "moduleFileExtensions": [
        "js",
        "json",
        "tsx",
        "ts"
    ],
    "transform": {
        "^.+\\.ts?$": "ts-jest",
        "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
    },
    "coverageDirectory": "./coverage/",
    "collectCoverage": true,
    "coveragePathIgnorePatterns": [
        "/node_modules/",
        "./tests/Sandbox.ts",
        "./test/testHelpers.ts",
        "./test/helper.ts",
        "./test/TeamCityIntegration.ts"
    ]
};
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
    "moduleNameMapper": {
        "environmentSettings": `<rootDir>/src/main/shared/settings/${process.env.MONTAGU_PORTAL_PROFILE || "development"}`,
        "appName": "<rootDir>/src/main/shared/settings/app/test.ts"
    },
    "moduleFileExtensions": [
        "js",
        "json",
        "tsx",
        "ts"
    ],
    "testRegex": "/test.*Tests\\.[jt]sx?$",
    "transform": {
        ".+\\.(css|style|less|sass|scss|png|jpg|ttf|woff|woff2|gif|pdf|csv)$":
                "<rootDir>/src/main/shared/assetTransformer.js", // mock imports of static files
        "^.+\\.(ts)x?$": "ts-jest",
        "^.+\\.js$": "babel-jest",
    },
    "coverageDirectory": "./coverage/",
    "collectCoverage": true,
    "coveragePathIgnorePatterns": [
        "/node_modules/",
        "./test/.*"
    ]
};
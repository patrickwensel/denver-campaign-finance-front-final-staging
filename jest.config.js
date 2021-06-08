const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src/'],
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    setupFilesAfterEnv: ['<rootDir>/setupJest.ts', "jest-canvas-mock"],
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/dist/",
        "<rootDir>/src/test.ts"
    ],
    reporters: [
        "default", [
            "./node_modules/jest-html-reporter",
            {
                "pageTitle": "Test Report",
                "includeFailureMsg": true
            }
        ]
    ],
    globals: {
        "ts-jest": {
            "tsConfig": "<rootDir>/tsconfig.spec.json",
            "stringifyContentPathRegex": "\\.html$"
        }
    },
    coverageDirectory: 'coverage/my-app',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
        prefix: '<rootDir>/'
    })
};
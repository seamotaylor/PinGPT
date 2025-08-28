module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        'jest/globals': true
    },
    extends: [
        'standard'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        'jest'
    ],
    rules: {
        // Extension-specific rules
        'no-unused-vars': ['error', { varsIgnorePattern: 'chrome' }],
        'no-undef': 'off', // Chrome APIs are not defined in Node.js context
        'semi': ['error', 'always'],

        // Jest rules
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error'
    },
    globals: {
        chrome: 'readonly'
    }
};
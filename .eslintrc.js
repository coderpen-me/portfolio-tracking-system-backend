module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended', 'plugin:sonarjs/recommended'],
    rules: {
        '@typescript-eslint/array-type': ['error', { default: 'generic' }],
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-object-literal-type-assertion': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/array-type': 'off',
        'sonarjs/no-duplicate-string': 'warn',
        'sonarjs/cognitive-complexity': 'warn',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
};

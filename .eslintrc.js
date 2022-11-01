module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'sort-class-members', 'import'],
    rules: {
        'default-param-last': ['warn'],
        'import/no-cycle': 0,
        'import/no-import-module-exports': 'warn',
        'no-console': ['error'],
        'no-param-reassign': ['error', { props: false }],
        'no-underscore-dangle': ['error'],
        'object-shorthand': ['off'],
        'prefer-destructuring': ['warn'],
        'sort-class-members/sort-class-members': [
            'error',
            {
                accessorPairPositioning: 'getThenSet',
                groups: {
                    'event-handler': [
                        { sort: 'alphabetical', static: false, type: 'method' },
                    ],
                },
                order: [
                    '[static-properties]',
                    '[properties]',
                    'constructor',
                    '[accessor-pairs]',
                    '[getters]',
                    '[setters]',
                    '[static-methods]',
                    '[methods]',
                    '[event-handler]',
                    '[everything-else]',
                ],
            },
        ],
        'sort-imports': [
            'error',
            {
                allowSeparatedGroups: true,
                ignoreCase: true,
            },
        ],
        'sort-keys': ['error', 'asc', { natural: true }],
    },
};

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
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'explicit',
          methods: 'explicit',
          parameterProperties: 'explicit',
          properties: 'explicit',
        },
      },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    'default-param-last': ['error'],
    'import/no-import-module-exports': 'error',
    'no-console': ['error'],
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['./*', '../*'],
      },
    ],
    'object-shorthand': ['off'],
    'prefer-destructuring': ['error'],
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

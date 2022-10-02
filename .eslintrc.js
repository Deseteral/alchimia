module.exports = {
  extends: '@deseteral/eslint-config/typescript',
  rules: {
    'max-len': 'off',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    'no-underscore-dangle': 'off',
    'no-bitwise': 'off',
    'no-continue': 'off',
    'class-methods-use-this': 'off',
    'no-lone-blocks': 'off',
    'max-classes-per-file': 'off',
    'no-multi-assign': 'off',
    'no-lonely-if': 'off',
    'no-console': 'off',
  },
};

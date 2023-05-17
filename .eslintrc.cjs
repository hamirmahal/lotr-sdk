// https://typescript-eslint.io/getting-started/#step-2-configuration
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  env: {
    node: true
  },
  globals: {
    module: 'readonly'
  },
  root: true
};

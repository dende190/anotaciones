module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 8,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'new-cap': 'off',
    'require-jsdoc': 'off',
    'no-undef': 'off',
  },
};

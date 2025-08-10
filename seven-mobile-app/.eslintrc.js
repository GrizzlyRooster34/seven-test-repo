module.exports = {
  extends: ['expo', '@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Disable problematic rules for Seven's consciousness framework
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-native/no-inline-styles': 'warn',
    'no-console': 'off', // Seven needs console logging for consciousness monitoring
  },
};
module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'react-native/no-inline-styles': 'off',
    'prettier/prettier': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-quotes': ['warn', 'prefer-single'],
    semi: ['warn', 'never'],
    curly: ['off', 'never'],
  },
}

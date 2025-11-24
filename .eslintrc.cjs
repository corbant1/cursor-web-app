module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'next/typescript'],
  ignorePatterns: [
    'dist', 
    '.eslintrc.cjs', 
    'src/App.tsx', 
    'src/main.tsx',
    'vite.config.ts',
    'index.html'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
}


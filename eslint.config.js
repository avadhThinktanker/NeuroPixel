import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        React: 'writable', // ✅ Fixes 'React' is not defined error
        HTMLFormElement: 'readonly', // ✅ Fixes 'HTMLFormElement' error
        HTMLTextAreaElement: 'readonly', // ✅ Fixes 'HTMLTextAreaElement' error
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      prettier,
    },
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '.vite/',
      '.vscode/',
      '*.min.js',
      'public/',
    ],
    rules: {
      ...ts.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      semi: ['error', 'always'],
    },
  },
  prettierConfig,
];

import { FlatCompat } from '@eslint/eslintrc';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'plugin:@typescript-eslint/recommended'], // Добавляем рекомендованные правила TypeScript
    plugins: ['import', '@typescript-eslint'], // Добавляем плагин TypeScript
    parser: '@typescript-eslint/parser', // Указываем парсер для TypeScript
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      project: './tsconfig.json', // Указываем путь к tsconfig.json, если он есть
    },
  }),
  {
    files: ['**/*.ts', '**/*.tsx'], // Применяем правила только для TypeScript файлов
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // Правило уже отключено
      'react-hooks/exhaustive-deps': 'off',
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-absolute-path': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': 'error',
      'import/no-useless-path-segments': 'error',
    },
  },
];

export default eslintConfig;
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const skip = { skipBlankLines: true, skipComments: true };

export default defineConfig([
  globalIgnores(['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/.turbo/**']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    plugins: { unicorn },
    rules: {
      // Correctness and safety
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-console': 'warn',

      // Complexity and size
      complexity: ['error', 10],
      'max-depth': ['error', 3],
      'max-lines-per-function': ['warn', { max: 30, ...skip }],
      'max-lines': ['warn', { max: 300, ...skip }],

      // Exports and files
      'no-restricted-exports': ['error', { restrictDefaultExports: { direct: true } }],
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/naming-convention': [
        'warn',
        { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'property', format: null },
        { selector: 'import', format: null },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['PascalCase'] },
      ],
    },
  },
  {
    files: ['**/*.config.{js,mjs,cjs,ts}', '**/*.cjs'],
    rules: { 'no-restricted-exports': 'off' },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    rules: { 'max-lines-per-function': 'off', 'max-lines': 'off' },
  },
  prettier,
]);

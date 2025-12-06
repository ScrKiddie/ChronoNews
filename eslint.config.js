import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    { ignores: ['dist/**', 'node_modules/**', '*.config.*'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
            parserOptions: { project: ['./tsconfig.app.json', './tsconfig.json'] },
        },
        plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
            ],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'prettier/prettier': 'error',
        },
    },
    {
        files: ['src/components/**/*.tsx', 'src/features/**/*.tsx', 'src/context/**/*.tsx'],
        rules: { 'react-refresh/only-export-components': 'error' },
    },
    {
        files: [
            'src/schemas/**/*.+(ts|tsx)',
            'src/types/**/*.+(ts|tsx)',
            'src/lib/**/*.+(ts|tsx)',
            'src/hooks/**/*.+(ts|tsx)',
        ],
        rules: { 'react-refresh/only-export-components': 'off' },
    }
);

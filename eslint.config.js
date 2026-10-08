import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', '.cache', '.review-backups'] },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser, parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true }, sourceType: 'module' } },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: { ...js.configs.recommended.rules, ...reactHooks.configs.recommended.rules, ...reactRefresh.configs.vite.rules },
  },
  { files: ['scripts/*.mjs', 'tests/firebase/*.mjs', 'artifacts/**/*.mjs'], languageOptions: { globals: globals.node } },
]

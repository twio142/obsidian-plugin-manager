// pnpm dlx @antfu/eslint-config@latest

import { antfu } from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  typescript: true,
  ignores: ['*.md', '*.mjs'],
}, {
  rules: {
    'style/semi': ['error', 'always'],
    'style/brace-style': ['error', '1tbs'],
    'no-console': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'node/prefer-global/process': 'off',
    'yml/quotes': ['error', { prefer: 'double' }],
  },
});

import next from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  // Ignore build output, dependencies, and generated files
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'public/sw.js', 'coverage/**'],
  },
  // Next.js Core Web Vitals rules (flat-config native; replaces FlatCompat extends)
  next.configs['core-web-vitals'],
  // TypeScript recommended rules (replaces the old next/typescript preset)
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];

export default eslintConfig;

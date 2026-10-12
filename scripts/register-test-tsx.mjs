import { fileURLToPath } from 'node:url';

process.env.TSX_TSCONFIG_PATH = fileURLToPath(new URL('./tsconfig.tests.json', import.meta.url));
// Register both CJS and ESM hooks: jsdom also loads JSON via CommonJS.
await import('tsx');

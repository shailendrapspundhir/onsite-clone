import path from 'path';
import fs from 'fs';

// Use import.meta.url to get the directory in ES module scope
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const distTypesPath = path.join(__dirname, 'dist', 'types', 'src', 'index.d.ts');
const distIndexPath = path.join(__dirname, 'dist', 'index.d.ts');

if (fs.existsSync(distTypesPath)) {
  const content = fs.readFileSync(distTypesPath, 'utf-8');
  fs.writeFileSync(distIndexPath, content);
  console.log('dist/index.d.ts created from dist/types/src/index.d.ts');
} else {
  console.error('dist/types/src/index.d.ts does not exist. Build may be broken.');
  process.exit(1);
}

import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { resolve, dirname, basename, extname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically discover all HTML files in the root folder
const getHtmlInputs = () => {
  const inputs = {};
  const files = fs.readdirSync(__dirname);
  files.forEach(file => {
    if (extname(file) === '.html') {
      const name = basename(file, '.html');
      inputs[name] = resolve(__dirname, file);
    }
  });
  return inputs;
};

export default defineConfig({
  build: {
    rollupOptions: {
      input: getHtmlInputs()
    }
  }
});

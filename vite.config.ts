import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), viteSingleFile()],
  root: 'src',
  build: {
    outDir: '../dist',
  },
  resolve: {
    alias: {
      '@/': `${__dirname}/src/`,
    },
  },
  esbuild: {
    legalComments: 'none',
  },
});

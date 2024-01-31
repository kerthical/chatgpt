import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: 'assets',
  plugins: [
    react({
      babel: {
        plugins: [jotaiDebugLabel, jotaiReactRefresh],
      },
    }),
    vanillaExtractPlugin(),
    splitVendorChunkPlugin(),
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: '[hash][extname]',
        chunkFileNames: '[hash].js',
        entryFileNames: '[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@/': `${path.resolve('src')}/`,
    },
  },
  esbuild: {
    legalComments: 'none',
  },
});

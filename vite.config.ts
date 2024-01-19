import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label';
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh';
import path from 'node:path';
import { defineConfig, normalizePath, splitVendorChunkPlugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [jotaiDebugLabel, jotaiReactRefresh],
      },
    }),
    vanillaExtractPlugin(),
    topLevelAwait(),
    splitVendorChunkPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, 'node_modules/pdfjs-dist/cmaps')),
          dest: 'assets',
        },
      ],
    }),
    viteSingleFile(),
  ],
  build: {
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
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  esbuild: {
    legalComments: 'none',
  },
});

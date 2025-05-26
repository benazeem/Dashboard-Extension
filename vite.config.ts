import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
<<<<<<< HEAD
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';
=======
// import { monacoEditorPlugin } from 'vite-plugin-monaco-editor'; // ✅ fix: use named import
>>>>>>> 894b99f05aec13907bfe4332ef419ecc10d2dceb

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
<<<<<<< HEAD
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/monaco-editor/min/vs',
          dest: 'assets/editor',
        },
        {
          src: 'node_modules/monaco-editor/min-maps/vs',
          dest: 'assets/editor/min-maps',
=======
    // monacoEditorPlugin(), // ✅ now it will work
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/monaco-editor/min/vs/**/*',
          dest: 'assets',
>>>>>>> 894b99f05aec13907bfe4332ef419ecc10d2dceb
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'src/chromeJSFiles/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        format: 'es',
        inlineDynamicImports: false,
      },
    },
  },
});

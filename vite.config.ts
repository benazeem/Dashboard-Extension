import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';
// import { monacoEditorPlugin } from 'vite-plugin-monaco-editor'; // Optional: uncomment if you want to use the plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // monacoEditorPlugin(), // ✅ Uncomment this if you're using the monaco plugin instead of copying manually
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/monaco-editor/min/vs/**/*',
          dest: 'assets',
        },
        {
          src: 'node_modules/monaco-editor/min-maps/vs',
          dest: 'assets/editor/min-maps',
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

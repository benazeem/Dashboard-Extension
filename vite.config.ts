import path from "path";
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor'; // ✅ merged

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    monacoEditorPlugin(), // ✅ added monaco plugin
    viteStaticCopy({
      targets: [
         {
          src: 'node_modules/monaco-editor/min/vs/**/*',
          dest: 'assets', // Output directory for Monaco
        },
      ],
    }),
  ],
  base: './',
  optimizeDeps: {
    include: ['monaco-editor'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/chromeJSFiles/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        format: "es",
        inlineDynamicImports: false,
        manualChunks: {
          monaco: ['monaco-editor'],
        },
      },
    },
    outDir: 'dist',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

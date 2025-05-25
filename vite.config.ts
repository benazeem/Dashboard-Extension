import path from "path";
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor'; // ✅ Correct for CommonJS


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    monacoEditorPlugin.default({
      languageWorkers: [
        'editorWorkerService', // Core editor worker (required)
        'typescript',        // For JavaScript/TypeScript
        'html',
        'css',
        'json'
      ],
      customWorkers: [
        { label: 'c', entry: 'monaco-editor/esm/vs/basic-languages/c/c.worker' },
        { label: 'cpp', entry: 'monaco-editor/esm/vs/language/cpp/cpp.worker' },
        { label: 'python', entry: 'monaco-editor/esm/vs/language/python/python.worker' },
        { label: 'java', entry: 'monaco-editor/esm/vs/language/java/java.worker' },
        { label: 'csharp', entry: 'monaco-editor/esm/vs/language/csharp/csharp.worker' },
        { label: 'go', entry: 'monaco-editor/esm/vs/language/go/go.worker' },
        { label: 'rust', entry: 'monaco-editor/esm/vs/language/rust/rust.worker' },
        { label: 'swift', entry: 'monaco-editor/esm/vs/basic-languages/swift/swift.worker' },
        { label: 'kotlin', entry: 'monaco-editor/esm/vs/basic-languages/kotlin/kotlin.worker' },
        { label: 'objective-c', entry: 'monaco-editor/esm/vs/basic-languages/objective-c/objective-c.worker' },
        { label: 'perl', entry: 'monaco-editor/esm/vs/basic-languages/perl/perl.worker' },
        { label: 'vb', entry: 'monaco-editor/esm/vs/basic-languages/vb/vb.worker' }
      ],
      publicPath: '/',
      globalAPI: true,
    }),
  ],
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
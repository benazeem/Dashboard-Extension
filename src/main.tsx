import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";

if (import.meta.env.PROD) {
  window.MonacoEnvironment = {
    getWorkerUrl: (_moduleId: string, label: string) => {
      const workerPaths: Record<string, string> = {
        'editor': 'editor.worker',
        'typescript': 'ts',
        'javascript': 'ts',
        'css': 'css',
        'html': 'html',
        'json': 'json',
        'c': 'cpp',
        'cpp': 'cpp',
        'python': 'python',
        'java': 'java',
        'csharp': 'csharp',
        'go': 'go',
        'rust': 'rust',
        'swift': 'swift',
        'kotlin': 'kotlin',
        'objective-c': 'objective-c',
        'perl': 'perl',
        'vb': 'vb',
      };
      
      const workerName = workerPaths[label] || 'editor.worker';
      return chrome.runtime.getURL(`assets/editor/${workerName}.js`);
    },
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

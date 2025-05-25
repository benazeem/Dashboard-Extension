import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";

if (import.meta.env.PROD) {
  window.MonacoEnvironment = {
    getWorkerUrl: (_moduleId: string, label: string) => {
      const workerMapping: Record<string, string> = {
        // Core workers
        'editor': 'editor.worker',
        'typescript': 'ts.worker',
        'javascript': 'ts.worker',
        'css': 'css.worker',
        'html': 'html.worker',
        'json': 'json.worker',

        // Custom language workers
        'c': 'c.worker',
        'cpp': 'cpp.worker',
        'python': 'python.worker',
        'java': 'java.worker',
        'csharp': 'csharp.worker',
        'go': 'go.worker',
        'rust': 'rust.worker',
        'swift': 'swift.worker',
        'kotlin': 'kotlin.worker',
        'objective-c': 'objective-c.worker',
        'perl': 'perl.worker',
        'vb': 'vb.worker'
      };

      return chrome.runtime.getURL(`/assets/${workerMapping[label] || 'editor'}.worker.js`);
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

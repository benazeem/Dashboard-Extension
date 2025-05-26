import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

interface MonacoWrapperProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
}

export default function MonacoWrapper({
  language,
  value,
  onChange,
  onMount,
}: MonacoWrapperProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    // Check if Monaco is already loaded
    if (typeof window !== "undefined" && (window as any).monaco) {
      initMonaco();
      return;
    }

    // Load Monaco scripts
    const script = document.createElement("script");
    script.src = "./assets/vs/loader.js";
    script.async = true;
    script.onload = () => {
      (window as any).require.config({
        paths: { vs: "./assets/vs" },
      });
      (window as any).require(["vs/editor/editor.main"], () => {
        initMonaco();
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  const initMonaco = () => {
    if (monacoEl.current) {
      editorRef.current = monaco.editor.create(monacoEl.current, {
        value,
        language,
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 16,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
        wrappingIndent: "same",
      });

      editorRef.current.onDidChangeModelContent(() => {
        onChange(editorRef.current?.getValue() || "");
      });

      if (onMount) {
        onMount(editorRef.current);
      }
    }
  };

  return <div style={{ height: "100%", width: "100%" }} ref={monacoEl} />;
}
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
  const monacoEl = useRef<HTMLDivElement | null>(null);

  // Only run once on mount
  useEffect(() => {
    if (!monacoEl.current) return;

    const editor = monaco.editor.create(monacoEl.current, {
      value,
      language,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 16,
      fontFamily: "monospace",
      lineNumbers: "on",
      contextmenu: true,
      wordWrap: "on",
      wrappingIndent: "none",
      lineDecorationsWidth: 0,
      glyphMargin: false,
      renderLineHighlight: "none",
      trimAutoWhitespace: true,
      rulers: [],
      padding: { top: 8, bottom: 8 },
    });

    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const currentValue = editor.getValue();
      if (currentValue !== value) {
        onChange(currentValue);
      }
    });

    // Backspace fix for empty line removal
    editor.addCommand(monaco.KeyCode.Backspace, () => {
      const model = editor.getModel();
      const position = editor.getPosition();
      if (!model || !position) return;

      const lineContent = model.getLineContent(position.lineNumber);
      if (lineContent.trim() === "" && position.lineNumber > 1) {
        const range = new monaco.Range(
          position.lineNumber - 1,
          model.getLineMaxColumn(position.lineNumber - 1),
          position.lineNumber,
          1
        );
        model.pushEditOperations([], [{ range, text: "" }], () => null);
      } else {
        editor.trigger("keyboard", "deleteLeft", {});
      }
    });

    if (onMount) onMount(editor);

    return () => {
      editor.dispose();
    };
  }, [language]); // only language affects re-init

  // Sync editor value with external value (but only if changed)
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const current = editor.getValue();
    if (value !== current) {
      editor.setValue(value);
    }
  }, [value]);

  return <div style={{ height: "100%", width: "100%" }} ref={monacoEl} />;
}

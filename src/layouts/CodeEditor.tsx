import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import languageOptions from "../data/languageOptions.json";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import useMainLayout from "@/hooks/useMainLayout";

function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState<string>("// Write your code here...");
  const [name, setName] = useState<string>("Untitled");
  const [language, setLanguage] = useState<string>("javascript");
  const [extension, setExtension] = useState<string>("js");
    const { updateMainLayout } = useMainLayout();

  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleCodeSave = () => {
    if (!editorRef.current) return;
   

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    if (name.trim() === "") { 
        a.download = `Untitled.${extension}`;
    } else {
        a.download = `${name}.${extension}`;
    }
    
    a.click();
    URL.revokeObjectURL(url);
  };

  console.log(code.trim());

  return (
    <>
      <div className="w-full h-[6dvh] bg-gray-800 flex items-center justify-between px-4">
        <select
          title="Select Language"
          className="w-[15%] h-full bg-gray-800 text-white outline-none border-[1px] border-gray-600 rounded-sm"
          value={language}
          onChange={(e) => {
            const selectedLanguage = e.target.value;
            setLanguage(selectedLanguage);
            const selectedOption = languageOptions.find(
              (lang) => lang.value === selectedLanguage
            );
            setExtension(selectedOption?.extension || "");
          }}
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="flex items-center justify-center h-full gap-4">
          <input
            className=" h-[90%] bg-gray-800 text-white outline-none border-[1px] border-gray-600 rounded-sm text-center"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="ghost"
            className="w-15 h-[90%] border-[1px] border-gray-600"
            onClick={handleCodeSave}
            disabled={
              code.trim() === "" || code.trim() === "//Writeyourcodehere..."
            }
            title={
              code.trim() === "" || code.trim() === "//Writeyourcodehere..."
                ? "Add code"
                : "Save code"
            }
          >
            Save
          </Button>
          <Button
          className="w-[5dvh] h-[5dvh] right-1 top-1 rounded-full border-[1px] border-gray-500 flex justify-center items-center"
          size={"lg"}
          variant={"ghost"}
          onClick={() => {
            updateMainLayout("main-app-layout");
          }}
        >
          <X />
        </Button>

        </div>
      </div>
      <Editor
        height="94dvh"
        width="100%"
        language={language}
        value={code}
        theme="vs-dark"
        options={{
          fontSize: 16,
          minimap: {
            enabled: false,
          },
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          wrappingIndent: "same",
        }}
        onMount={handleEditorMount}
        onChange={(value) => setCode(value || "")}
      />
    </>
  );
}

export default CodeEditor;

import { useState, useRef, useCallback } from "react";
import compilerOptions from "../data/languageOptions.json";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { submitCode, getSubmissionResult } from "@/utils/compileCode";
import { Sun, X } from "lucide-react";
import useMainLayout from "@/hooks/useMainLayout";

// Patterns to detect input calls per language
const languageInputPatterns: Record<string, RegExp> = {
  Python: /input\s*\(\s*['"`](.+?)['"`]\s*\)/g,
  JavaScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
  TypeScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
  Java: /System\.out\.print(?:ln)?\s*\(\s*["'](.+?)["']\s*\)/g,
  C: /printf\s*\(\s*["'](.+?)["']\s*\)/g,
  "C++": /cout\s*<<\s*["'](.+?)["']/g,
  "C#": /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
  PHP: /readline\s*\(\s*["'](.+?)["']\s*\)/g,
  Ruby: /gets\s*\.chomp\s*#?\s*["'](.+?)["']?/g,
  Swift: /readLine\s*\(\s*\)/g,
  Go: /fmt\.Scan(?:ln|f)?\s*\(/g,
  Rust: /io::stdin\(\)\.read_line\(&mut\s*[\w\d_]+\)\s*(?:\.expect\([^)]+\))?/g,
  Kotlin: /readLine\s*\(\)\s*\?\s*\.toIntOrNull\(\)/g,
  Scala: /readLine\s*\(\s*["'](.+?)["']\s*\)/g,
  "Objective-C": /fgets\s*\(\s*[a-zA-Z0-9_]+\s*,\s*[^,]+,\s*stdin\s*\)\s*;?/g,
  Perl: /<STDIN>|<>|\$_[^=]*=\s*<[^>]+>|\b(?:readline|getc)\b/g,
  "Visual Basic.Net": /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
  SQL: /--\s*PROMPT:\s*(.+)/g, // use comment as pseudo prompt
};
// Extract prompt strings from code for Python-style input("...")
function extractPrompts(code: string, language: string): string[] {
  const prompts: string[] = [];

  const promptRegEx: Record<string, RegExp> = {
    Python: /input\s*\(\s*['"`](.+?)['"`]\s*\)/g,
    JavaScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
    TypeScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
    Java: /System\.out\.print(?:ln)?\s*\(\s*["'](.+?)["']\s*\)/g,
    C: /printf\s*\(\s*["'](.+?)["']\s*\)/g,
    "C++": /cout\s*<<\s*["'](.+?)["']/g,
    "C#": /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
    PHP: /readline\s*\(\s*["'](.+?)["']\s*\)/g,
    Ruby: /gets\s*\.chomp\s*#?\s*["'](.+?)["']?/g,
    Swift: /print\s*\(\s*"(.*?)"\s*\)/g,
    Go: /fmt\.(?:Print)\s*\(\s*["'`](.*?)["'`]\s*\)/g,
    Rust: /println!\s*\(\s*["'](.+?)["']/g,
    Kotlin: /print\s*\(\s*"(.*?)"\s*\)/g,
    Scala: /readLine\s*\(\s*["'](.+?)["']\s*\)/g,
    "Objective-C": /printf\s*\(\s*"([^"]+)"\s*\)\s*;?/g,
    Perl: /<>;|print\s*\(?\s*["'](.+?)["']\s*\)?/g,
    "Visual Basic.Net": /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
    SQL: /--\s*PROMPT:\s*(.+)/g, // use comment as pseudo prompt
  };
  const regex = promptRegEx[language];

  if (!regex) return [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    if (match[1]) prompts.push(match[1]);
  }

  return prompts;
}

function splitByPrompts(
  output: string,
  prompts: string[],
  merged: string[]
): string {
  let result = output;
  prompts.forEach((prompt, index) => {
    result = result.replace(new RegExp(prompt, "g"), `${merged[index]},\n`);
  });

  return result;
}

export default function CompilerTool() {
  const {updateMainLayout} = useMainLayout();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState<string>("// Write your code here...");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("JavaScript");
  const [selectedVersion, setSelectedVersion] = useState<number>(
    compilerOptions.find((lang) => lang.value === "Python")?.versions[0]?.id ||
      0
  );
  const [inputFields, setInputFields] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [waitingForInput, setWaitingForInput] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); 


  // Detect input call locations (for counting)
  const findInputMatches = useCallback(() => {
    const pattern = languageInputPatterns[selectedLanguage];
    if (!pattern) return [];
    const matches: number[] = [];
    let m: RegExpExecArray | null;
    const re = new RegExp(pattern);
    while ((m = re.exec(code)) !== null) {
      matches.push(m.index);
    }
    return matches;
  }, [code, selectedLanguage]);

  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  // Core run logic
  const runFinalCode = async (stdin: string) => {
    if (!editorRef.current) return;
    setIsLoading(true);
    setIsError(false);
    setOutput("");
    try {
      const token = await submitCode({
        language_id: selectedVersion,
        source_code: code,
        stdin,
      });
      const interval = setInterval(async () => {
        const res = await getSubmissionResult(token);
        if (res.status.id > 2) {
          clearInterval(interval);
          setIsLoading(false);
          // Determine raw output or error
          let raw = res.stdout || res.compile_output || "";
          if (res.status.id !== 3) {
            setIsError(true);
            raw =
              res.stderr ||
              res.compile_output ||
              res.stdout ||
              res.status.description ||
              res.message ||
              raw;
          }

          const rest = raw.split("\n");

          // If prompts exist, interleave
          if (prompts.length > 0 && inputFields.length <= prompts.length) {
            const merged: string[] = [];
            // iterate prompts and inputs
            inputFields.forEach((p, idx) => {
              merged.push(`${prompts[idx]}- ${p}`);
            });

            merged.push(...rest);
            const cleanOutput = splitByPrompts(rest[0], prompts, merged);
            setOutput(cleanOutput);
            setInputFields([]);
          } else {
            setOutput(raw);
            setInputFields([]);
          }
        }
      }, 1000);
    } catch {
      setIsLoading(false);
      setIsError(true);
      setOutput("Submission failed.");
      setInputFields([]);
    }
  };

  // When Run clicked
  const handleRunClick = () => {
    const matches = findInputMatches();
    setInputFields([]);
    const extracted = extractPrompts(code, selectedLanguage);
    if (matches.length > 0) {
      setPrompts(extracted);
      setInputFields(Array(matches.length).fill(""));
      setWaitingForInput(true);
      setIsError(false);
      setOutput("");
    } else {
      setPrompts([]);
      runFinalCode("");
    }
  };

  // After user enters inputs and clicks submit
  const handleSubmitInputs = () => {
    setWaitingForInput(false);
    const input = inputFields.join("\n");
    runFinalCode(input);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header: language and run button */}
      <div className="h-12 bg-gray-800 flex items-center px-4 text-white ">
        <div className="flex items-center gap-4">
          <select
          title="Select Language"
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              const lang = compilerOptions.find(
                (l) => l.value === e.target.value
              );
              setSelectedVersion(lang?.versions[0]?.id || 0);
            }}
            className="bg-gray-700 text-white p-1 rounded mr-4"
          >
            {compilerOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <select
            title="Select Language Version"
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(Number(e.target.value))}
            className="bg-gray-700 text-white p-1 rounded mr-4"
          >
            {compilerOptions
              .find((l) => l.value === selectedLanguage)
              ?.versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-center gap-2 ml-10">
          <Button className="w-10 h-10 border-[1px] border-gray-500 flex justify-center items-center">
            <Sun />
            {/* <Moon /> */}
          </Button>
          <Button
            className="w-20 h-10 bg-blue-600"
            onClick={handleRunClick}
            disabled={isLoading}
          >
            {isLoading ? "Running..." : "Run"}
          </Button>
        </div>
        <Button
          className="w-20 h-10  ml-auto mr-20 border-[1px] border-gray-500 flex justify-center items-center"
          variant={"destructive"}
          onClick={() => {
            setOutput("");
          }}
        >
          Clear
        </Button>
        <Button
          className="w-10 h-10 absolute right-1 top-1 rounded-full border-[1px] border-gray-500 flex justify-center items-center"
          size={"lg"}
          variant={"ghost"}
          onClick={() => {
            updateMainLayout("main-app-layout");
          }}
        >
          <X />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Code editor pane */}
        <div className="w-1/2 bg-gray-900">
          <Editor
           key={selectedLanguage}
            theme="vs-dark"
            language={selectedLanguage.toLowerCase()}
            value={code}
            onMount={handleEditorMount}
            onChange={(val) => setCode(val ?? "")}
            options={{ automaticLayout: true, minimap: { enabled: false } }}
          />
        </div>

        {/* Right pane: input prompts or output */}
        <div className="w-1/2 flex flex-col">
          {waitingForInput ? (
            <div className="p-4 bg-gray-800 text-white w-full h-full overflow-scroll no-scrollbar ">
              <p className="mb-2">Enter {inputFields.length} input(s):</p>
              {inputFields.map((val, idx) => (
                <div key={idx} className="mb-2">
                  <label className="block mb-1 font-semibold text-gray-300">
                    {prompts[idx] || `Input ${idx + 1}:`}
                  </label>
                  <input
                    title="Custom Input field"
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const arr = [...inputFields];
                      arr[idx] = e.target.value;
                      setInputFields(arr);
                    }}
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                </div>
              ))}
              <Button onClick={handleSubmitInputs}>Submit & Execute</Button>
            </div>
          ) : (
            <div className="flex-1 p-4 bg-neutral-800 text-white overflow-auto text-left">
              <pre className={isError ? "text-red-400" : "text-green-300"}>
                {output.trim().length > 0 && output}
                <p className="text-gray-500">
                  {" "}
                  {output !== "Submission failed." &&
                    output.trim().length > 0 &&
                    "\n\n\n  <--Code Executed!-->\n\n\n"}
                </p>{" "}
                {isLoading && (
                  <>
                    <DotLottieReact
                      src="https://lottie.host/82d23131-50e7-490a-8fe2-49c2f901d347/V3uNmzp1jn.lottie"
                      className="w-full h-full"
                      loop
                      autoplay
                    />
                  </>
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

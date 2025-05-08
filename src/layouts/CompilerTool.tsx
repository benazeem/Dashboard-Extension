// import { useState, useRef } from "react";
// import compilerOptions from "../data/compilerLanguageOptions.json";
// import Editor from "@monaco-editor/react";
// import * as monaco from "monaco-editor";
// import { Fullscreen, Ghost, Moon, Sun } from "lucide-react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// import { Button } from "@/components/ui/button";
// import { submitCode, getSubmissionResult } from "@/utils/compileCode";

// function CompilerTool() {
//   const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
//   const [code, setCode] = useState<string>("");
//     const [inputFields, setInputFields] = useState<string[]>([]);
//     const [needInputLocation, setNeedInputLocation] = useState<{index:number,match:string}[]>([]); // Location of the input in the code
//     const [output, setOutput] = useState<{ output: string; type: string } | null>(
//     { output: "", type: "response" }
//   );
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
//   const [selectedVersion, setSelectedVersion] = useState(
//     compilerOptions.find((lang) => lang.value === "JavaScript")?.versions[0]
//       ?.id || ""
//   );

//   const languageInputPatterns = {
//     Python: /input\s*\(/g,
//     JavaScript: /prompt\s*\(|readline\s*\(/g,
//     TypeScript: /prompt\s*\(|readline\s*\(/g,
//     Java: /Scanner\s*\(|System\.in/g,
//     C: /scanf\s*\(|gets\s*\(/g,
//     "C++": /cin\s*([<>]*|\s*)/g,
//     "C#": /Console\.Read(Line|)/g,
//     Go: /fmt\.Scan[fln]*\s*\(/g,
//     Rust: /io::stdin|read_line/g,
//     Ruby: /gets\s*\(/g,
//     PHP: /fgets\s*\(|readline\s*\(/g,
//     Swift: /readLine\s*\(/g,
//     Kotlin: /readLine\s*\(/g,
//     R: /readLines\s*\(|scan\s*\(/g,
//     Scala: /readLine\s*\(/g,
//     SQL: /--.*?INPUT REQUIRED/g, // custom comments if needed
//     "Objective-C": /scanf\s*\(|gets\s*\(/g,
//     Perl: /<>|STDIN|<STDIN>/g,
//     "Visual Basic.Net": /Console\.Read(Line|)/g,
//   };

//   // Get the selected language object
//   const currentLanguage = compilerOptions.find(
//     (lang) => lang.value === selectedLanguage
//   );

//   const handleEditorDidMount = (
//     editor: monaco.editor.IStandaloneCodeEditor,
//     monaco: typeof import("monaco-editor")
//   ) => {
//     editorRef.current = editor;
//   };

//   const runfinalCode = async (
//     language_id: number,
//     source_code: string,
//     stdin: string
//   ) => {
//     setInputFields([]); // Reset input fields
//     if (!editorRef.current) return;

//     setIsLoading(true);
//     setOutput(null);

//     try {
//       // Submit the code
//       const token = await submitCode({
//         language_id,
//         source_code,
//         stdin,
//       });

//       // Check result periodically
//       const interval = setInterval(async () => {
//         try {
//           const result = await getSubmissionResult(token);

//           console.log("Current status:", result);

//           if (result.status.id > 2) {
//             clearInterval(interval);
//             setIsLoading(false);

//             if (result.status.id === 3) {
//               // Accepted
//               setOutput({
//                 output: result.stdout || result.compile_output || "No output",
//                 type: "response",
//               });
//             } else {
//               // Error state
//               setOutput({
//                 output:
//                   result.stderr ||
//                   result.compile_output ||
//                   result.message ||
//                   `Error (Status ${result.status.id}: ${result.status.description})`,
//                 type: "response",
//               });
//             }
//             if (result.status.id > 3) {
//               // Highlight the output in green if accepted
//               setOutput({
//                 output: `${result.status.description} \n \n  ${result.stdout}`,
//                 type: "error",
//               });
//             }
//           }
//         } catch (error) {
//           clearInterval(interval);
//           setIsLoading(false);
//           setOutput({ output: "Error checking result status", type: "error" });
//           console.error(error);
//         }
//       }, 1000); // Check every second
//     } catch (error) {
//       setIsLoading(false);
//       setOutput({ output: "Error submitting code", type: "error" });
//       console.error(error);
//     }
//   };

//   function countInputCalls(code: string, language: string) {
//     const pattern =
//       languageInputPatterns[language as keyof typeof languageInputPatterns];
//     if (!pattern) return [];
//     const matches = [];
//     let match;
//     while ((match = pattern.exec(code)) !== null) {
//         matches.push({ index: match.index, match: match[0] });
//     }
    
//     console.log(code.match(pattern));
//     return (matches || []);
//   }

//   const handleInputChange = (index: number, value: string) => {
//     const updated = [...inputFields];
//     updated[index] = value;
//     setInputFields(updated);
//   };
  
//   const handleSubmitInputs = () => {
//     const joinedInput = inputFields.join("\n");
//     runfinalCode(Number(selectedVersion), code, joinedInput);
//     setInputFields([]); // Clear input fields after submission
//     setNeedInputLocation([]); // Clear input locations after submission
//   };
  

//   const handleStdIn = (requiredInputs: { index: number; match: string }[]) => {
//     const fields = Array.from({ length: requiredInputs.length }, () => "");
//     console.log("Input fields:", fields);
//     setInputFields(fields);

//   };

//   function prepareExecution(code: string, language: string) {
//     const inputsMatches = countInputCalls(code, language);
//     setNeedInputLocation(inputsMatches);
    
//     if (inputsMatches.length > 0) {
//       handleStdIn(inputsMatches);
//     } else {
//       runfinalCode(Number(selectedVersion), code, "");
//     }
//   }
  
//  console.log(inputFields, needInputLocation);

//   const handleCodeRun = () => {
//     prepareExecution(code, selectedLanguage);
//   };

//   return (
//     <>
//       <div className="w-full h-[5dvh] bg-black flex items-center justify-center">
//         <div className="p-4 text-white">
//           {selectedLanguage} --{" "}
//           {
//             currentLanguage?.versions?.find(
//               (v) => v.id.toString() === selectedVersion.toString()
//             )?.name
//           }
//         </div>
//       </div>
//       <div className="w-full h-[95dvh] flex ">
//         <div className="w-[10%] h-full bg-black/50 flex flex-col p-2 space-y-2 overflow-scroll no-scrollbar">
//           {compilerOptions.map((language) => (
//             <button
//               key={language.value}
//               onClick={() => {
//                 setSelectedLanguage(language.value);
//                 // Reset to first version when language changes
//                 setSelectedVersion(language.versions?.[0]?.id || "");
//               }}
//               className={`p-2 rounded text-white ${
//                 selectedLanguage === language.value
//                   ? "bg-blue-600"
//                   : "bg-gray-700 hover:bg-gray-600"
//               }`}
//             >
//               {language.label}
//             </button>
//           ))}
//         </div>
//         <div className="w-[90%] bg-gray-900 flex">
//           <div className="h-full w-1/2 bg-white/10 flex justify-start items-start text-white">
//             <div className="w-full h-full">
//               <div className="w-full h-[10%] flex justify-end items-center gap-3 pr-4 box-border bg-gray-800 ">
//                 <select
//                   value={selectedVersion}
//                   onChange={(e) => setSelectedVersion(e.target.value)}
//                   className="bg-gray-800 text-white p-2 rounded"
//                 >
//                   {currentLanguage?.versions?.map((version) => (
//                     <option key={version.id} value={version.id}>
//                       {version.name}
//                     </option>
//                   ))}
//                 </select>
//                 <Button
//                   title="fullscreen-editor"
//                   className="w-10 h-10 border-[1px] border-gray-500 flex justify-center items-center"
//                 >
//                   <Fullscreen />
//                 </Button>
//                 <Button className="w-10 h-10 border-[1px] border-gray-500 flex justify-center items-center">
//                   <Sun />
//                   {/* <Moon /> */}
//                 </Button>
//                 <Button
//                   className="bg-blue-600 w-20 h-10 p-2 rounded font-bold"
//                   onClick={handleCodeRun}
//                   disabled={code.trim().length > 0 ? false : true}
//                 >
//                   Run
//                 </Button>
//               </div>
//               <div className="w-full h-[90%]">
//                 <Editor
//                   theme="vs-dark"
//                   className="w-full h-full overflow-hidden"
//                   language={currentLanguage?.label.toLowerCase()}
//                   defaultValue="// Write your code here..."
//                   onMount={handleEditorDidMount}
//                   onChange={(value) => setCode(value || "")}
//                   options={{
//                     fontSize: 16,
//                     minimap: { enabled: false },
//                     scrollBeyondLastLine: false,
//                     automaticLayout: true,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="w-[2px] h-full bg-gray-600 "></div>
//           <div className="w-1/2 h-full">
//             <div className="w-full h-[10%] bg-gray-800">
//               <div className="w-full h-full flex justify-end items-center gap-3 pr-4 box-border text-white">
//                 <Button
//                   className="w-20 h-10 border-[1px] border-gray-500 flex justify-center items-center"
//                   variant={"destructive"}
//                   onClick={() => {
//                     setOutput(null);
//                   }}
//                 >
//                   Clear
//                 </Button>
//               </div>
//             </div>
//             <div className="h-[90%] w-full bg-white/10 ">
//               <div className="w-full h-full flex  text-left bg-neutral-800">
               
//                       {isLoading ? (
//                         <DotLottieReact
//                           src="https://lottie.host/82d23131-50e7-490a-8fe2-49c2f901d347/V3uNmzp1jn.lottie"
//                           className="w-full h-full"
//                           loop
//                           autoplay
//                         />
//                       ) : (
//                         output &&
//                         output?.output && (
//                           <pre
//                             className={`${
//                               output?.type === "error"
//                                 ? "text-red-600"
//                                 : "text-green-500"
//                             } whitespace-pre-wrap break-words p-4 w-full h-full outline-none`}
//                           > 
//                           {output?.output}
//                           {needInputLocation.length > 0 && (<input title="stdin" type="text" />)}
//                           </pre>
//                         )
//                       )}
//                     </div>
//                   </div>
//                   </div>
//                   </div>
//                   </div>
//     </>
//   );
// }

// export default CompilerTool;


// import React, { useState, useRef, useCallback, useEffect } from "react";
// import compilerOptions from "../data/compilerLanguageOptions.json";
// import Editor from "@monaco-editor/react";
// import * as monaco from "monaco-editor";
// import { Button } from "@/components/ui/button";
// import { submitCode, getSubmissionResult } from "@/utils/compileCode";

// // Patterns to detect input calls per language
// const languageInputPatterns: Record<string, RegExp> = {
//   Python: /input\s*\(/g,
//   Java: /Scanner\s*\(|System\.in/g,
//   C: /scanf\s*\(/g,
//   "C++": /cin\s*>?>?/g,
//   "C#": /Console\.Read(Line|)/g,
//   Go: /fmt\.Scan[fln]*\s*\(/g,
//   Rust: /read_line|io::stdin/g,
//   Ruby: /gets\s*\(/g,
//   PHP: /fgets\s*\(|readline\s*\(/g,
//   Swift: /readLine\s*\(/g,
//   Kotlin: /readLine\s*\(/g,
//   R: /scan\s*\(|readLines\s*\(/g,
//   Scala: /readLine\s*\(/g,
//   SQL: /--.*?INPUT REQUIRED/g,
//   "Objective-C": /scanf\s*\(/g,
//   Perl: /<>|STDIN/g,
//   "Visual Basic.Net": /Console\.Read(Line|)/g,
//   JavaScript: /prompt\s*\(/g,
//   TypeScript: /prompt\s*\(/g,
// };

// export default function CompilerTool() {
//   const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
//   const [code, setCode] = useState<string>("// Write your code here...");
//   const [selectedLanguage, setSelectedLanguage] = useState<string>("JavaScript");
//   const [selectedVersion, setSelectedVersion] = useState<number>(
//     compilerOptions.find((lang) => lang.value === "JavaScript")?.versions[0]?.id || 0
//   );
//   const [inputFields, setInputFields] = useState<string[]>([]);
//   const [waitingForInput, setWaitingForInput] = useState<boolean>(false);
//   const [output, setOutput] = useState<string>("");
//   const [lastInputs, setLastInputs] = useState<string[]>([]);
//   const [isError, setIsError] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   // Detect input call matches with indices
//   const findInputMatches = useCallback(() => {
//     const pattern = languageInputPatterns[selectedLanguage] || null;
//     if (!pattern) return [];
//     const matches = [];
//     let m: RegExpExecArray | null;
//     const re = new RegExp(pattern);
//     while ((m = re.exec(code)) !== null) {
//       matches.push(m.index);
//     }
//     return matches;
//   }, [code, selectedLanguage]);

//   // Initialize editorRef
//   const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
//     editorRef.current = editor;
//   };

//   // Split-run logic: first detect inputs, then prompt
//   const handleRunClick = async () => {
//     const matches = findInputMatches();
//     if (matches.length > 0) {
//       setInputFields(Array(matches.length).fill(""));
//       setWaitingForInput(true);
//       setOutput("");
//     } else {
//       runFinalCode("");
//       setLastInputs([]);

//     }
//   };

//   // Submit inputs and execute final code
//   const handleSubmitInputs = async () => {
//     setLastInputs(inputFields);
//     const stdin = inputFields.join("\n");
//     setWaitingForInput(false);
//     await runFinalCode(stdin);
//   };

//   // Core submission and polling
//   const runFinalCode = async (stdin: string) => {
//     if (!editorRef.current) return;
//     setIsLoading(true);
//     setIsError(false);
//     setOutput("");
//     try {
//       const token = await submitCode({
//         language_id: selectedVersion,
//         source_code: code,
//         stdin,
//       });
//       const interval = setInterval(async () => {
//         const res = await getSubmissionResult(token);
//         if (res.status.id > 2) {
//           clearInterval(interval);
//           setIsLoading(false);
//           if (res.status.id === 3) {
//             setOutput(res.stdout || res.compile_output || "");
//           } else {
//             setIsError(true);
//             setOutput(res.stderr || res.compile_output || res.message);
//           }
//         }
//       }, 1000);
//     } catch (err) {
//       setIsLoading(false);
//       setIsError(true);
//       setOutput("Submission failed.");
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col">
//       {/* Header */}
//       <div className="h-12 bg-gray-800 flex items-center px-4 text-white">
//         <select
//           value={selectedLanguage}
//           onChange={(e) => {
//             setSelectedLanguage(e.target.value);
//             const lang = compilerOptions.find((l) => l.value === e.target.value);
//             setSelectedVersion(lang?.versions[0]?.id || 0);
//           }}
//           className="bg-gray-700 text-white p-1 rounded mr-4"
//         >
//           {compilerOptions.map((lang) => (
//             <option key={lang.value} value={lang.value}>
//               {lang.label}
//             </option>
//           ))}
//         </select>
//         <select
//           value={selectedVersion}
//           onChange={(e) => setSelectedVersion(Number(e.target.value))}
//           className="bg-gray-700 text-white p-1 rounded"
//         >
//           {compilerOptions
//             .find((l) => l.value === selectedLanguage)
//             ?.versions.map((v) => (
//               <option key={v.id} value={v.id}>
//                 {v.name}
//               </option>
//             ))}
//         </select>
//         <Button className="ml-auto" onClick={handleRunClick} disabled={isLoading}>
//           {isLoading ? 'Running...' : 'Run'}
//         </Button>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Editor Pane */}
//         <div className="w-1/2 bg-gray-900">
//           <Editor
//             theme="vs-dark"
//             defaultLanguage={selectedLanguage.toLowerCase()}
//             defaultValue={code}
//             onMount={handleEditorMount}
//             onChange={(val) => setCode(val || "")}
//             options={{ automaticLayout: true, minimap: { enabled: false } }}
//           />
//         </div>

//         {/* Right Pane: Input / Output */}
//         <div className="w-1/2 flex flex-col">
//           {waitingForInput ? (
//             <div className="p-4 bg-gray-800 text-white">
//               <p className="mb-2">Enter {inputFields.length} input(s):</p>
//               {inputFields.map((val, idx) => (
//                 <input
//                   key={idx}
//                   type="text"
//                   value={val}
//                   onChange={(e) => {
//                     const arr = [...inputFields];
//                     arr[idx] = e.target.value;
//                     setInputFields(arr);
//                   }}
//                   className="w-full mb-2 p-2 bg-gray-700 rounded"
//                   placeholder={`Input ${idx + 1}`}
//                 />
//               ))}
//               <Button onClick={handleSubmitInputs}>Submit & Execute</Button>
//             </div>
//           ) : (
//             <div className="flex-1 p-4 bg-neutral-800 text-white overflow-auto">
//               {output ? (
//                 <pre className={isError ? 'text-red-400' : 'text-green-300'}>
//                   {output}
//                 </pre>
//               ) : (
//                 <p className="text-gray-500">Output will appear here</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useCallback } from "react";
import compilerOptions from "../data/compilerLanguageOptions.json";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { submitCode, getSubmissionResult } from "@/utils/compileCode";

// Patterns to detect input calls per language
const languageInputPatterns: Record<string, RegExp> = {
  Python: /input\s*\(/g,
  Java: /Scanner\s*\(/g,
  C: /scanf\s*\(/g,
  "C++": /cin\s*>?>?/g,
  "C#": /Console\.Read(Line|)/g,
  Go: /fmt\.Scan[fln]*\s*\(/g,
  Rust: /read_line|io::stdin/g,
  Ruby: /gets\s*\(/g,
  PHP: /fgets\s*\(/g,
  Swift: /readLine\s*\(/g,
  Kotlin: /readLine\s*\(/g,
  R: /scan\s*\(/g,
  Scala: /readLine\s*\(/g,
  JavaScript: /prompt\s*\(/g,
  TypeScript: /prompt\s*\(/g,
};

// Extract prompt strings from code for Python-style input("...")
function extractPrompts(code: string, language: string): string[] {
  const prompts: string[] = [];

  // Language-specific regex map
  const regexMap: Record<string, RegExp> = {
    Python: /input\s*\(\s*['"`](.+?)['"`]\s*\)/g,
    JavaScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
    TypeScript: /prompt\s*\(\s*['"`](.+?)['"`]\s*\)/g,
    Java: /new\s+Scanner\(.*?\)\.next(?:Line|Int|Double)?\s*\(\s*\)/g, // no prompt string usually
    C: /printf\s*\(\s*["'](.+?)["']\s*\)/g,
    'C++': /cout\s*<<\s*["'](.+?)["']/g,
    'C#': /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
    PHP: /readline\s*\(\s*["'](.+?)["']\s*\)/g,
    Ruby: /gets\s*\.chomp\s*#?\s*["'](.+?)["']?/g,
    Swift: /readLine\s*\(\s*from:\s*["'](.+?)["']\s*\)/g,
    Go: /fmt\.Print(?:ln|f)?\s*\(\s*["'](.+?)["']/g,
    Rust: /println!\s*\(\s*["'](.+?)["']/g,
    Kotlin: /readLine\s*\(\s*["'](.+?)["']?\s*\)/g,
    R: /readline\s*\(\s*["'](.+?)["']\s*\)/g,
    Scala: /readLine\s*\(\s*["'](.+?)["']\s*\)/g,
    'Objective-C': /NSLog\s*\(\s*@"(.+?)"\s*\)/g,
    Perl: /<>;|print\s*\(?\s*["'](.+?)["']\s*\)?/g,
    'Visual Basic.Net': /Console\.Write(?:Line)?\s*\(\s*["'](.+?)["']\s*\)/g,
    SQL: /--\s*PROMPT:\s*(.+)/g // use comment as pseudo prompt
  };

  const regex = regexMap[language];

  if (!regex) return [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    if (match[1]) prompts.push(match[1]);
  }

  console.log(prompts);
  return prompts;
}


export default function CompilerTool() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState<string>("// Write your code here...");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Python");
  const [selectedVersion, setSelectedVersion] = useState<number>(
    compilerOptions.find((lang) => lang.value === "Python")?.versions[0]?.id || 0
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
      const token = await submitCode({ language_id: selectedVersion, source_code: code, stdin });
      const interval = setInterval(async () => {
        const res = await getSubmissionResult(token);
        if (res.status.id > 2) {
          clearInterval(interval);
          setIsLoading(false);
          // Determine raw output or error
          let raw = res.stdout || res.compile_output || "";
          if (res.status.id !== 3) {
            setIsError(true);
            raw = res.stderr || res.compile_output || res.message || raw;
          }
          // If prompts exist, interleave
          if (prompts.length > 0 && inputFields.length === prompts.length) {
            const merged: string[] = [];
            // iterate prompts and inputs
            prompts.forEach((p, idx) => {
              merged.push(`${p}:`);
              merged.push(inputFields[idx]);
            });
            // append any remaining program output lines after inputs
            const rest = raw.split("\n");
            merged.push(...rest);
            setOutput(merged.join("\n"));
          } else {
            setOutput(raw);
          }
        }
      }, 1000);
    } catch {
      setIsLoading(false);
      setIsError(true);
      setOutput("Submission failed.");
    }
  };

  // When Run clicked
  const handleRunClick = () => {
    const matches = findInputMatches();
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
    runFinalCode(inputFields.join("\n"));
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header: language and run button */}
      <div className="h-12 bg-gray-800 flex items-center px-4 text-white">
        <select
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value);
            const lang = compilerOptions.find((l) => l.value === e.target.value);
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
        <Button className="ml-auto" onClick={handleRunClick} disabled={isLoading}>
          {isLoading ? "Running..." : "Run"}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Code editor pane */}
        <div className="w-1/2 bg-gray-900">
          <Editor
            theme="vs-dark"
            defaultLanguage={selectedLanguage.toLowerCase()}
            defaultValue={code}
            onMount={handleEditorMount}
            onChange={(val) => setCode(val || "")}
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
            <div className="flex-1 p-4 bg-neutral-800 text-white overflow-auto">
              <pre className={isError ? "text-red-400" : "text-green-300"}>
                {output || (isLoading ? <>
                <DotLottieReact
                src="https://lottie.host/82d23131-50e7-490a-8fe2-49c2f901d347/V3uNmzp1jn.lottie"
                className="w-full h-full"
                loop
                autoplay
                />
                </> : "Output will appear here")}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


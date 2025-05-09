import { CircleX } from "lucide-react";
import { useRef, useEffect } from "react";
import { useState } from "react";
import {AnimatePresence, motion} from "motion/react";
import useMainLayout from "@/hooks/useMainLayout";

interface SidebarProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({setShow}:SidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const {updateMainLayout} = useMainLayout();
    const toolsByProfile = {
        developer: [
            { name: "Compiler", icon: "compiler", id: "compiler" },
            { name: "Code Editor", icon: "editor", id: "code-editor" },
            { name: "RegEx Tester", icon: "RegEx", id: "regex-tester" },
            { name: "JSON Formatter", icon: "json", id: "json-formator" },
            { name: "UUID Generator", icon: "json", id: "uuid-Generator" },
            { name: "Hash Generators", icon: "json", id: "hash-generators" },
            { name: "Snippet Library", icon: "json", id: "snippet-library" },
            { name: "Markdown Editor", icon: "json", id: "markdown-editor" },
            { name: "Base64 Encoder/Decoder", icon: "json", id: "base64-encoder-decoder" }
        ],
        designer: [
            { name: "White Board", icon: "layout", id: "white-board" },
            { name: "Color Picker", icon: "palette", id: "color-picker" },
            { name: "Color Palette Generator", icon: "type", id: "color-palette-generator" },
            { name: "Image Compressor", icon: "type", id: "image-compressor" },
            { name: "Font Previewer", icon: "type", id: "font-previewer" },
            { name: "Gradient Generator", icon: "type", id: "gradient-generator" },
            { name: "Spacing & Scale Visualizer", icon: "type", id: "spacing-scale-visualizer" },
            { name: "Typography Tool", icon: "type", id: "typography-tool" },            
            { name: "CSS Box Shadow Generator", icon: "type", id: "css-box-shadow-generator" },
            { name: "Lorem Ipsum Generator", icon: "type", id: "lorem-ipsum-generator" }
        ],
        marketer: [
            { name: "Google Analytics", icon: "bar-chart", id: "google-analytics" },
            { name: "DA & PA Checker", icon: "shield", id: "da-pa-checker" },
            { name: "SEO Analysis Tool", icon: "search", id: "seo-analysis" },
            { name: "Website Speed Test", icon: "zap", id: "website-speed-test" },
            { name: "Backlink Checker", icon: "link", id: "backlink-checker" },
            { name: "Local SEO Checker", icon: "map-pin", id: "local-seo-checker" },
            { name: "Schema Markup Generator", icon: "code", id: "schema-markup-generator" },
            { name: "Link Building Tool", icon: "git-branch", id: "link-building-tool" },
            { name: "Google Search Console", icon: "search-check", id: "google-search-console" },
            { name: "Keyword Tool", icon: "list", id: "keyword-tool" },
            { name: "Link Shortener", icon: "scissors", id: "link-shortener" }
          ]
    }
    const [selectedProfile, setSelectedProfile] = useState<keyof typeof toolsByProfile>("developer");
    const handleClose = () => {
        setShow(false)
    }

    useEffect(() => {
        function handleMouseDown(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setShow(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShow(false);
          };
          document.addEventListener('keydown', handleKeyDown);
        document.addEventListener("mousedown", handleMouseDown);
        return () => {
         document.removeEventListener('keydown', handleKeyDown);
         document.removeEventListener("mousedown", handleMouseDown);
        };
    }, [sidebarRef, setShow]);
  return (
    <>
    <AnimatePresence>
         <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut", type:"spring", stiffness: 300, damping: 25 }}
        ref={sidebarRef}  className="h-screen w-[20vw] absolute left-0 top-0 bg-white/50 backdrop-blur-2xl rounded-lg shadow-lg z-30 ">
                    <div className="p-4 pt-10">
                        <label htmlFor="profile-select" className="text-gray-100">Select Profile:</label>
                        <select
                            id="profile-select"
                            className="ml-2 p-1 rounded text-gray-100 bg-gray-800 outline-none"
                            value={selectedProfile}
                            onChange={(e) => setSelectedProfile(e.target.value as keyof typeof toolsByProfile)}
                        >
                            {Object.keys(toolsByProfile).map((profile) => (
                                <option key={profile} value={profile}>
                                    {profile.charAt(0).toUpperCase() + profile.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="p-4">
                        <ul className="text-white list-none flex flex-col gap-2 justify-evenly ">
                            {toolsByProfile[selectedProfile].map((tool) => (
                                <li key={tool.id} onClick={()=>updateMainLayout(tool.id)} className="cursor-pointer">{tool.name}</li>
                            ))}
                        </ul>
                    </div>
            <div className="absolute right-1 top-1" onClick={handleClose}> <CircleX /></div>
        </motion.div>
        </AnimatePresence>
    </>
  )
}

export default Sidebar
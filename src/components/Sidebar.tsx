import { CircleX, icons } from "lucide-react";
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
            { name: "Code Editor", icon: "code", id: "code-editor" },
            { name: "Debugger", icon: "bug", id: "debugger" },
            { name: "Version Control", icon: "git-branch", id: "version-control" }
        ],
        designer: [
            { name: "Canvas", icon: "layout", id: "canvas" },
            { name: "Color Picker", icon: "palette", id: "color-picker" },
            { name: "Typography Tool", icon: "type", id: "typography-tool" }
        ],
        marketer: [
            { name: "Analytics Dashboard", icon: "bar-chart", id: "analytics-dashboard" },
            { name: "SEO Tool", icon: "search", id: "seo-tool" },
            { name: "Campaign Manager", icon: "megaphone", id: "campaign-manager" }
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
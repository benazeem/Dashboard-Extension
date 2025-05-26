
import {ChevronDown, Settings, Image, Monitor, LifeBuoy, Megaphone,Clock, Palette,Globe,FolderUp,FolderDown} from "lucide-react";

import { useState, useEffect, useRef } from "react";

const SettingsPanel = () => {
  const [activeSection, setActiveSection] = useState("General");
  const [selectedColor, setSelectedColor] = useState("black");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [timeFormat, setTimeFormat] = useState("24");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTimeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (date: Date, is12Hour: boolean = false) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: is12Hour,
    });
  };

  const colorClasses = {
    black: "bg-black",
    red: "bg-red-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    white: "bg-white border border-gray-300",
  };

const sidebarItems = [
  { label: "General", icon: Settings },
  { label: "Background", icon: Image },
  { label: "Screen Saver", icon: Monitor },
  { label: "Get Help", icon: LifeBuoy },
  { label: "What's New", icon: Megaphone },
];


  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[700px] h-[450px] bg-white rounded-2xl shadow-xl flex overflow-hidden border z-50"
    >
      {/* Sidebar */}
      <div className="w-1/3 border-r p-4 bg-gray-50">
        {sidebarItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActiveSection(item.label)}
            className={`p-2 rounded cursor-pointer mb-2 flex items-center gap-2 ${
              activeSection === item.label ? "bg-indigo-100 font-semibold" : "hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="w-2/3 p-6 overflow-auto text-sm text-gray-800">
        {activeSection === "General" && (
          <>
{/* Time Format */}
<div className="mb-6 flex justify-between items-center gap-4" ref={dropdownRef}>
<div className="flex items-center gap-2 font-semibold">
  <Clock className="w-4 h-4" />
  <p>Time Format</p>
</div>

  <div className="relative">
    <div
      className="cursor-pointer bg-gray-100 px-3 py-1 rounded w-fit min-w-[140px] text-center flex items-center justify-between gap-2"
      onClick={() => setShowTimeDropdown(!showTimeDropdown)}
    >
      {formatTime(currentTime, timeFormat === "12")}
      <ChevronDown className="w-4 h-4 text-gray-600" />
    </div>
    {showTimeDropdown && (
      <div className="absolute right-0 mt-1 bg-white shadow-md border rounded w-44 z-10">
        <div
          className="p-2 hover:bg-indigo-50 cursor-pointer"
          onClick={() => {
            setTimeFormat("24");
            setShowTimeDropdown(false);
          }}
        >
          {formatTime(currentTime, false)} (24-Hour)
        </div>
        <div
          className="p-2 hover:bg-indigo-50 cursor-pointer"
          onClick={() => {
            setTimeFormat("12");
            setShowTimeDropdown(false);
          }}
        >
          {formatTime(currentTime, true)} (12-Hour)
        </div>
      </div>
    )}
  </div>
</div>

            {/* Font Color */}
            <div className="mb-6 flex justify-between items-center gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <Palette />
                <p>Font Color</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {Object.keys(colorClasses).map((color) => (
                  <div
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-6 w-6 rounded-full cursor-pointer transition-transform duration-150 ${
                      colorClasses[color as keyof typeof colorClasses]
                    } ${selectedColor === color ? "ring-2 ring-black scale-110" : ""}`}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>

{/* Open Website */}
<div className="mb-6">
  <div className="flex items-center justify-between font-semibold mb-2">
    <div className="flex items-center gap-2">
      <Globe />
      <p>Open Website</p>
    </div>
    <select className="border rounded p-2">
      <option>In the current tab</option>
      <option>In a new tab</option>
    </select>
  </div>
</div>



{/* Import & Export Settings */}
<div className="mt-4">
  {/* Import Settings */}
  <div className="flex items-center gap-4 mb-4">
    <FolderDown />
    <p className="font-semibold">Import Settings</p>
    <button className="bg-indigo-500 text-white px-4 py-2 rounded ml-auto">Select File</button>
  </div>

  {/* Export Settings */}
  <div className="flex items-center gap-4">
    <FolderUp />
    <p className="font-semibold">Export Settings</p>
    <button className="bg-indigo-500 text-white px-4 py-2 rounded ml-auto">Download</button>
  </div>
</div>

          </>
        )}

        {/* Other Panels */}
        {activeSection === "Background" && (
          <div>
            <p className="font-semibold mb-2">Background Settings</p>
            <p className="text-sm text-gray-600">Upload or choose wallpapers here.</p>
          </div>
        )}
        {activeSection === "Screen Saver" && (
          <div>
            <p className="font-semibold mb-2">Screen Saver</p>
            <p className="text-sm text-gray-600">Set your preferred screen saver options.</p>
          </div>
        )}
        {activeSection === "Get Help" && (
          <div>
            <p className="font-semibold mb-2">Help Center</p>
            <p className="text-sm text-gray-600">Visit FAQ or contact support.</p>
          </div>
        )}
        {activeSection === "What's New" && (
          <div>
            <p className="font-semibold mb-2">Changelog</p>
            <p className="text-sm text-gray-600">Here's what changed recently.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  ChevronDown,
  Settings,
  Image,
  Monitor,
  Clock,
  Palette,
  Globe,
  TvMinimal,
} from "lucide-react";
import { RootState } from '../store/store';
import {
  setTimeFormat,
  setFontColor,
  setOpenWebsite,
  setBackground,
  setScreenSaverEnabled,
  setScreenSaverFontColor,
  setScreenSaverStartAfterTime,
  setTheme,
} from '../store/settingSlice';

const SettingsPanel = () => {
  const [activeSection, setActiveSection] = useState("General");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showDelayDropdown, setShowDelayDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const {
    timeFormat,
    fontColor,
    openWebsite,
    background,
    screenSaver,
    theme,
  } = useSelector((state: RootState) => state.settings);

  const [selectedWallpaper, setSelectedWallpaper] = useState<string>(background);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>(theme);

  const delays = [
    { label: "10 sec", value: 10 },
    { label: "20 sec", value: 20 },
    { label: "40 sec", value: 40 },
    { label: "1 min", value: 60 },
    { label: "2 min", value: 120 },
    { label: "5 min", value: 300 },
  ];

  const wallpapers = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    url: `/wallpapers/wallpaper${i + 1}.jpg`,
    name: `wallpaper${i + 1}.jpg`
  }));

  const themes = [
    { id: 'light', name: 'Light Theme' },
    { id: 'dark', name: 'Dark Theme' },
  ];

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
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTimeDropdown(false);
        setShowDelayDropdown(false);
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

  const getCurrentDelayLabel = () => {
    const delay = delays.find(d => d.value === screenSaver.startAfterSeconds);
    return delay ? delay.label : delays[1].label;
  };

  return (
    <div className="w-[600px] h-[400px] rounded-2xl relative p-2 flex justify-between bg-white overflow-hidden no-scrollbar">
      {/* Sidebar */}
      <div className="w-1/3 border-r p-4 bg-gray-50">
        {sidebarItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActiveSection(item.label)}
            className={`p-2 rounded cursor-pointer mb-2 flex items-center gap-2 ${
              activeSection === item.label
                ? "bg-indigo-100 font-semibold"
                : "hover:text-blue-600"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6 overflow-y-auto text-sm text-gray-800 overflow-hidden no-scrollbar">
        {activeSection === "General" && (
          <>
            {/* Time Format */}
            <div ref={dropdownRef} className="mb-6 pb-6 border-b flex justify-between items-center gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4" />
                <p>Time Format</p>
              </div>
              <div className="relative">
                <div
                  className="cursor-pointer bg-gray-100 px-3 py-1 rounded w-fit min-w-[140px] text-center flex items-center justify-between gap-2"
                  onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                >
                  {formatTime(currentTime, timeFormat === "12h")}
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>
                {showTimeDropdown && (
                  <div className="absolute right-0 mt-1 bg-white shadow-md border rounded w-44 z-10">
                    <div
                      className="p-2 hover:bg-indigo-50 cursor-pointer"
                      onClick={() => {
                        dispatch(setTimeFormat("24h"));
                        setShowTimeDropdown(false);
                      }}
                    >
                      {formatTime(currentTime, false)} (24-Hour)
                    </div>
                    <div
                      className="p-2 hover:bg-indigo-50 cursor-pointer"
                      onClick={() => {
                        dispatch(setTimeFormat("12h"));
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
            <div className="mb-6 pb-6 border-b flex justify-between items-center gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <Palette />
                <p>Font Color</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {Object.keys(colorClasses).map((color) => (
                  <div
                    key={color}
                    onClick={() => dispatch(setFontColor(color))}
                    className={`h-6 w-6 rounded-full cursor-pointer transition-transform duration-150 ${
                      colorClasses[color as keyof typeof colorClasses]
                    } ${fontColor === color ? "ring-2 ring-black scale-110" : ""}`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Open Website */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center justify-between font-semibold mb-2">
                <div className="flex items-center gap-2">
                  <Globe />
                  <p>Open Website</p>
                </div>
                <select
                  className="border rounded p-2"
                  value={openWebsite}
                  onChange={(e) => dispatch(setOpenWebsite(e.target.value as 'new_tab' | 'current_tab'))}
                >
                  <option value="current_tab">In the current tab</option>
                  <option value="new_tab">In a new tab</option>
                </select>
              </div>
            </div>
          </>
        )}

        {activeSection === "Background" && (
          <div>
            <h2 className="font-semibold text-lg mb-4">Background</h2>
            <div className="grid grid-cols-3 gap-3">
              {wallpapers.map((wallpaper) => (
                <div
                  key={wallpaper.id}
                  className={`cursor-pointer overflow-hidden rounded ${
                    selectedWallpaper === wallpaper.name ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => {
                    setSelectedWallpaper(wallpaper.name);
                    dispatch(setBackground(wallpaper.name));
                  }}
                >
                  <img
                    src={wallpaper.url}
                    alt={`Wallpaper ${wallpaper.id}`}
                    className="w-full h-[80px] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "Screen Saver" && (
          <>
            {/* Screen Saver Toggle */}
            <div className="mb-6 pb-6 border-b flex justify-between items-center gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <TvMinimal className="w-4 h-4" />
                <p>Turn On</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={screenSaver.enabled}
                  onChange={() => dispatch(setScreenSaverEnabled(!screenSaver.enabled))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {/* Font Color */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-2 font-semibold mb-5">
                <Palette className="w-4 h-4" />
                <p>Font Color</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(colorClasses).map((color) => (
                  <div
                    key={color}
                    onClick={() => dispatch(setScreenSaverFontColor(color))}
                    className={`h-5 w-5 rounded-full cursor-pointer transition-transform duration-150 ${
                      colorClasses[color as keyof typeof colorClasses]
                    } ${screenSaver.fontColor === color ? "ring-2 ring-black scale-110" : ""}`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Delay Selection */}
            <div ref={dropdownRef} className="mb-6 pb-6 border-b flex justify-between items-center gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4" />
                <p>Start After</p>
              </div>
              <div className="relative">
                <div
                  className="cursor-pointer bg-gray-100 px-3 py-1 rounded flex items-center justify-between gap-2 min-w-[120px]"
                  onClick={() => setShowDelayDropdown(!showDelayDropdown)}
                >
                  {getCurrentDelayLabel()}
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>
                {showDelayDropdown && (
                  <div className="absolute right-0 mt-1 bg-white shadow-md border rounded w-40 z-10">
                    {delays.map((delay) => (
                      <div
                        key={delay.value}
                        className="p-2 hover:bg-indigo-50 cursor-pointer"
                        onClick={() => {
                          dispatch(setScreenSaverStartAfterTime(delay.value));
                          setShowDelayDropdown(false);
                        }}
                      >
                        {delay.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <div className="flex items-center gap-2 font-semibold mb-4">
                <Palette className="w-4 h-4" />
                <p>Theme</p>
              </div>
              <div className="flex gap-3">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`cursor-pointer border rounded overflow-hidden w-20 h-16 flex items-center justify-center ${
                      selectedTheme === theme.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => {
                      setSelectedTheme(theme.id as 'light' | 'dark');
                      dispatch(setTheme(theme.id as 'light' | 'dark'));
                    }}
                  >
                    <span>{theme.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
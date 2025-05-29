import { useEffect, useState } from "react";
import { useResponsiveGrid } from "@/hooks/useResponsiveGrid";

type AnalogClockProps = {
  theme?: "light" | "dark";
};

const AnalogClock = ({ theme = "light" }: AnalogClockProps) => {
  const [time, setTime] = useState(new Date());
  const { WIDGET_HEIGHT } = useResponsiveGrid();
  const clockSize = WIDGET_HEIGHT - 10;

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const hourDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  const minDeg = time.getMinutes() * 6;
  const secDeg = time.getSeconds() * 6;

  const numbers = [
    { label: "12", className: "top-2 left-1/2 -translate-x-1/2" },
    { label: "3", className: "top-1/2 right-2 -translate-y-1/2" },
    { label: "6", className: "bottom-2 left-1/2 -translate-x-1/2" },
    { label: "9", className: "top-1/2 left-2 -translate-y-1/2" },
  ];

  const isDark = theme === "dark";

  return (
    <div
      className={`relative mx-auto flex items-center justify-center rounded-full shadow-md ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      }`}
      style={{ width: clockSize, height: clockSize }}
    >
      {/* Hands */}
      <div
        className={`absolute origin-bottom ${isDark ? "bg-white" : "bg-gray-800"}`}
        style={{
          width: 4,
          height: clockSize * 0.22,
          top: clockSize * 0.28,
          left: "50%",
          transform: `translateX(-50%) rotateZ(${hourDeg}deg)`,
        }}
      />
      <div
        className={`absolute origin-bottom ${isDark ? "bg-gray-300" : "bg-gray-600"}`}
        style={{
          width: 2,
          height: clockSize * 0.32,
          top: clockSize * 0.18,
          left: "50%",
          transform: `translateX(-50%) rotateZ(${minDeg}deg)`,
        }}
      />
      <div
        className="absolute w-[1.5px] bg-red-500 origin-bottom"
        style={{
          height: clockSize * 0.42,
          top: clockSize * 0.08,
          left: "50%",
          transform: `translateX(-50%) rotateZ(${secDeg}deg)`,
        }}
      />

      {/* Center circle */}
      <div
        className={`absolute w-3 h-3 rounded-full border-2 z-10 ${
          isDark ? "bg-white border-gray-800" : "bg-gray-400 border-white"
        }`}
      />

      {/* Clock numbers */}
      {numbers.map(({ label, className }) => (
        <span
          key={label}
          className={`absolute text-xs font-semibold select-none ${className}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
};

export default AnalogClock;

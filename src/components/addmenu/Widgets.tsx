import { useState } from "react";
import search from "./icons/search.png";
import notes from "./icons/notes.png";
import clock from "./icons/clock.png";
import image from "./icons/1.png";
import ai from "./icons/ai.png";
import checklist from "./icons/checklist.png";
import AnalogClock from "../ui/analogClock";
import AnalogClock2 from "../ui/AnalogClock2";

const widgetOptions = [
  { name: "Search", imgSrc: search },
  { name: "Notes", imgSrc: notes },
  { name: "Clock", imgSrc: clock },
  { name: "Image", imgSrc: image },
  { name: "ChatAI", imgSrc: ai },
  { name: "To Do", imgSrc: checklist },
];

// Only analog clocks now
const clockOptions = [
  {
    name: "Analog Clock 1",
    imgSrc: null,
    component: <AnalogClock />,
  },
  {
    name: "Analog Clock 2",
    imgSrc: null,
    component: <AnalogClock2 />,
  },
];

const Widgets = () => {
  const [showClockSlider, setShowClockSlider] = useState(false);
  const [clockIndex, setClockIndex] = useState(0);

  const handleWidgetClick = (widgetName) => {
    if (widgetName === "Clock") {
      setShowClockSlider(true);
    }
  };

  const handleAddClockWidget = () => {
    const selectedClock = clockOptions[clockIndex];
    console.log(`Selected Clock Type: ${selectedClock.name}`);
    setShowClockSlider(false);
  };

  return (
    <div className="w-full h-[450px] bg-white rounded-2xl p-4 shadow-inner overflow-hidden flex items-center justify-center">
      {!showClockSlider ? (
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
          {widgetOptions.map((widget, index) => (
            <div
              key={index}
              onClick={() => handleWidgetClick(widget.name)}
              className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
              style={{ width: "90px" }}
            >
              <img
                src={widget.imgSrc}
                alt={widget.name}
                className="w-16 h-10 object-contain rounded-full"
              />
              <span className="text-sm mt-2 font-medium text-gray-900 text-center">
                {widget.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="w-28 h-28 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex">
              {clockOptions[clockIndex].component}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="text-2xl px-4"
              onClick={() =>
                setClockIndex((prev) =>
                  prev === 0 ? clockOptions.length - 1 : prev - 1
                )
              }
            >
              ◀
            </button>
            <span className="text-lg">{clockOptions[clockIndex].name}</span>
            <button
              className="text-2xl px-4"
              onClick={() =>
                setClockIndex((prev) =>
                  prev === clockOptions.length - 1 ? 0 : prev + 1
                )
              }
            >
              ▶
            </button>
          </div>
          <button
            className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700"
            onClick={handleAddClockWidget}
          >
            Add widget
          </button>
        </div>
      )}
    </div>
  );
};

export default Widgets;

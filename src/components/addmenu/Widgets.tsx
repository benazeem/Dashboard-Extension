import { useState } from "react";
import search from "./icons/search.png";
import notes from "./icons/notes.png";
import clock from "./icons/clock.png";
import image from "./icons/1.png";
import ai from "./icons/ai.png";
import checklist from "./icons/checklist.png";
import AnalogClock from "../ui/AnalogClock";
import AnalogClock2 from "../ui/AnalogClock2";

const widgetOptions = [
  { name: "Search", imgSrc: search },
  { name: "Notes", imgSrc: notes },
  { name: "Clock", imgSrc: clock },
  { name: "Image", imgSrc: image },
  { name: "ChatAI", imgSrc: ai },
  { name: "To Do", imgSrc: checklist },
];

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
  const [addedWidgets, setAddedWidgets] = useState([]);

  const handleWidgetClick = (widgetName) => {
    if (widgetName === "Clock") {
      setShowClockSlider(true);
    }
  };

  const handleAddClockWidget = () => {
    const selectedClock = clockOptions[clockIndex];
    setAddedWidgets([
      ...addedWidgets,
      { name: selectedClock.name, component: selectedClock.component },
    ]);
    setShowClockSlider(false);
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl p-4 shadow-inner overflow-hidden flex flex-col items-center justify-center">
      {!showClockSlider ? (
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
          {widgetOptions.map((widget, index) => (
            <div
              key={`option-${index}`}
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
          {addedWidgets.map((widget, index) => (
            <div
              key={`added-${index}`}
              className="flex flex-col items-center justify-center"
              style={{ width: "90px" }}
            >
              <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                {widget.component}
              </div>
              <span className="text-sm mt-2 font-medium text-gray-900 text-center">
                {widget.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center justify-center gap-6 ">
            <button
              className="text-2xl px-4 flex-shrink-0"
              onClick={() =>
                setClockIndex((prev) =>
                  prev === 0 ? clockOptions.length - 1 : prev - 1
                )
              }
              aria-label="Previous Clock"
            >
              ◀
            </button>

            <div className="w-28 h-28  flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 mx-7 ">
                
              {clockOptions[clockIndex].component}
            
            </div>

            <button
              className="text-2xl px-4 flex-shrink-0"
              onClick={() =>
                setClockIndex((prev) =>
                  prev === clockOptions.length - 1 ? 0 : prev + 1
                )
              }
              aria-label="Next Clock"
            >
              ▶
            </button>
          </div>

          <button
            className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 mt-6"
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

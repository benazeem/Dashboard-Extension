import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addWidget } from "../../store/widgetSlice";
import { hideModal } from "../../store/modalSlice";
import { v4 as uuidv4 } from "uuid";

import search from "./icons/search.png";
import notes from "./icons/notes.png";
import clock from "./icons/clock.png";
import image from "./icons/1.png";
import ai from "./icons/ai.png";
import checklist from "./icons/checklist.png";
import AnalogClock from "../ui/AnalogClock"; 
import { RootState } from "@/store/store";
import getAvailableGridPosition from "@/utils/getAvailableGridPosition";
import { getAllItems } from "@/store/selectors";

const widgetOptions = [
  { name: "Search", type: "search", imgSrc: search },
  { name: "Notes", type: "notes", imgSrc: notes },
  { name: "Clock", type: "clock", imgSrc: clock },
  { name: "Image", type: "image", imgSrc: image },
  { name: "ChatAI", type: "chatAI", imgSrc: ai },
  { name: "To Do", type: "todo", imgSrc: checklist },
];

const clockOptions = [
  { name: "Analog Clock Light", component: <AnalogClock theme="light" /> },
  { name: "Analog Clock Dark", component: <AnalogClock theme="dark" /> },
];

const Widgets = () => {
  const dispatch = useDispatch();
  const widgets = useSelector((state: RootState) => state.widgets.items);

  const [showClockSlider, setShowClockSlider] = useState(false);
  const [clockIndex, setClockIndex] = useState(0);

  const allItems = useSelector(getAllItems);

const pos = getAvailableGridPosition(
  allItems,
  { width: 1, height: 1 },
);



  const handleWidgetClick = (widgetName: string) => {
    if (widgetName === "Clock") setShowClockSlider(true);
    // You can handle other types here similarly
  };

  const handleAddClockWidget = () => {
    const selected = clockOptions[clockIndex];
    dispatch(
      addWidget({
        id: uuidv4(),
        name: selected.name,
        type: "clock",
        component: selected.component,
        width:1,
        height: 1,
        x:pos.x,
        y: pos.y,
        parent: pos.parent,
      })
    );
    setShowClockSlider(false);
    dispatch(hideModal())
  };

  console.log(widgets)

  return (
    <div className="w-full h-full bg-white rounded-2xl p-4 shadow-inner flex flex-col items-center justify-center">
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
        
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center justify-center gap-6 ">
            <button
              className="text-2xl px-4"
              onClick={() =>
                setClockIndex((prev) =>
                  prev === 0 ? clockOptions.length - 1 : prev - 1
                )
              }
              aria-label="Previous Clock"
            >
              ◀
            </button>
              {clockOptions[clockIndex].component}
            <button
              className="text-2xl px-4"
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

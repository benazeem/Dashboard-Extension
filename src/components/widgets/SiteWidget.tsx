import { Cross } from "lucide-react";
import { SiteWidgetType } from "../../types";
import { useResponsiveGrid } from "../../hooks/useResponsiveGrid";
import FolderWidget from "./FolderWidget";
import DndMonitor from "../dnd-kit/DndMonitor";
import { useSelector } from "react-redux";
import { getAllSites } from "@/store/selectors";
import { DragOverEvent } from "@dnd-kit/core";
import { useState } from "react";
import { usePointerClickOpen } from "@/hooks/usePointerClickOpen";

type mergePreviewType = {
  iconList: string[]; // Map of icon names to their URLs
  id: string | null;
};

function SiteWidget({ icon, url, name, parent, id }: SiteWidgetType) {
  const { WIDGET_HEIGHT } = useResponsiveGrid();
  const [mergePreview, setMergerPreview] = useState<mergePreviewType>({
    iconList: [icon, icon], // Default to the current icon for both items
    id: null,
  });
  const sites = useSelector(getAllSites);
  const { handlePointerDown } = usePointerClickOpen({ url });

  const style: React.CSSProperties =
    parent === "dock"
      ? {
          width: `${WIDGET_HEIGHT * 0.4}px`,
          height: `${WIDGET_HEIGHT * 0.4}px`,
        }
      : {};

  const handleSiteOverSite = (event: DragOverEvent) => {
    setMergerPreview({ iconList: [icon, icon], id: null });
    const { active, over } = event;
    if (!over || !active) return;
    const overId = over.id as string;
    const activeId = active.id as string;
    if (activeId === overId.slice(5)) return;
    if (activeId.startsWith("bookmark-")) {
      const activeItemIcon = sites.find((site) => site.id === activeId)?.icon;
      const overItemIcon = sites.find(
        (site) => site.id === overId.slice(5)
      )?.icon;
      if (activeItemIcon && overItemIcon) {
        setMergerPreview({
          iconList: [activeItemIcon, overItemIcon],
          id: overId.slice(5),
        });
      } else {
        setMergerPreview({ iconList: [icon, icon], id: null });
      }
    }
  };
  const handleDragCancel = () => {
    setMergerPreview({ iconList: [icon, icon], id: null });
  };

  return (
    <>
      <DndMonitor
        handleDragOver={handleSiteOverSite}
        handleDragCancel={handleDragCancel}
        handleDragEnd={handleDragCancel}
        handleDragAbort={handleDragCancel}
      />
      {mergePreview.id && mergePreview.id === id ? (
        <FolderWidget
          key={crypto.getRandomValues(new Uint32Array(1))[0]}
          FolderProps={{ iconList: mergePreview.iconList }}
        />
      ) : (
        <>
          <div
            role="button"
            title={name}
            className="h-full w-full flex items-center justify-center flex-col overflow-hidden box-border animate-wrapper"
            onPointerDown={handlePointerDown}
          >
            <div
              className={`icon-container relative flex items-center justify-center ${
                parent === "dock" ? "" : "container40"
              }`}
              style={style}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="flex items-center justify-center overflow-hidden w-full h-full rounded-md">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${icon})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
              </div>
            </div>
            {parent !== "dock" ? (
              <div className="title mt-2.5 min-h-4 whitespace-nowrap w-full px-5 box-border overflow-hidden text-ellipsis text-center ">
                {name}
              </div>
            ) : null}
          </div>
          <div className="remove-button absolute cursor-pointer bg-gray-50 rounded-full invisible justify-center items-center select-none transition 0.1s ease w-6 h-6 right-8 top-8  ">
            <Cross />
          </div>
        </>
      )}
    </>
  );
}

export default SiteWidget;

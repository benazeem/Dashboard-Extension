import { useState } from "react";
import { Cross } from "lucide-react";
// import { useResponsiveGrid } from "../../hooks/useResponsiveGrid";
import { type FolderWidgetType } from "../types";
import DndMonitor from "../dnd-kit/DndMonitor";
import { DragOverEvent } from "@dnd-kit/core";
import { useSelector } from "react-redux";
import { getAllSites } from "@/store/selectors";

type IconList = {
  iconList?: string[];
};

type FolderWidgetProps = {
  FolderProps: IconList | FolderWidgetType;
};

function FolderWidget({ FolderProps }: FolderWidgetProps) {
  const { itemIcons, name, id } = FolderProps as FolderWidgetType;
  const { iconList } = FolderProps as IconList;
  // const { WIDGET_HEIGHT } = useResponsiveGrid();
  // const [folderName, setFolderName] = useState(name);
  const [hoverPreviewItemIcon, setHoverPreviewItemIcon] = useState<string | null>(null);
  const sites = useSelector(getAllSites);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !active) return;
    if (active.id === over.id) return;

    const overId = over.id as string;
    const activeId = active.id as string;

    if (activeId.startsWith("bookmark-")) {
      const folderId = overId.slice(5);
      if (folderId === id) {
        const activeItemIcon = sites.find((site) => site.id === activeId)?.icon;
        if (activeItemIcon) {
          setHoverPreviewItemIcon(activeItemIcon);
        }
      } else {
        setHoverPreviewItemIcon(null);
      }
    }
  };

  const handleDragCancel = () => {
    setHoverPreviewItemIcon(null);
  };

  return (
    <>
      <DndMonitor
        handleDragOver={handleDragOver}
        handleDragCancel={handleDragCancel}
        handleDragEnd={handleDragCancel}
        handleDragAbort={handleDragCancel}
      />
      <div
        title={name}
        id={id}
        className="h-full w-full flex items-center justify-center flex-col overflow-hidden box-border animate-wrapper"
      >
        <div className="icon-container relative flex items-center justify-center rounded-md container40">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="flex items-center justify-center overflow-hidden w-full h-full">
              <div className="app-folder-preview h-full w-full overflow-hidden">
                <div className="folder-preview-miniature w-full h-full grid gap-[8%] p-[16%] box-border rounded-[20%] grid-cols-3 grid-rows-3 bg-white/50">
                  {(iconList ?? itemIcons)?.map((icon: string) => (
                    <div
                      className="w-full h-full flex items-center justify-center overflow-hidden rounded-xs"
                      key={crypto.getRandomValues(new Uint32Array(1))[0]}
                    >
                      <div className="w-full h-full relative rounded-[30%]">
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
                  ))}
                  {hoverPreviewItemIcon && (
                    <div
                      className="w-full h-full flex items-center justify-center overflow-hidden rounded-xs"
                      key={crypto.getRandomValues(new Uint32Array(1))[0]}
                    >
                      <div className="w-full h-full relative rounded-[30%]">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url(${hoverPreviewItemIcon})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="title mt-2.5 min-h-4 whitespace-nowrap w-full px-5 box-border overflow-hidden text-ellipsis text-center">
          {name}
        </div>
      </div>
      <div className="remove-button absolute cursor-pointer bg-gray-50 rounded-full invisible justify-center items-center select-none transition 0.1s ease w-6 h-6 right-8 top-8">
        <Cross />
      </div>
    </>
  );
}

export default FolderWidget;

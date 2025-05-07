import React from "react";
import {useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import SiteWidget from "../widgets/SiteWidget";
import FolderWidget from "../widgets/FolderWidget";
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import { type SiteItem, FolderType } from "../types";

interface DraggableItems {
  DragItem: SiteItem | FolderType;
}

interface DraggableProps extends DraggableItems {
width?: number;
height?: number;
}

export default function Draggable({
  DragItem,
  width,
  height,
}: DraggableProps) {
const { attributes, listeners, setNodeRef: draggableRef, transform } = useDraggable({ 
    id: DragItem?.id, 
    data: { parent: DragItem.parent, x: DragItem.x, y: DragItem.y } 
  });  
const { setNodeRef: droppableRef} = useDroppable({ 
    id: `drop-${DragItem.id}`,
  });

  const {WIDGET_HEIGHT} = useResponsiveGrid();
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transform ? "none" : "transform 0.3s easeIn-out",
    position: "absolute",
    height: `${DragItem.parent==='dock'?( (WIDGET_HEIGHT*0.4)):(height? height * WIDGET_HEIGHT:WIDGET_HEIGHT)-6}px`,
    width: `${DragItem.parent === 'dock' ? (WIDGET_HEIGHT * 0.4) : (width ? width * WIDGET_HEIGHT : WIDGET_HEIGHT) - 6}px`,
    left: `${DragItem.parent==='dock'?( (DragItem.x*WIDGET_HEIGHT*0.4)):(height? DragItem.x*height * WIDGET_HEIGHT: DragItem.x*WIDGET_HEIGHT)}px`,
    top: `${DragItem.parent==='dock'?( 0):(height?DragItem.y*height * WIDGET_HEIGHT:DragItem.y*WIDGET_HEIGHT)}px`,
    borderRadius: "3vmin",
  }; 


  return (
    <>
    
    <TooltipProvider>
    <Tooltip>
    <TooltipTrigger asChild>
    <div
     onClick={(e) => {
        e.stopPropagation(); // Prevent click event from bubbling up
        if ('url' in DragItem && DragItem.url) {
          window.open(DragItem.url, "_blank"); // Open URL in a new tab
        }
      }}
      ref={(node) => {
        draggableRef(node);
        if (DragItem.type === "folder" || DragItem.type === "site") {
          droppableRef(node);
        }
      }}
      {...attributes}
      {...listeners}
      style={style}
      aria-label={DragItem.name}
      className={`draggable-item  z-20 box-border`}
      data-parent={DragItem.parent}
      id={DragItem.id}
    >  
      <div className="app-widget-renderer h-full w-full select-none relative flex items-center justify-center" style={{ borderRadius: 'inherit' }}>
      {DragItem.type === "site" && (
        <SiteWidget 
          id={DragItem.id}
          icon={DragItem.icon}
          url={DragItem.url}
          name={DragItem.name}
          parent={DragItem.parent}
          />)} 
        {DragItem.type === "folder" && (
          <FolderWidget key={DragItem.id} FolderProps={{name:DragItem.name, id:DragItem.id, hoverPreviewItemIcon:DragItem.hoverPreviewItemIcon, itemIcons:DragItem.itemIcons, itemIds:DragItem.itemIds}}/>)}
      </div>
      </div>
</TooltipTrigger>
    <TooltipContent>{DragItem.name}</TooltipContent>
    </Tooltip>
    </TooltipProvider>
    </>
  );
}

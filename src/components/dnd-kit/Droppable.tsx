import { useDroppable } from "@dnd-kit/core";
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';


interface DroppableProps {
  id: string;
  children: React.ReactNode;
  height?: string | number; // Can be string ("100%") or number (300)
  width?: string | number;
  gap?: string; // Optional, flexible gap size
  className?: string; // Allow external custom classes
}

export default function Droppable({
  id,
  children, 
  width,
  className
}: DroppableProps) {
  const { setNodeRef } = useDroppable({ id });
 const { DROPPABLE_AREA_WIDTH,DROPPABLE_AREA_HEIGHT, DOCK_HEIGHT} = useResponsiveGrid();
  const style: React.CSSProperties = {
    position: "relative",
    width:`${id==="dock"? width :(DROPPABLE_AREA_WIDTH)}px`,
    height:`${id==="dock"? (DOCK_HEIGHT)+10: DROPPABLE_AREA_HEIGHT }px`,
    overflow :"visible",
    transition: "background-color 0.2s ease-in-out",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}

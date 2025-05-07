import { DragAbortEvent, DragCancelEvent, DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent, useDndMonitor } from '@dnd-kit/core';

type DndMonitorProps = {
  handleDragOver?: (event:DragOverEvent) => void;
    handleDragMove?: (event: DragMoveEvent) => void;
    handleDragEnd?: (event: DragEndEvent) => void;
    handleDragAbort?: (event: DragAbortEvent) => void;
    handleDragStart?: (event: DragStartEvent) => void;
    handleDragCancel?: (event: DragCancelEvent) => void;
};

// Define the DndMonitor component
const DndMonitor = ({ handleDragOver, handleDragMove, handleDragEnd, handleDragAbort, handleDragStart, handleDragCancel }: DndMonitorProps) => {
  useDndMonitor({
    onDragStart(event) {
      handleDragStart?.(event);
    },
    onDragOver(event) {
      handleDragOver?.(event);
    },
    onDragMove(event) {
      handleDragMove?.(event);
    },
    onDragEnd(event) {
      handleDragEnd?.(event);
    },
    onDragAbort(event) {
     handleDragAbort?.(event);
    },
    onDragCancel(event) {
      handleDragCancel?.(event);
    },
    onDragPending(event) {
      // Handle drag pending event if needed
    }
  });

  return null; // This component does not render anything itself, it just monitors the DnD events
};

export default DndMonitor;

import { setactiveFolder } from "@/store/folderSlice";
import { showModal } from "@/store/modalSlice";
import { useRef } from "react";
import { useDispatch } from "react-redux";

interface PropTypes {
  url?: string;
  folderId?: string;
}

export const usePointerClickOpen = ({url,folderId}:PropTypes) => {
  const dispatch = useDispatch();
  
    const isDragging = useRef(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = false;
    startPoint.current = { x: e.clientX, y: e.clientY };

    window.addEventListener("pointermove", globalPointerMove);
    window.addEventListener("pointerup", globalPointerUp);
  };

  const globalPointerMove = (e: PointerEvent) => {
    if (!startPoint.current) return;
    const dx = Math.abs(e.clientX - startPoint.current.x);
    const dy = Math.abs(e.clientY - startPoint.current.y);
    if (dx > 4 || dy > 4) {
      isDragging.current = true;
    }
  };

  const globalPointerUp = (e: PointerEvent) => {
    if (!startPoint.current) return;
    if(isDragging.current) return;
    e.preventDefault();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    if (folderId) {
     dispatch(setactiveFolder({folderId}));
     dispatch(showModal("folder"));
    }
    isDragging.current = false;
    startPoint.current = null;

    // Cleanup
    window.removeEventListener("pointermove", globalPointerMove);
    window.removeEventListener("pointerup", globalPointerUp);
  };

  return {
    handlePointerDown,
  };
};

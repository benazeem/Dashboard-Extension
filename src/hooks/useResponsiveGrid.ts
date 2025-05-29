import { useEffect, useState } from "react";

export const useResponsiveGrid = () => {
  const [gridSize, setGridSize] = useState({
    WIDGET_HEIGHT: 0,
    DROPPABLE_AREA_WIDTH: 0,
    DROPPABLE_AREA_HEIGHT: 0,
    DOCK_HEIGHT: 0,
    SCREEN_WIDTH: 0,
    SCREEN_HEIGHT: 0,
    COLUMNS: 0,
    ROWS: 0,
  });

  const updateGridSize = () => {
    const SCREEN_WIDTH = window.innerWidth;
    const SCREEN_HEIGHT = window.innerHeight;

    const DROPPABLE_AREA_HEIGHT = SCREEN_HEIGHT * 0.73; // 75% of screen height
    const DROPPABLE_AREA_WIDTH = Math.floor(DROPPABLE_AREA_HEIGHT * 2.08); // 90% of screen width

    const DOCK_HEIGHT = Math.floor(DROPPABLE_AREA_HEIGHT * 0.08); // 10% of screen height

    // const columns = 6.5;
    const rows = 3.5;

    const COLUMNS = 6; // Assuming a grid of 6 columns
    const ROWS = 3; // Assuming a grid of 3 rows

    // const WIDGET_WIDTH = Math.floor(DROPPABLE_AREA_WIDTH / columns);
    const WIDGET_HEIGHT = Math.floor(DROPPABLE_AREA_HEIGHT / rows);

    setGridSize({
      WIDGET_HEIGHT,
      DROPPABLE_AREA_WIDTH,
      DROPPABLE_AREA_HEIGHT,
      DOCK_HEIGHT,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      COLUMNS: COLUMNS,
      ROWS: ROWS,
    });
  };

  useEffect(() => {
    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  return gridSize;
};

const GRID_COLUMNS = 4;
const GRID_ROWS = 4;

export function isOccupied(x: number, y: number, width: number, height: number, items: any[]) {
  return items.some(item => {
    const overlapX = x < item.x + item.width && x + width > item.x;
    const overlapY = y < item.y + item.height && y + height > item.y;
    return overlapX && overlapY;
  });
}

export function findEmptySpot(width: number, height: number, items: any[]) {
  for (let y = 0; y <= GRID_ROWS - height; y++) {
    for (let x = 0; x <= GRID_COLUMNS - width; x++) {
      if (!isOccupied(x, y, width, height, items)) {
        return { x, y };
      }
    }
  }
  return null;
}

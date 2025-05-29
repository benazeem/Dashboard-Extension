import { SiteItem, FolderType, WidgetItem } from "../types";
function getAvailableGridPosition(
  allItems: (SiteItem | FolderType | WidgetItem )[],
  itemSize: { width: number; height: number },
  baseParent: string = "home"
): { x: number; y: number; parent: string } {

    const COLUMNS = 6;
    const ROWS = 3; 
  const pages = new Map<string, (SiteItem | FolderType | WidgetItem)[]>();

  // Group items by their parent pages
  for (const item of allItems) {
    if (!pages.has(item.parent)) {
      pages.set(item.parent, []);
    }
    pages.get(item.parent)!.push(item);
  }

  // Sort parent keys like ["home", "home-1", "home-2", ...]
  const sortedParents = Array.from(pages.keys()).sort((a, b) => {
    if (a === baseParent) return -1;
    if (b === baseParent) return 1;

    const getPageNum = (p: string) => parseInt(p.split("-")[1]) || 0;
    return getPageNum(a) - getPageNum(b);
  });

  for (const parent of sortedParents) {
    const occupied = new Set<string>();
    const items = pages.get(parent)!;

    for (const item of items) {
      for (let dx = 0; dx < item.width; dx++) {
        for (let dy = 0; dy < item.height; dy++) {
          occupied.add(`${item.x + dx},${item.y + dy}`);
        }
      }
    }

    for (let y = 0; y <= ROWS - itemSize.height; y++) {
      for (let x = 0; x <= COLUMNS - itemSize.width; x++) {
        let fits = true;

        for (let dx = 0; dx < itemSize.width; dx++) {
          for (let dy = 0; dy < itemSize.height; dy++) {
            if (occupied.has(`${x + dx},${y + dy}`)) {
              fits = false;
              break;
            }
          }
          if (!fits) break;
        }

        if (fits) return { x, y, parent };
      }
    }
  }

  const existingPageNumbers = sortedParents
    .map((p) =>
      p === baseParent ? 0 : parseInt(p.split("-")[1] || "0")
    )
    .filter((n) => !isNaN(n));

  const nextPageNum = Math.max(...existingPageNumbers, 0) + 1;
  const newParent = `${baseParent}-${nextPageNum}`;

  return {
    x: 0,
    y: 0,
    parent: newParent,
  };
}

export default getAvailableGridPosition;
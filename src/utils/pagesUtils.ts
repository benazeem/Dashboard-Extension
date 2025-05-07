import { findEmptySpot } from "./gridUtils";

interface Item {
  id: string;
  icon: string;
  label: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export function moveItemBetweenPages(
  pages: Item[][],
  currentPage: number,
  itemId: string,
  deltaX: number,
  containerWidth: number
) {
  const EDGE_THRESHOLD = 50;
  const newPages = [...pages];
  const item = newPages[currentPage].find(i => i.id === itemId);
  if (!item) return pages;

  let targetPage = currentPage;

  if (deltaX < EDGE_THRESHOLD && currentPage > 0) {
    targetPage = currentPage - 1;
  } else if (deltaX > containerWidth - EDGE_THRESHOLD) {
    targetPage = currentPage + 1;
    if (targetPage >= newPages.length) {
      // Create new page if dragging beyond last page
      newPages.push([]);
    }
  }

  const targetItems = [...newPages[targetPage]];
  const spot = findEmptySpot(item.width, item.height, targetItems);

  if (spot) {
    // Remove from old page
    newPages[currentPage] = newPages[currentPage].filter(i => i.id !== itemId);

    // Add to target page
    newPages[targetPage].push({ ...item, ...spot });

    // After moving, check if current page is empty
    if (newPages[currentPage].length === 0 && currentPage !== 0) {
      // Only delete if NOT home page
      newPages.splice(currentPage, 1);

      // Adjust targetPage if needed
      if (currentPage < targetPage) targetPage--;
    }
  }

  return newPages;
}

export function addItemToPages(pages: Item[][], newItem: Item) {
  const newPages = [...pages];
  let pageIndex = 0;
  let spot = null;

  while (pageIndex < newPages.length) {
    spot = findEmptySpot(newItem.width, newItem.height, newPages[pageIndex]);
    if (spot) break;
    pageIndex++;
  }

  if (spot) {
    newPages[pageIndex].push({ ...newItem, ...spot });
  } else {
    // No space: create new page
    newPages.push([{ ...newItem, x: 0, y: 0 }]);
  }

  return newPages;
}

export function deleteItemFromPages(pages: Item[][], itemId: string) {
  const newPages = pages.map(page => page.filter(item => item.id !== itemId));
  
  // Home page [0] must stay even if empty
  const cleanedPages = [newPages[0], ...newPages.slice(1).filter(page => page.length > 0)];
  
  // If home page becomes empty it's fine, but we keep it

  return cleanedPages;
}

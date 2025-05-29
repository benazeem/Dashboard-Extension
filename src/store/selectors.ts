import { RootState } from './store';


export const getAllItems = (state: RootState) => {
  const sites = state.sites.items;
  const folders = state.folders.folders;
  const widgets = state.widgets.items;
  const allItems = [...Object.values(sites), ...folders, ...widgets];
  return allItems;
}


export const selectSites = (state: RootState) => state.sites;
export const getAllSites = (state: RootState) => state.sites.items;

export const selectSiteById = (siteId: string) => (state: RootState) =>
  state.sites.items[siteId as keyof typeof state.sites.items];



// Folder Related Selectors
export const selectFolders = (state: RootState) => state.folders;
export const getAllFolders = (state: RootState) => state.folders.folders;
export const selectFolderById = (folderId: string) => (state: RootState) =>
  state.folders.folders.find((f: { id: string }) => f.id === folderId);

export const getAllSitesInFolder = (folderId: string) => (state: RootState) => {
  const folder = selectFolderById(folderId)(state);
  if (folder) {
    return folder.itemIds.map((id: string) => state.sites.items[id as keyof typeof state.sites.items]);
  }
  return [];
}

export const getAllSiteIconsInFolder = (folderId: string) => (state: RootState) => {
  const folder = selectFolderById(folderId)(state);
  if (!folder) return [];

  const siteIcons: string[] = [];
  folder.itemIds.forEach((id: string) => {
    const siteItem = state.sites.items.find(item => item.id === id);
    if (siteItem?.icon) {
      siteIcons.push(siteItem.icon);
    }
  });

  return siteIcons;
};



// Page Related Selectors

export const selectPages = (state: RootState) => state.pages.pages;
export const selectCurrentPage = (state: RootState) => state.pages.currentPage;
export const selectCurrentPageId = (state: RootState) =>
  state.pages.pages[state.pages.currentPage].id;

export const selectCurrentPageItems = (state: RootState) => {
  const currentPageId = selectCurrentPageId(state);
  const items = [...state.sites.items,...state.folders.folders]
  return items.filter((item) => item.parent === currentPageId);
}
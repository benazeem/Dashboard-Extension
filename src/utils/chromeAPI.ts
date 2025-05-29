export const getBookmarks = (): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree((results) => resolve(results));
  });
};

export const getHistory = (): Promise<chrome.history.HistoryItem[]> => {
  return new Promise((resolve) => {
    chrome.history.search({ text: '', startTime: 0, maxResults: 100000000 }, (results) => resolve(results));
  });
};

export const getDownloads = (): Promise<chrome.downloads.DownloadItem[]> => {
  return new Promise((resolve) => {
    chrome.downloads.search({}, (results) => resolve(results));
  });
};

export const getAllTabs = (): Promise<chrome.tabs.Tab[]> => {
  return new Promise((resolve) => {
    chrome.tabs.query({}, resolve);
  });
};

export const closeTab = (tabId: number): Promise<void> => {
  return new Promise((resolve) => {
    chrome.tabs.remove(tabId, () => resolve());
  });
};

export const createTab = (url: string): Promise<chrome.tabs.Tab> => {
  return new Promise((resolve) => {
    chrome.tabs.create({ url }, (tab) => resolve(tab));
  });
};

export const getAllExtensions = (): Promise<chrome.management.ExtensionInfo[]> => {
  return new Promise((resolve) => {
    chrome.management.getAll(resolve);
  });
};

export const toggleExtension = (id: string, enable: boolean): Promise<void> => {
  return new Promise((resolve) => {
    chrome.management.setEnabled(id, enable, () => resolve());
  });
};

export const getRecentlyClosed = (): Promise<chrome.sessions.Session[]> => {
  return new Promise((resolve) => {
    chrome.sessions.getRecentlyClosed({}, resolve);
  });
};

export const restoreLastSession = (): Promise<chrome.sessions.Session | undefined> => {
  return new Promise((resolve) => {
    chrome.sessions.restore(resolve);
  });
};

export const getBookmarks = (): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree((results) => resolve(results));
  });
};

export const getHistory = (): Promise<chrome.history.HistoryItem[]> => {
  return new Promise((resolve) => {
    chrome.history.search({ text: '', maxResults: 100000000 }, (results) => resolve(results));
  });
};

export const getDownloads = (): Promise<chrome.downloads.DownloadItem[]> => {
  return new Promise((resolve) => {
    chrome.downloads.search({}, (results) => resolve(results));
  });
};

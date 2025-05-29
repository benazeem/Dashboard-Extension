import React, { useEffect, useState } from 'react';
 import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button";

import { AppWindow, Bookmark, Clock, Download, History, Puzzle, X,} from 'lucide-react';
import { getBookmarks, getHistory, getDownloads, getAllTabs, closeTab, getAllExtensions, toggleExtension, getRecentlyClosed } from '../utils/chromeAPI';
import { Switch } from './ui/switch';


interface ChromeNavbarProps {
  setIsChromHeader: (value: boolean) => void;
}

const ChromeNavbar: React.FC<ChromeNavbarProps> = ({ setIsChromHeader }) => {

  const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const [history, setHistory] = useState<chrome.history.HistoryItem[]>([]);
  const [downloads, setDownloads] = useState<chrome.downloads.DownloadItem[]>([]);
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [extensions, setExtensions] = useState<chrome.management.ExtensionInfo[]>([]);
  const [sessions, setSessions] = useState<chrome.sessions.Session[]>([]);

  console.log(history, bookmarks, downloads, sessions, tabs, extensions);

  const [searchQuery, setSearchQuery] = useState('');

const filteredHistory = history.filter(
  (item) =>
    (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase()))
);

const filteredBookmarks = bookmarks.flatMap((bookmark) => {
  const matches = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase());
  const childrenMatches = bookmark.children?.filter((child) =>
    child.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (matches || childrenMatches.length > 0) {
    return [
      {
        ...bookmark,
        children: childrenMatches,
      },
    ];
  }
  return [];
});

const filteredDownloads = downloads.filter(
  (download) =>
    (download.filename && download.filename.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (download.url && download.url.toLowerCase().includes(searchQuery.toLowerCase()))
);

const groupByDate = (items: chrome.history.HistoryItem[]) => {
    const groups: { [key: string]: chrome.history.HistoryItem[] } = {};

    for (const item of items) {
        if (!item.lastVisitTime) continue;
        const visitDate = new Date(item.lastVisitTime);
        const day = String(visitDate.getDate()).padStart(2, '0');
        const month = String(visitDate.getMonth() + 1).padStart(2, '0');
        const year = visitDate.getFullYear();
        const dateKey = `${day}/${month}/${year}`;

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(item);
    }

    return groups;
};
const groupedHistory = groupByDate(history);

   useEffect(() => {
    getBookmarks().then((res) => setBookmarks(res[0].children || []));
    getHistory().then(setHistory);
    getDownloads().then(setDownloads);
    getAllTabs().then(setTabs)
    getAllExtensions().then(setExtensions)
    getRecentlyClosed().then(setSessions);
  }, []);


  const handleRemoveSessionUI = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.tab?.sessionId !== sessionId));
  };

  const handleRestore = (session: chrome.sessions.Session) => {
    if ("tab" in session && session.tab?.sessionId) {
      chrome.sessions.restore(session.tab.sessionId, () => {
        getRecentlyClosed().then(setSessions);
      });
    }
    else if ("window" in session && session.window?.sessionId) {
      chrome.sessions.restore(session.window.sessionId, () => {
        getRecentlyClosed().then(setSessions);
      });
    } else {
      chrome.sessions.restore(() => {
        getRecentlyClosed().then(setSessions);
      });
    }
  };

  const handleCloseTab = (Id:number) => {
    closeTab(Id)
      .then(() => {
        setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== Id));
      })
      .catch((error) => {
        console.error('Error closing tab:', error);
      });
  }


  const handleExtensionToggle = (id: string, enable: boolean) => {
    toggleExtension(id, enable)
      .then(() => {
        setExtensions((prevExtensions) =>
          prevExtensions.map((ext) =>
            ext.id === id ? { ...ext, enabled: enable } : ext
          )
        );
      })
      .catch((error) => {
        console.error('Error toggling extension:', error);
      });
  };
  
  return (
    <div className="w-full z-30">
      <div 
        className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm animate-in slide-in-from-top duration-300"
      >
        <div className="flex items-center justify-between px-4 h-14">
     

    <Menubar className='w-full flex items-center justify-evenly'>
       <MenubarMenu>
        <MenubarTrigger><Bookmark className="h-4 w-4" /> Bookmarks</MenubarTrigger>
        <MenubarContent>
          <div className="p-2">
      <input
        type="text"
        placeholder="Search Bookmark..."
        className="w-full px-2 py-1 text-sm border rounded bg-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
     {searchQuery ? (
       <MenubarSub>
        
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <MenubarSub key={item.id}>
                  <MenubarSubTrigger>{item.title}</MenubarSubTrigger>
                  <MenubarSubContent className='max-w-[30dvw] max-h-[40dvh] overflow-y-scroll no-scrollbar overflow-x-clip'>
                    {item.children.map((subChild: chrome.bookmarks.BookmarkTreeNode) => (
                      <MenubarItem
                        key={subChild.id}
                        onClick={() => {
                          if (subChild.url) {
                            window.open(subChild.url, '_blank');
                          }
                        }}
                      >
                        {subChild.title}
                      </MenubarItem>
                    ))}
                  </MenubarSubContent>
                </MenubarSub>
              );
            }
            return (
              <MenubarItem
                key={item.id}
                onClick={() => {
                  if (item.url) {
                    window.open(item.url, '_blank');
                  }
                }}
              >
                {item.title}
              </MenubarItem>
            );
          })
        ) : (
          <MenubarItem disabled>No matches found</MenubarItem>
        )}
      </MenubarSub> ) : (
<>           
{bookmarks.map((bookmark) => (
  <MenubarSub key={bookmark.id}>
    <MenubarSubTrigger>{bookmark.title}</MenubarSubTrigger>
    <MenubarSubContent className='max-w-[30dvw] max-h-[40dvh] overflow-y-scroll no-scrollbar overflow-x-clip'>
      {bookmark.children?.map((child) => {
        if (child.children && child.children.length > 0) {
          return (
            <MenubarSub key={child.id}>
              <MenubarSubTrigger>{child.title}</MenubarSubTrigger>
              <MenubarSubContent className='max-w-[30dvw] max-h-[40dvh] overflow-y-scroll no-scrollbar overflow-x-clip'>
                {child.children.map((subChild) => (
                  <MenubarItem
                    key={subChild.id}
                    onClick={() => {
                      if (subChild.url) {
                        window.open(subChild.url, '_blank');
                      }
                    }}
                  >
                    {subChild.title}
                  </MenubarItem>
                ))}
              </MenubarSubContent>
            </MenubarSub>
          );
        }
        return (
          <MenubarItem
            key={child.id}
            onClick={() => {
              if (child.url) {
                window.open(child.url, '_blank');
              }
            }}
          >
            {child.title}
          </MenubarItem>
        );
      })}
    </MenubarSubContent>
  </MenubarSub>
))}
      </>     )}
        </MenubarContent>
      </MenubarMenu>
    
     <MenubarMenu>
  <MenubarTrigger>
    <Clock className='w-4 h-4' /> History
  </MenubarTrigger>
  <MenubarContent className='max-w-[30dvw] max-h-[40dvh] overflow-y-auto no-scrollbar overflow-x-clip'>
    <div className="p-2">
      <input
        type="text"
        placeholder="Search history..."
        className="w-full px-2 py-1 text-sm border rounded bg-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    {searchQuery ? (
      <MenubarSub>
        
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <MenubarItem
                key={item.id}
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                {item.title || item.url}
              </MenubarItem>
            ))
          ) : (
            <MenubarItem disabled>No matches found</MenubarItem>
          )}
      </MenubarSub>
    ) : (
      <>
        {Object.entries(groupedHistory).map(([group, items]) => (
          <MenubarSub key={group}>
            <MenubarSubTrigger>{group}</MenubarSubTrigger>
            <MenubarSubContent className='max-w-[30dvw] max-h-[40dvh] overflow-y-auto no-scrollbar'>
              {items.map((item) => (
                <MenubarItem
                  key={item.id}
                  onClick={() => item.url && window.open(item.url, '_blank')}
                >
                  {item.title || item.url}
                </MenubarItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
        ))}
      </>
    )}
  </MenubarContent>
</MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger><Download className="h-4 w-4" /> Downloads</MenubarTrigger>
        <MenubarContent className='max-w-[30dvw] max-h-[40dvh] overflow-y-auto no-scrollbar overflow-x-clip'>
           <input
        type="text"
        placeholder="Search history..."
        className="w-full px-2 py-1 text-sm border rounded bg-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery ? (
      <MenubarSub>
        
          {filteredDownloads.length > 0 ? (
            filteredDownloads.map((item) => (
              <MenubarItem
                key={item.id}
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                {item.filename || item.url}
              </MenubarItem>
            ))
          ) : (
            <MenubarItem disabled>No matches found</MenubarItem>
          )}
      </MenubarSub>
    ) : (
      <>
         {downloads.map((download) => (
          <MenubarItem
            key={download.id}
            onClick={() => {
              if (download.url) {
                window.open(download.url, '_blank');
              }
            }}
          >
            {download.filename || download.url}
          </MenubarItem>
        ))}
        </>)}
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger><AppWindow className="h-4 w-4" />Tabs</MenubarTrigger>
        <MenubarContent className='max-w-[30dvw] max-h-[40dvh] overflow-y-auto no-scrollbar overflow-x-clip'>
         {tabs.map((tab) => (
          <MenubarItem
            key={tab.id}
            onClick={() => {
          if (tab.id !== undefined && tab.windowId !== undefined) {
            chrome.tabs.update(tab.id, { active: true });
            chrome.windows.update(tab.windowId, { focused: true });
          }
        }}
          >
            <div className='flex items-center justify-between w-full px-1 gap-1'>
            {tab.title || tab.url}
            <div onClick={() => { if (tab.id !== undefined) handleCloseTab(tab.id); }}>
            <X className='ml-auto mr-1'/></div>
            </div>
          </MenubarItem>
        ))}
        </MenubarContent>
      </MenubarMenu>

       <MenubarMenu>
      <MenubarTrigger>
        <Puzzle className="h-4 w-4 mr-2" />
        Extensions
      </MenubarTrigger>
      <MenubarContent className="max-w-[30dvw] max-h-[40dvh] overflow-y-auto no-scrollbar overflow-x-clip">
        {extensions.map((ext) => (
          <MenubarItem
            key={ext.id}
            className="flex justify-between items-center gap-2"
            onClick={() => {
              if (ext.optionsUrl) {
                chrome.tabs.create({ url: ext.optionsUrl });
              } else if (ext.homepageUrl) {
                chrome.tabs.create({ url: ext.homepageUrl });
              }
            }}
          >
            <span className="truncate max-w-[15dvw]">{ext.name}</span>
            <Switch
              checked={ext.enabled}
              onCheckedChange={(value) => handleExtensionToggle(ext.id, value)}
              onClick={(e) => e.stopPropagation()} 
            />
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>

      <MenubarMenu>
  <MenubarTrigger>
    <History className="h-4 w-4 mr-1" />
    Sessions
  </MenubarTrigger>

  <MenubarContent className="max-w-[30dvw] max-h-[40dvh] overflow-y-auto no-scrollbar overflow-x-clip">

    {/* Recently Closed */}
    <MenubarSub>
      <MenubarSubTrigger>Recently Closed</MenubarSubTrigger>
      <MenubarSubContent className="max-w-[28dvw] max-h-[30dvh] overflow-y-auto">
        {sessions.slice(0, 5).length === 0 ? (
          <div className="p-2 text-center text-sm text-gray-500">
            No recently closed sessions
          </div>
        ) : (
          sessions.slice(0, 5).map((session, index) => (
            <MenubarItem
              key={session.tab?.sessionId || index}
              onClick={() => handleRestore(session)}
              className="flex justify-between items-center gap-1 px-1"
            >
              <span className="truncate max-w-[22dvw]">
                {"tab" in session
                  ? session.tab?.title || session.tab?.url || "Closed tab"
                  : "window" in session
                  ? `Window with ${session.window?.tabs?.length ?? 0} tabs`
                  : "Unknown session"}
              </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const sessionId = session.tab?.sessionId;
                  if (sessionId) handleRemoveSessionUI(sessionId);
                }}
              >
                <X className="h-4 w-4 text-gray-500 hover:text-red-600" />
              </div>
            </MenubarItem>
          ))
        )}
      </MenubarSubContent>
    </MenubarSub>

    {/* Last Sessions */}
    <MenubarSub>
      <MenubarSubTrigger>Last Sessions</MenubarSubTrigger>
      <MenubarSubContent className="max-w-[28dvw] max-h-[30dvh] overflow-y-auto overflow-x-clip no-scrollbar">
        {sessions.slice(5).length === 0 ? (
          <div className="p-2 text-center text-sm text-gray-500">
            No last sessions
          </div>
        ) : (
          sessions.slice(5).map((session, index) => (
            <MenubarItem
              key={session.tab?.sessionId || index}
              onClick={() => handleRestore(session)}
              className="flex justify-between items-center gap-1 px-1"
            >
              <span className="truncate max-w-[22dvw]">
                {"tab" in session
                  ? session.tab?.title || session.tab?.url || "Closed tab"
                  : "window" in session
                  ? `Window with ${session.window?.tabs?.length ?? 0} tabs`
                  : "Unknown session"}
              </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const sessionId = session.tab?.sessionId;
                  if (sessionId) handleRemoveSessionUI(sessionId);
                }}
              >
                <X className="h-4 w-4 text-gray-500 hover:text-red-600" />
              </div>
            </MenubarItem>
          ))
        )}
      </MenubarSubContent>
    </MenubarSub>
    
  </MenubarContent>
</MenubarMenu>


    </Menubar>
  


          
          <Button variant="ghost" size="default" onClick={()=> setIsChromHeader(false)} aria-label="Close navbar">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChromeNavbar;
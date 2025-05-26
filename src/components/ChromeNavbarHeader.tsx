import React, { useEffect, useState } from 'react';
 import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button";

import { Bookmark, Clock, X,} from 'lucide-react';
import { getBookmarks, getHistory, getDownloads } from '../utils/chromeAPI';



interface ChromeNavbarProps {
  setIsChromHeader: (value: boolean) => void;
}

const ChromeNavbar: React.FC<ChromeNavbarProps> = ({ setIsChromHeader }) => {

    const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const [history, setHistory] = useState<chrome.history.HistoryItem[]>([]);
  const [downloads, setDownloads] = useState<chrome.downloads.DownloadItem[]>([]);

  console.log(history, bookmarks, downloads);

  const [searchQuery, setSearchQuery] = useState('');

const filteredHistory = history.filter(
  (item) =>
    (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.url && item.url.toLowerCase().includes(searchQuery.toLowerCase()))
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
  }, []);
  
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
        </MenubarContent>
      </MenubarMenu>
      {/* <MenubarMenu>
        <MenubarTrigger><Clock className='w-4 h-4'/> History</MenubarTrigger>
        <MenubarContent className='max-w-[30dvw] max-h-[40dvh] overflow-y-scroll no-scrollbar overflow-x-clip'>
            {history.map((item) => (
                <MenubarItem
                key={item.id}
                onClick={() => {
                  if (item.url) {
                    window.open(item.url, '_blank');
                  }
                }
                }
                >
                    {item.title || item.url}
               </MenubarItem>
            ))}     
        </MenubarContent>
      </MenubarMenu> */}
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
        <MenubarSubContent className='max-w-[30dvw] max-h-[40dvh] overflow-y-auto no-scrollbar'>
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
        </MenubarSubContent>
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
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Profile...</MenubarItem>
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
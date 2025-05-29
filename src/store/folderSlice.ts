import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FolderType {
    id: string;
    name: string;
    itemIds: string[];
    itemIcons: string[]; // Optional, for storing icons of items in the folder
    x: number; // Optional, for positioning gridColumnStart
    y: number; // Optional, for positioning gridRowStart
    height: number; // Optional, for gridRowEnd
    width: number; // Optional, for gridColumnEnd
    parent: string; // Optional, for parent area (e.g., "dock", "main", "page-1", etc.)
    type: "folder";
    hoverPreviewItemIcon?: string | null; // Optional, to indicate if this is the active folder
  }
  
  interface FolderState {
    folders: FolderType[];
    activeFolder:string;
  }
  
  const initialState: FolderState = {
    folders: [],
    activeFolder:""
  };
  
  const folderSlice = createSlice({
    name: 'folders',
    initialState,
    reducers: {
      addFolder: (state, action: PayloadAction<FolderType>) => {
        state.folders.push(action.payload);
      },
      addItemToFolder: (state, action: PayloadAction<{ folderId: string; itemId: string; itemIcon:string; }>) => {
        const folder = state.folders.find(f => f.id === action.payload.folderId);
        if (folder && !folder.itemIds.includes(action.payload.itemId)) {
          folder.itemIds.push(action.payload.itemId);
          folder.itemIcons.push(action.payload.itemIcon);
         
        }
      },
      removeItemFromFolder: (state, action: PayloadAction<{ folderId: string; itemId: string }>) => {
        const folder = state.folders.find(f => f.id === action.payload.folderId);
        if (folder) {
          folder.itemIds = folder.itemIds.filter(id => id !== action.payload.itemId);
        }
      },
      setHoverPreview: (state, action: PayloadAction<{ folderId: string; itemIcon: string | null }>) => {
        const folder = state.folders.find(f => f.id === action.payload.folderId);
        if (folder) {
          folder.hoverPreviewItemIcon = action.payload.itemIcon;
        }
      },
      setactiveFolder: (state, action: PayloadAction<{ folderId: string}>) => {
        state.activeFolder = action.payload.folderId;
      }
    },
  });
  
  export const { addFolder, addItemToFolder, removeItemFromFolder, setHoverPreview,setactiveFolder } = folderSlice.actions;
  export default folderSlice.reducer;
  export const allFolders = (state: { folders: FolderState }) => state.folders.folders;
import {FolderType} from '@/store/folderSlice';
import { SiteItem } from "@/store/siteSlice"; 
import {Page as PageType} from "@/store/pageSlice";

type SiteWidgetType = { id:string,icon: string; url: string, name: string, parent:string}
type FolderWidgetType = {  
    id: string;
    name: string;
    itemIds: string[];
    itemIcons: string[];
    hoverPreviewItemIcon?: string | null;
}

// types.ts
export interface WidgetItem {
  id: string;
  name: string;
  type: "clock" | "search" | "notes" | "image" | "chatAI" | "todo";
  component: React.ReactNode; // React component for the widget
  parent: string; // Optional (e.g., "dock", "main", etc.)
  width: number; // Optional, for layout purposes
  height: number; // Optional, for layout purposes
  x: number; // Optional, for layout purposes
  y: number; // Optional, for layout purposes
}


export type { SiteItem, FolderType, SiteWidgetType, FolderWidgetType,PageType };
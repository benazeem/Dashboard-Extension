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

export type { SiteItem, FolderType, SiteWidgetType, FolderWidgetType,PageType };
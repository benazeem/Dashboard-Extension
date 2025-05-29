import { ReactNode, useState, useEffect} from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  DragOverEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
} from "@dnd-kit/core";
import DndMonitor from './DndMonitor';
import { useSelector, useDispatch } from "react-redux";
import { addPage, setCurrentPage,setNavigationDirection } from "@/store/pageSlice";  
import {updateSite, setMergePreview} from "@/store/siteSlice";
import { RootState } from "@/store/store";
import { useAutoRemovePageIfEmpty } from "../../hooks/useAutoRemovePageIfEmpty";
import SiteWidget from "../widgets/SiteWidget";
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import {addFolder, addItemToFolder, setHoverPreview } from "@/store/folderSlice";
import { getAllFolders } from "@/store/selectors";
import FolderWidget from "../widgets/FolderWidget";

const DndProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const COLUMNS = 6.5;
const ROWS = 3.5;

  const {DROPPABLE_AREA_WIDTH, WIDGET_HEIGHT } = useResponsiveGrid();
  const dispatch = useDispatch();
  const autoRemovePage = useAutoRemovePageIfEmpty();
  const [createNewPage, setCreateNewPage] = useState(false);
  const [checkEmptyPage, setCheckEmptyPage] = useState(false);
  const [currentActiveId, setCurrentActiveId] = useState<null|string>(null);
  const folders = useSelector(getAllFolders);
  const { pages } = useSelector((state: RootState) => state.pages);
  const sites = useSelector((state: RootState) => state.sites.items);
  const nonWidgetItems = [...sites, ...folders];

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(PointerSensor));


  const handleDragToExtremeRight = (event: DragOverEvent) => {
    const { active } = event;
    const dragParent = active.data.current?.parent as string;
    const dragParentIndex = pages.findIndex((page) => page.id === dragParent);
    const presentPageItems= sites.filter(
      (item) => item.parent === dragParent
    ).length;

    dispatch(setNavigationDirection("right"));
    // Create first page if it doesn't exist
    if (dragParent === "home" && pages.length === 0) {
      const newPageID = `page-${crypto.randomUUID()}`;
      dispatch(
        addPage({
          id: newPageID,
          name: `Page 1`,
        })
      );
      setCreateNewPage(true);
    }

    // Create new page if dragged to the right and there are will be no items left on the current page
    if (pages.length > 0 && dragParentIndex === pages.length - 1) {
      if (presentPageItems === 1) return;
      dispatch(
        addPage({
          id: `page-${crypto.randomUUID()}`,
          name: `Page ${pages.length + 1}`,
        })
      );
      setCreateNewPage(true);
    }

    // Set the current page page-1 from home
    if (dragParent === "home" && pages.length > 0) {
      dispatch(setCurrentPage(1));
    }

    // Set page to Next page if available 
    if (dragParentIndex < pages.length) {
      const nextPage = dragParentIndex + 2;
      if (nextPage) {
        dispatch(setCurrentPage(nextPage));
      }
    }
  };

  const handleDragToExtremeLeft = (event: DragOverEvent) => {
    const { active } = event;
    const dragParent = active.data.current?.parent as string;
    const dragParentIndex = pages.findIndex((page) => page.id === dragParent);
    if (dragParent === "home") return;

    dispatch(setNavigationDirection("left"));

    // Left Dragged actions
    if (pages.length === 1 || dragParentIndex === 0) {
      dispatch(setCurrentPage(0));
    } else if (pages.length > 1 && dragParentIndex > -1) {
      const previousPage = dragParentIndex;
      if (previousPage) {
        dispatch(setCurrentPage(previousPage));
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;
    setCurrentActiveId(activeId);
  }
 

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;

    if (!over) return;
    const overId = over.id as string;
    const activeId = active.id as string;
    
    if (overId.startsWith("drop-") && activeId !== overId.slice(5)) {
     return;
    };

    // Item is dragged to another parent area except dock
    if (!overId.startsWith("drop-")) {
      sites.forEach((site) => {
        if (site.id === activeId) {
          const updatedSite = { ...site, parent: overId, };
          dispatch(updateSite(updatedSite)); // Update the site item in the store
          return updatedSite;
        }
      });  }
    
  };

  const handleDragMove = (event: DragMoveEvent)=>{
    const {active,delta,over} = event;
    const overId = over?.id as string;
    const activeId = active.id as string;
    if (!over) return;

    if (overId.startsWith("drop-") && activeId !== overId.slice(5)) {
      const activeItem = nonWidgetItems.find((item) => item.id === activeId);
      const overItem = nonWidgetItems.find((item) => item.id === overId.slice(5));
      if (!overItem) return;
      if (!activeItem) return;
    }
  
    if(!overId.startsWith("drop-")){  
      //Function if dragged to extreme right
        if (delta.x + (active.data.current?.x*WIDGET_HEIGHT) > DROPPABLE_AREA_WIDTH - 50) {
        handleDragToExtremeRight(event);
        return;
            }
  
      //Function if dragged to extreme left
      if (delta.x + active.data.current?.x < -20) {
        handleDragToExtremeLeft(event);
        return;
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over} = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    if (over.id === active.data.current?.parent) {
      setCheckEmptyPage(true);
    }

    if (overId.startsWith("drop-") && activeId !== overId.slice(5)) {
      const activeItem = nonWidgetItems.find((item) => item.id === activeId);
      const overItem = nonWidgetItems.find((item) => item.id === overId.slice(5));
      if (!overItem) return;
      if (!activeItem) return;
      if (overId.startsWith("drop-bookmark-")) {
          if ('url' in overItem && 'url' in activeItem) {
        const folderId = `folder-${crypto.randomUUID()}`;
        dispatch(addFolder({
          id: folderId,
          name: "Folder",
          itemIds: [overItem.id,activeId],
          itemIcons: [overItem.icon,activeItem.icon],
          x: overItem.x,
          y: overItem.y,
          height: 1,
          width: 1,
          parent: overItem.parent,
          type: "folder",
        })); // Add the new folder to the store
          dispatch(updateSite({...activeItem, parent:folderId})); // Change active site parent
        dispatch(updateSite({...overItem, parent:folderId})); // Change over site parent
        dispatch(setMergePreview({ id: '', icons: null })) // Reset the merge preview state
        }}
      if((overId.startsWith("drop-folder-"))) {
        if ('url' in activeItem) {
        const folderId = overId.slice(5); 
        const itemIcon = activeItem.icon
        dispatch(addItemToFolder({ folderId, itemId: activeId, itemIcon:itemIcon }));
        dispatch(updateSite({...activeItem, parent:folderId})); // Change active site Parent
        dispatch(setHoverPreview({ folderId: overItem.id, itemIcon: null })); // Reset the hover preview state
        }}
  }

  const dropX = active.data.current?.x + event.delta?.x;
  const dropY = active.data.current?.y + event.delta?.y;

  // Snap to grid
  let snappedX = Math.round(dropX / WIDGET_HEIGHT);
  let snappedY = Math.round(dropY / WIDGET_HEIGHT);

  snappedX = Math.max(0, Math.min(Math.floor(COLUMNS) - 1, snappedX));
  snappedY = Math.max(0, Math.min(Math.floor(ROWS) - 1, snappedY)); // floor to prevent half row overstep


  const item = nonWidgetItems.find((item) => item.id === activeId);
  if (!item) return;

  const updatedItem = {
    ...item,
    x: snappedX,
    y: snappedY,
  };

  if(updatedItem.type === "site") {
  dispatch(updateSite(updatedItem));}
   

  };

  const handleDragCancel = () => {
    setCurrentActiveId(null);
    setCheckEmptyPage(false); // Reset the checkEmptyPage state
    setCreateNewPage(false); // Set creatingNewPage to true
    dispatch(setMergePreview({ id: '', icons: null }));
    dispatch(setHoverPreview({ folderId: '', itemIcon: null }));
  };

  useEffect(() => {
    if (checkEmptyPage) {
      autoRemovePage();
      setCheckEmptyPage(false); // Reset the checkEmptyPage state
    }
  }, [checkEmptyPage, autoRemovePage]);

  useEffect(() => {
    if (createNewPage) {
      const timeout = setTimeout(() => {
        if (pages[pages.length - 1]) {
          dispatch(setCurrentPage(pages.length - 1));
        }
       
      setCreateNewPage(false); // Set creatingNewPage to true
    }, 100);
    return () => clearTimeout(timeout);
    }
  }, [pages,createNewPage, dispatch]);


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      >
      
    <DndMonitor
    handleDragStart={handleDragStart}
    handleDragMove={handleDragMove}
    handleDragEnd={handleDragEnd}
    handleDragOver={handleDragOver}
    handleDragCancel={handleDragCancel}
   />
      {children}
      {/* <DragOverlay>
        {currentActiveId ? (
          
        ): null}
      </DragOverlay> */}
       <DragOverlay
       >
        {currentActiveId ? (
         nonWidgetItems.filter((item) => item.id === currentActiveId).map((item) => (
          item.type === "site"?(
            <SiteWidget
              key={item.id}
              id={item.id}
              icon={item.icon}
              url={item.url}
              name={item.name}
              parent={item.parent}
              />
          ):(
           item.type === "folder"?(
            <FolderWidget
            key={item.id}
            FolderProps={{name:item.name, itemIds:item.itemIds, itemIcons:item.itemIcons, id:item.id,}}
            />
           ):(null)
          )
          ))
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DndProvider;

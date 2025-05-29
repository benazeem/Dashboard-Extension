import Draggable from "@/components/dnd-kit/DraggableItem";
import Droppable  from "@/components/dnd-kit/Droppable"
// import { BorderLeft, BorderRight } from "../components/BorderRightandLeft";
import { SiteItem, FolderType,PageType } from "../../types"; // Ensure these types are correctly imported

interface pagePropsType {
  page: PageType;
  pagesItems: SiteItem[] | FolderType[];
}

function DefaultPage({ page, pagesItems }:pagePropsType) {
  return (
    <>
    <Droppable
              key={page.id}
              id={page.id}
            >
{pagesItems.filter((items) => items.parent === page.id).map((item) => {
               if (item.type === "site") {
                 return (
                   <Draggable
                   key={item.id}
                   DragItem={item}
                   />
                 );
               }})}
            </Droppable>
        </>
  )
}

export default DefaultPage
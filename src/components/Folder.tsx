import { getAllFolders } from "@/store/selectors";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Droppable from "./dnd-kit/Droppable";
import Draggable from "./dnd-kit/DraggableItem";

function Folder() {
  const currentFolderId = useSelector(
    (state: RootState) => state.folders.activeFolder
  );
  const currentFolder = useSelector((state: RootState) =>
    getAllFolders(state).find((folder) => folder.id === currentFolderId)
  );
  const siteItems = useSelector((state: RootState) => state.sites.items);
  console.log("siteItems", siteItems);

  const folderSites =
    currentFolder?.itemIds.map((id) =>
      siteItems.find((site) => site.id === id)
    ) || [];

  console.log("currentFolder", currentFolder, "siteItemsinFolder", folderSites);
  if (!currentFolder) {
    return null;
  }
  return (
    <>
      <Droppable
        key={currentFolderId}
        id={currentFolderId}
        className="w-[600px] h-[400px] rounded-2xl p-2 flex flex-col justify-start items-center bg-white overflow-hidden relative no-scrollbar"
      >
        <div className="text-2xl text-gray-800 mb-4">{currentFolder.name}</div>
        <div
          title="Folder Icon List"
          className="w-full h-full overflow-y-auto p-2 rounded-lg shadow-md"
        >
          <div className="flex flex-wrap gap-8 ">
            {folderSites.map(
              (site) => site && <Draggable key={site.id} DragItem={site} />
            )}
          </div>
        </div>
      </Droppable>
    </>
  );
}

export default Folder;

import { Plus, Grip} from 'lucide-react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Droppable from "./dnd-kit/Droppable"
import Draggable from './dnd-kit/DraggableItem';
import { useResponsiveGrid } from '../hooks/useResponsiveGrid';
import { useDispatch } from 'react-redux';
import{showModal} from '../store/modalSlice';

function Dock() {
  const {WIDGET_HEIGHT} = useResponsiveGrid();
  const DOCK_HEIGHT = Math.floor((WIDGET_HEIGHT*0.4));
  const dispatch: AppDispatch = useDispatch();
  const siteItems = useSelector((state: RootState) => state.sites);
    const dockItems = siteItems.items.filter((item) => item.parent === "dock");
    const dockDropWidth = ((dockItems.length * WIDGET_HEIGHT)+10);

    const actionButtonStyle = {
      height: `${DOCK_HEIGHT}px`,
      width: `${DOCK_HEIGHT}px`,
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '0.5rem',
    }

    const actionButtonParentStyle = {
      height: `${DOCK_HEIGHT}px`,
      width: `${2.5*DOCK_HEIGHT}px`,
    }

    const handleAddMenu = () => {
      dispatch(showModal('menu'));
    }
    
  return (
    <>
    <div className={`h-full w-full rounded-2xl p-2 flex justify-between items-center dock bg-white/50 overflow-hidden`}>
      <Droppable width={dockDropWidth} id="dock">
            {dockItems.map((item) => {
              if (item.type === "site") {
                return (
                  <Draggable
                  key={item.id}
                  DragItem={item}
                  />
                );
              }
              return null; // Handle other item types if necessary
            })} </Droppable>
           
     <div className={`default-action-buttons flex items-center justify-center gap-4`} style={actionButtonParentStyle}> 
     <div className='w-[1px] h-full bg-black'></div>
        <button style={actionButtonStyle} title='Add-Site' onClick={handleAddMenu}>
            <Plus size={35}/> </button>
            <button  style={actionButtonStyle} title='Add-Site'>
            <Grip size={DOCK_HEIGHT/2} /> </button>
     </div>
    </div>
    </>
  )
}

export default Dock
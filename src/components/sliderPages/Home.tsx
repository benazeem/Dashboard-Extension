
import Droppable from "@/components/dnd-kit/Droppable"
import Dragabble from "@/components/dnd-kit/DraggableItem"

interface HomeProps {
  homeItems: any[]; // Replace 'any[]' with the appropriate type for mainItems
}

const Home: React.FC<HomeProps> = ({ homeItems }) => {
  return (<>
  <Droppable id="home">  
    {homeItems.map((item) => {
        return (
          <Dragabble
          key={item.id}
          DragItem={item} 
          />
        );
      }
     )}    
    </Droppable>
    </>
  )
}

export default Home
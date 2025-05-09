import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useMainLayout from "@/hooks/useMainLayout";



const ExcalidrawWrapper: React.FC = () => {
  const { updateMainLayout } = useMainLayout();
  

  return (
    <div className="h-screen w-screen">
      <Button
          className="w-10 h-10 absolute right-[5.5%] top-[1%] rounded-full border-[1px] border-gray-500 hover:bg-red-500 opacity-35 hover:opacity-100 flex justify-center items-center z-50"
          size={"lg"}
          variant={"ghost"}
          onClick={() => {
            updateMainLayout("main-app-layout");
          }}
        ><X />
        </Button>
      <Excalidraw />
    </div>
  );
};
export default ExcalidrawWrapper;
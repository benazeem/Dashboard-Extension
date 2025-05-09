import { useEffect, useRef, useState } from "react";
import { Menu as MenuIcon, PanelTopOpen} from "lucide-react";
import {
  Avatar,
  // AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SimpleSlider from "../components/Slider";
import ScreenSaver from "../components/ScreenSaver";
import Dock from "../components/Dock";
import DndProvider from "../components/dnd-kit/DndProvider";
import Modal from "../components/ui/Modal";
import Sidebar from "../components/Sidebar";
import { useModal } from "../hooks/useModal";



function MainLayout() {
  const [showScreensaver, setShowScreensaver] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundBlur = 0;
  const bgImage =
    "https://images.pexels.com/photos/325044/pexels-photo-325044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const { isModalOpen,hideModal, modalChild } = useModal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowScreensaver(false);
    if(isModalOpen) return;
    timeoutRef.current = setTimeout(() => {
        setIsSidebarOpen(false);
        setShowScreensaver(true);
    }, 60000); // 1 minute = 60000 ms
  };
  // Hook into user activity
  useEffect(() => {
    const events = ["keydown", "mousedown", "touchstart"]
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // start the initial timer
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  });

  return (
    <>
          <DndProvider> 
      <div className="w-[100dvw] h-[100dvh] bg-transparent flex flex-col transition 0.2s ease-linear app-main">
        {/* Background Div */}
        <div
          className="w-full h-full relative overflow-hidden bg-cover bg-center bg-no-repeat fade-in 0.2s ease-in-out z-0"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        >
          <div
            className={`absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-[${backgroundBlur}px] z-0`}
            style={{
              backgroundImage: `url(${bgImage})`,
            }}
          />{" "}
        </div>
        {/* div for app-screen-saver */}
        {showScreensaver && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-black">
            <ScreenSaver />
          </div>
        )}

        {/* <div></div> Div's for covering sidebar Container */}
        {isSidebarOpen&&(
          <Sidebar setShow={setIsSidebarOpen} />
        )}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-between overflow-hidden">
          <div className="w-full h-[5%] bg-white/50  flex justify-between items-center overflow-visible">
            <Button variant={"ghost"} size={"xl"} onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon size={48} />
            </Button>
            <div className="flex items-center gap-2">
              <PanelTopOpen />
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="avatar-image"
                />
                {/* <AvatarFallback>CN</AvatarFallback> */}
              </Avatar>
            </div>
          </div>
          <div className=" w-full h-[75%] bg-transparent overflow-visible flex items-center justify-center">
            <SimpleSlider />
          </div>
          <div className="h-[15%] min-w-20 max-w-[90dvw] pb-4 bg-transparent  rounded-2xl z-0">
            <Dock />
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={hideModal} className="w-[50%] h-[80%]" child={modalChild}/>
      </DndProvider>
     
    </>
  );
}

export default MainLayout;
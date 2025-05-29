import { useEffect, useRef, useState, useCallback } from "react";
import { Menu as MenuIcon, PanelTopOpen } from "lucide-react";
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SimpleSlider from "../components/Slider";
import ScreenSaver from "../components/ScreenSaver";
import Dock from "../components/Dock";
import DndProvider from "../components/dnd-kit/DndProvider";
import Modal from "../components/ui/Modal";
import Sidebar from "../components/Sidebar";
import { useModal } from "../hooks/useModal";
import ChromeNavbar from "@/components/ChromeNavbarHeader";
import { RootState } from "@/store/store";

function MainLayout() {
  const [showScreensaver, setShowScreensaver] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundBlur = 0;
  const settings = useSelector((state: RootState) => state.settings);
  const bgImage = `/wallpapers/${settings.background}`;
  const { isModalOpen, hideModal, modalChild } = useModal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChromHeader, setIsChromHeader] = useState(false);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowScreensaver(false);

    if (isModalOpen || !settings.screenSaver.enabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsSidebarOpen(false);
      setShowScreensaver(true);
    }, settings.screenSaver.startAfterSeconds * 1000); // Convert seconds to milliseconds
  }, [isModalOpen, settings.screenSaver.enabled, settings.screenSaver.startAfterSeconds]);

  useEffect(() => {
    const events = ["keydown", "mousedown", "touchstart", "mousemove"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isModalOpen, settings.screenSaver.enabled, settings.screenSaver.startAfterSeconds, resetTimer]);

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
            />
          </div>
          
          {/* Screensaver */}
          {showScreensaver && settings.screenSaver.enabled && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black">
              <ScreenSaver />
            </div>
          )}

          {/* Sidebar */}
          {isSidebarOpen && (
            <Sidebar setShow={setIsSidebarOpen} />
          )}
          
          {/* Main Content */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-between overflow-hidden">
            {isChromHeader ? (
              <ChromeNavbar setIsChromHeader={setIsChromHeader} />
            ) : (
              <div className="w-full h-[5%] bg-white/50 flex justify-between items-center overflow-visible">
                <Button variant={"ghost"} size={"xl"} onClick={() => setIsSidebarOpen(true)}>
                  <MenuIcon size={48} />
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant={"ghost"} size={"xl"} onClick={() => setIsChromHeader(true)}>
                    <PanelTopOpen />
                  </Button>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="avatar-image"
                    />
                  </Avatar>
                </div>
              </div>
            )}
            
            <div className="w-full h-[75%] bg-transparent overflow-visible flex items-center justify-center">
              <SimpleSlider />
            </div>
            
            <div className="h-[15%] min-w-20 max-w-[90dvw] pb-4 bg-transparent rounded-2xl z-0">
              <Dock />
            </div>
          </div>
        </div>
        
        <Modal 
          isOpen={isModalOpen} 
          onClose={hideModal} 
          className="w-[50%] h-[80%]" 
          child={modalChild}
        />
      </DndProvider>
    </>
  );
}

export default MainLayout;
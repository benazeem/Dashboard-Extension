import React, { useEffect, useRef } from "react";
import {AnimatePresence, motion} from "motion/react";
import Menu from "../addmenu/Menu";
import SettingsPanel from "../SettingsPanel";

interface ModalProps {
  child:string|null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ child, isOpen, onClose }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const renderModalContent = () => {
        switch (child) {
            case 'menu':
                return <Menu />;
            case 'settings':
              return <SettingsPanel/>
                default:
                    return null;
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') onClose();
        };
        const handleClickOutside = (e: MouseEvent) => {
            if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
                onClose();
            }};
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {document.removeEventListener('keydown', handleKeyDown)
         document.removeEventListener('mousedown', handleClickOutside)
    };
      }, [onClose]);

  if (!isOpen) return null; // Don't render the modal if it's closed

  return(
  <AnimatePresence>
    <div role="dialog"
    aria-modal="true"
    className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center z-30 bg-white/50 backdrop-blur-sm">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut", type:"spring", stiffness: 300, damping: 25 }}
        id="modal-content" ref={contentRef} className="w-auto max-w-full shadow-lg rounded-lg">
        {renderModalContent()}
      </motion.div>
      </div>
      </AnimatePresence>
  );
};

export default Modal;

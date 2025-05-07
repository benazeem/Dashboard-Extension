import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {Star, Globe, Type, Upload} from "lucide-react";

import { useModal } from '../../hooks/useModal';
import { addSite } from "../../store/siteSlice";
import {Button} from "../ui/button";
import fetchFavicon from "../../utils/fetchFavicon";
import getWebColor from "../../utils/getWebColor";
import  base64  from "../../utils/base64";

function AddSite() {
  const { hideModal } = useModal();
  const dispatch = useDispatch();
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [favicon, setFavicon] = useState<string>("");
  const [logo, setLogo] = useState("");
  const [urlInput, setUrlInput] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [color, setColor] = useState<string>("rgb(79, 70, 229)");
  const [urlError, setUrlError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUrl(urlInput.trim());
    }, 500); // 500ms debounce delay
  
    return () => clearTimeout(timer);
  }, [urlInput]);
  

  useEffect(() => {
    const newUrl = url.split("://");
    if (newUrl[1]) {
      setIcon(url);
      async function getColor() {
        const dominantColor = await getWebColor(url);
        if (dominantColor) {
          setColor(dominantColor || "rgb(79, 70, 229)");
        }
      }
      getColor();
    } else {
      setIcon("");
    }
  }, [url]);

  useEffect(() => {
    async function getIcon() {
      const iconUrl = await fetchFavicon(icon);
      setFavicon(iconUrl);
      setLogo(iconUrl)
    }
    if (icon) {
      getIcon();
    } else {
      setFavicon("");
    }
  }, [icon]);

  const handleCancel = () => {
    hideModal();
  };

  const handleTextIcon = () => {
    const firstAlpha = name.charAt(0).toUpperCase() ;
    if(firstAlpha){
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const normalizedColor = color.trim().toLowerCase();
    const isWhiteBackground =
      normalizedColor === "#ffffff" ||
      normalizedColor === "rgb(255,255,255)" ||
      normalizedColor === "rgb(255, 255, 255)";
      
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Text settings
      ctx.font = "bold 62px Arial";
      ctx.fillStyle = isWhiteBackground ? "black" : "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Draw the text in the center
      
      ctx.fillText(firstAlpha, canvas.width / 2, canvas.height / 2);
    }
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL("image/png");
    setLogo(dataUrl);}
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]; // Get the first file safely
      if (!file) return;
  
      const base64Logo = await base64(file);
      setLogo(base64Logo);
    } catch (error) {
      console.error("Error converting image to Base64:", error);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    console.log("Save");
    const shortcutId = crypto.randomUUID();
    if(!url.trim() && !name.trim()){
      setUrlError("URL is required.");
      setNameError("Name is required.");
      urlInputRef.current?.focus();
      return;
    }
      if (!url.trim()) {
        setUrlError("URL is required.");
        urlInputRef.current?.focus();
       return;
      }
      if (!name.trim()) {
        setNameError("Name is required.");
        return;
      }
    
      setUrlError(""); 
      setNameError("");
      console.log( logo);
      
    dispatch(
      addSite({
        name: name,
        url: url,
        icon: logo,
        type: "site",
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        parent: "home",
        id: shortcutId,
      })
    );
    hideModal();
  }; 
  return (
    <>

        <div className="w-full h-full p-4 flex flex-col gap-4 justify-center items-center">
        <input
          type="text"
          placeholder={nameError ? nameError : "Name"}
          className="w-3/4 h-10 bg-white outline-none text-gray-900 px-2 rounded-lg"
          onChange={(e) => {setName(e.target.value);
            if (e.target.value.trim()) {
              setNameError(""); 
            }
          }}
        />
         <input
          type="url"
          ref={urlInputRef}
          placeholder={urlError ? urlError : "URL"}
          className="w-3/4 h-10 bg-white outline-none text-gray-900 px-2 rounded-lg"
          onChange={(e) => {
            setUrlInput(e.target.value);
            if (e.target.value.trim()) {
              setUrlError("");
            }
          }}
        />
       
        <div className="flex flex-col gap-2 items-start w-full">
          <p className="text-md w-1/3 pl-2 uppercase font-bold">icon:</p>
          <div className="flex gap-8 w-full flex-wrap justify-center">
            <div className="flex flex-col items-center justify-center">
              <div
                className="w-12 h-12  flex justify-center items-center rounded-full"
                style={{ backgroundColor: color }} 
              >
                {logo ? <img src={logo} alt="logo" className="w-10 h0-10 object-center object-contain rounded-full"/> : <Star className="text-white" size={22} />}
              </div>
              Logo
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                variant="addsite"
                size={"xl"}
                onClick={() =>
                  setLogo(favicon)
                }
              >
                {favicon ? (
                  <img
                    src={favicon}
                    alt="favicon"
                    className="h-8 w-8 object-center object-contain rounded-full"
                    />
                ) : (
                  <Globe className=" text-white" size={22} />
                )}
              </Button>
              Favicon
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                variant="addsite"
                size={"xl"}
                onClick={handleTextIcon}
              >
                { <Type  className="text-white" size={22} />  }
              </Button>
              Text
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                variant="addsite"
                size={"xl"}
                // className="w-12 h-12 bg-amber-500 flex justify-center items-center rounded-full"
                onClick={handleUploadButtonClick}
              >
                { <Upload className="text-white" size={22} />}
                <input
                  type="file"
                  ref={fileInputRef}
                  id="file-input"
                  name="ImageStyle"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  title="Upload an image file"
                />
              </Button>
              Upload
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-end w-full">
          <Button
            onClick={handleCancel}
            className="bg-gray-100 text-gray-800 hover:text-white hover:bg-blue-800 border-gray-500"
          >
           Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-800 border-blue-600 hover:border-blue-800"
          >
            Save
          </Button>
        </div>
        </div>
    </>
  );
}

export default AddSite;
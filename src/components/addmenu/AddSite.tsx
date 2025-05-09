import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {Star, Globe, Type, Upload} from "lucide-react";

import { useModal } from '../../hooks/useModal';
import { addSite } from "../../store/siteSlice";
import {Button} from "../ui/button";
import {isValidUrl} from "../../utils/inputValidator";
import { creatingTextLogo, base64, fetchWebsiteColor, fetchFavicon } from "@/utils/addSiteUtils";

function AddSite() {
  const { hideModal } = useModal();
  const dispatch = useDispatch();
  const [name, setName] = useState<string>("");
  const [favicon, setFavicon] = useState<string>("");
  const [logo, setLogo] = useState("");
  const [url, setUrl] = useState<string>("");
  const [color, setColor] = useState<string>("#f59e0b");
  const [urlError, setUrlError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [logoMissing, setLogoMissing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const valid_url = isValidUrl(url);
    if(valid_url){
      setUrl(url);
      setUrlError("");
      async function getWebColor()  {
        const color = await fetchWebsiteColor(url);
        if(color){
        setColor(color);
        }}
        async function getIcon() {
          const iconUrl = await fetchFavicon(url);
          setFavicon(iconUrl);
          setLogo(iconUrl)
        }
        getIcon();
        getWebColor();
      }
    else {
      setFavicon("");
      setLogo("");
      setColor("#f59e0b");
    }
  }, [url]);

  const handleCancel = () => {
    hideModal();
  };

  const handleTextIcon = () => {
    const firstAlpha = name.charAt(0).toUpperCase();
    if(color==="transparent"){
        async function getWebColor()  {
          const color = await fetchWebsiteColor(url);
          if(color){
          setColor(color);}
          }
          getWebColor();
    }
    if(!firstAlpha){
      setNameError("Name is required.");
      nameInputRef.current?.focus();
      return};
    if(firstAlpha){
    const textIconUrl =  creatingTextLogo({firstAlpha, color});
    setLogo(textIconUrl);
    if(logoMissing){
      handleSave()
      setLogoMissing(false)
    }
  }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]; // Get the first file safely
      if (!file) return;
  
      const base64Logo = await base64(file);
      setLogo(base64Logo);
      setColor("transparent"); // Set color to transparent for uploaded images
    } catch (error) {
      console.error("Error converting image to Base64:", error);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    const shortcutId = crypto.randomUUID();

    const valid_url = isValidUrl(url); 
    const valid_name = name.trim();


    if (!valid_name || !valid_url || !logo) {
      if (!valid_url) {
        setUrlError("URL is required.");
        urlRef.current?.focus();
      } 
      else if (!valid_name) {
        setNameError("Name is required.");
        nameInputRef.current?.focus();
      } else if (!logo) {
        setLogoMissing(true);
        handleTextIcon();
      }
      return;
    }
      setUrlError(""); 
      setNameError("");
  
      dispatch(
        addSite({
          name: name,
          url: url,
          icon: logo,
          type: "site",
          x: Math.floor(Math.random() * 6),
          y: Math.floor(Math.random() * 3),
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
          ref={nameInputRef}
          placeholder={nameError ? nameError : "Name"}
          className="w-3/4 h-10 bg-white outline-none text-gray-900 px-2 rounded-lg"
          onChange={(e) => {setName(e.target.value);
            if (e.target.value.trim()) {
              setNameError(""); 
            }
          }}
        />
         <input
          type="text"
          ref={urlRef}
          placeholder={urlError ? urlError : "URL"}
          className="w-3/4 h-10 bg-white outline-none text-gray-900 px-2 rounded-lg"
          onChange={(e) => {
            setUrl(e.target.value);
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
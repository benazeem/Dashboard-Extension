import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { hexToRgb, rgbToHsl } from "../utils/colorConverters"; // put the above utils here
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { X } from "lucide-react";
import useMainLayout from "@/hooks/useMainLayout";
import { Button } from "@/components/ui/button";


const ColorPicker = () => {
  const [color, setColor] = useState("#ff5733");
  const { updateMainLayout } = useMainLayout();


  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center" style={{ backgroundColor: color }}>
     <div className="absolute top-1 right-1">
     <Button
          className="w-10 h-10 absolute right-[5.5%] top-[1%] rounded-full border-[1px] border-gray-500  flex justify-center items-center z-50"
          size={"lg"}
          variant={"ghost"}
          onClick={() => {
            updateMainLayout("main-app-layout");
          }}
        ><X />
        </Button>
     </div>

        <div className="w-1/2 h-1/2">

        <DotLottieReact
                      src="https://lottie.host/e47fdf5a-caed-45b9-9085-538cc14e9aab/6DpxBM2dOa.lottie"
                      className="w-full h-full"
                      loop
                      autoplay
                      speed={0.5}
                    />
<div className="isolate aspect-video flex flex-col justify-center items-center w-1/2 h-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/10 backdrop-blur-[1px]">
     <HexColorPicker color={color} onChange={setColor} />
      <div style={{ marginTop: "1rem" }}>
        <p>HEX: <code>{color}</code></p>
        <p>RGB: <code>{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</code></p>
        <p>HSL: <code>{`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}</code></p>
      </div></div>
    </div></div>
  );
};

export default ColorPicker;

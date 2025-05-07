export default async function base64 (file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        return reject(new Error("Invalid file type. Please upload an image."));
      }
  
      const reader = new FileReader();
      
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Failed to create canvas context"));
  
          // Set canvas size to match image
          canvas.width = img.width;
          canvas.height = img.height;
  
          // Draw image onto the canvas
          ctx.drawImage(img, 0, 0);
  
          // Convert canvas to Base64 (PNG format by default)
          resolve(canvas.toDataURL("image/png")); // Change to "image/jpeg" if needed
        };
  
        img.onerror = () => reject(new Error("Failed to load image"));
      };
  
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsDataURL(file);
    });
  };
  
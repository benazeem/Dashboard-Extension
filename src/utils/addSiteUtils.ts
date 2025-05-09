export function creatingTextLogo({firstAlpha, color}:{firstAlpha: string, color: string}) {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const normalizedColor = color.trim().toLowerCase();

      const isWhiteBackground = (() => {
        const rgbMatch = normalizedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000; // Calculate perceived brightness
          return brightness > 240; // Threshold for very light colors
        }
        return normalizedColor === "#ffffff";
      })();
      
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
    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl;
}

export async function base64 (file: File): Promise<string> {
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
  
//fetchFavicon
export  async function fetchFavicon(url: string): Promise<string> {
    try {
        const website = new URL(url);
        const googleFaviconAPI = `https://www.google.com/s2/favicons?sz=256&domain=${website.hostname}`;

        const response = await fetch(googleFaviconAPI);
        if (!response.ok) throw new Error("No favicon found");

        const blob = await response.blob();
        if (blob.size < 500) throw new Error("Default favicon detected");

        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error fetching favicon:", error);
        return "";
    }
}

//fetch Website Color
export async function fetchWebsiteColor(url: string): Promise<string | null> {
    try {
        const faviconUrl = await fetchFaviconUrl(url);
        if (!faviconUrl) return await extractBackgroundColor(url);
        return await extractDominantColor(faviconUrl);
    } catch (error) {
        console.error("Error extracting color:", error);
        return null;
    }
}


async function fetchFaviconUrl(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const match = html.match(/<link.*?rel=["'](?:shortcut icon|icon)["'].*?href=["'](.*?)["']/i);
        return match ? new URL(match[1], url).href : `https://www.google.com/s2/favicons?sz=256&domain=${new URL(url).hostname}`;
    } catch {
        return null;
    }
}

async function extractDominantColor(imageUrl: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("Canvas not supported");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const colorCounts: Record<string, number> = {};

            for (let i = 0; i < data.length; i += 4) {
                const color = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
                colorCounts[color] = (colorCounts[color] || 0) + 1;
            }

            resolve(Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0][0]);
        };

        img.onerror = () => reject("Image load failed");
    });
}

async function extractBackgroundColor(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const match = html.match(/background-color:\s*([^;]+)/i);
        return match ? match[1].trim() : null;
    } catch {
        return null;
    }
}
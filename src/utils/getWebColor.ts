
export default async function getWebColor(url: string): Promise<string | null> {
    try {
        const faviconUrl = await fetchFaviconUrl(url);
        if (!faviconUrl) return await extractBackgroundColor(url);
        return await extractDominantColor(faviconUrl);
    } catch (error) {
        console.error("Error extracting color:", error);
        return null;
    }
}

// Fetch favicon URL from meta tags or Google API
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

// Extract dominant color from favicon
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

// Extract background color from website CSS
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
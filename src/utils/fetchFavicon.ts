// utils/fetchFavicon.ts
export default async function fetchFavicon(url: string): Promise<string> {
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
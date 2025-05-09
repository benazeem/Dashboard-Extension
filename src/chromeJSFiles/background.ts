import {
    fetchFavicon,
    fetchWebsiteColor,
    base64,
    creatingTextLogo,
  } from "../utils/addSiteUtils"; // Grouped into one file for easier import
  
  import {
    submitCode,
    getSubmissionResult,
  } from "../utils/compileCode";
  
  type RequestAction =
    | "fetchFavicon"
    | "getWebsiteColor"
    | "convertImage"
    | "createTextLogo"
    | "submitCode"
    | "getSubmissionResult";
  
  interface BackgroundRequest {
    action: RequestAction;
    url?: string;
    file?: File;
    firstAlpha?: string;
    color?: string;
    codeParams?: {
      language_id: number;
      source_code: string;
      stdin?: string;
      expected_output?: string;
    };
    token?: string;
  }
  
  chrome.runtime.onMessage.addListener(
    (request: BackgroundRequest, _sender, sendResponse) => {
      const { action } = request;
  
      (async () => {
        try {
          switch (action) {
            case "fetchFavicon": {
              const faviconUrl = await fetchFavicon(request.url!);
              sendResponse({ faviconUrl });
              break;
            }
  
            case "getWebsiteColor": {
              const color = await fetchWebsiteColor(request.url!);
              sendResponse({ color });
              break;
            }
  
            case "convertImage": {
              if (!request.file) throw new Error("No file provided");
              const base64String = await base64(request.file);
              sendResponse({ base64: base64String });
              break;
            }
  
            case "createTextLogo": {
              const logo = creatingTextLogo({
                firstAlpha: request.firstAlpha!,
                color: request.color!,
              });
              sendResponse({ logo });
              break;
            }
  
            case "submitCode": {
              const token = await submitCode(request.codeParams!);
              sendResponse({ token });
              break;
            }
  
            case "getSubmissionResult": {
              const result = await getSubmissionResult(request.token!);
              sendResponse({ result });
              break;
            }
  
            default:
              sendResponse({ error: "Unknown action" });
          }
        } catch (err) {
          console.error(`Error handling ${action}:`, err);
          sendResponse({ error: (err as Error).message });
        }
      })();
  
      return true; // Keep message channel open for async response
    }
  );
  
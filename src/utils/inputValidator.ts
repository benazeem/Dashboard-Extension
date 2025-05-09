export function isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      const hasValidProtocol = url.protocol === "http:" || url.protocol === "https:";
      const domainRegex = /^(?!\-)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
      const hasValidDomain = domainRegex.test(url.hostname);
      return hasValidProtocol && hasValidDomain;
    } catch {
      return false;
    }
  }
  
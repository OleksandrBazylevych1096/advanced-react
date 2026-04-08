export const resolveOperatingSystem = (userAgent?: string) => {
    if (!userAgent) return null;

    if (userAgent.includes("Windows NT")) return "Windows";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
    if (userAgent.includes("Mac OS X")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";

    return null;
};

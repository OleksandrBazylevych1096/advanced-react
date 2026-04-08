export const resolveBrowser = (userAgent?: string) => {
    if (!userAgent) return null;

    if (userAgent.includes("Edg/")) return "Microsoft Edge";
    if (userAgent.includes("OPR/")) return "Opera";
    if (userAgent.includes("Chrome/")) return "Google Chrome";
    if (userAgent.includes("Firefox/")) return "Mozilla Firefox";
    if (userAgent.includes("Safari/")) return "Safari";

    return null;
};

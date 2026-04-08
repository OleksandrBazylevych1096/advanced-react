export const resolveDeviceTypeKey = (userAgent?: string) => {
    if (!userAgent) return "settings.pages.security.unknown";

    if (/ipad|tablet/i.test(userAgent)) return "settings.pages.security.deviceTablet";
    if (/mobi|iphone|android/i.test(userAgent)) return "settings.pages.security.deviceMobile";

    return "settings.pages.security.deviceDesktop";
};

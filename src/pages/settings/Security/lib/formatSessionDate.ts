export const formatSessionDate = (isoDate: string | undefined, locale: string) => {
    if (!isoDate) return null;

    const parsedDate = new Date(isoDate);
    if (Number.isNaN(parsedDate.getTime())) {
        return isoDate;
    }

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(parsedDate);
};

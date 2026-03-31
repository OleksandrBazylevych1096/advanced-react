export const formatDateCard = (dateValue: string, locale: string) => {
    const date = new Date(`${dateValue}T00:00:00`);

    const weekDay = new Intl.DateTimeFormat(locale, {weekday: "short"}).format(date);
    const monthDay = new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
    }).format(date);

    return {
        weekDay,
        monthDay,
    };
};

export const formatSelectedDateTitle = (dateValue: string, locale: string) => {
    const date = new Date(`${dateValue}T00:00:00`);

    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
    }).format(date);
};

interface DeliverySelectionLike {
    date?: string | null;
    time?: string | null;
}

export const getDeliveryLabel = (
    locale: string,
    selection: DeliverySelectionLike | null,
    defaultLabel = "Choose delivery date",
): string => {
    if (!selection || !selection.time || !selection.date) return defaultLabel;

    // selection.date can be with time or without
    const date = new Date(`${selection.date.slice(0, 10)}T00:00:00`);
    const dateLabel = new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "2-digit",
        month: "short",
    }).format(date);

    return `${dateLabel}, ${selection.time}`;
};

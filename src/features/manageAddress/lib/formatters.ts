export const buildStreetSearchQuery = (
  street: string,
  city: string
): string => {
  return [street, city].filter(Boolean).join(", ");
};

export const formatStreetAddress = (
  housenumber?: string,
  name?: string,
  street?: string
): string => {
  return [housenumber || name, street].filter(Boolean).join(", ");
};

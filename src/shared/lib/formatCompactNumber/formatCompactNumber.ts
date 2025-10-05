export const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat("en-GB", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};

export const validateForm = (
  streetAddress: string,
  city: string,
  numberOfApartment: string,
  zipCode: string
): boolean => {
  return Boolean(
    streetAddress.trim() &&
      city.trim() &&
      numberOfApartment.trim() &&
      zipCode.trim()
  );
};

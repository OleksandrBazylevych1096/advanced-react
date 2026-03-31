import type {BaseShippingAddress} from "../model/types/types";

export const buildShippingAddressLabel = (
    address: BaseShippingAddress | undefined,
    fallbackMessage: string,
) => {
    if (!address) {
        return fallbackMessage;
    }

    const apartmentLabel = address.numberOfApartment ? `apt. №${address.numberOfApartment}` : null;
    const addressParts = [
        apartmentLabel,
        address.streetAddress,
        address.city,
        address.zipCode,
    ].filter((part): part is string => Boolean(part));

    return addressParts.length > 0 ? addressParts.join(", ") : fallbackMessage;
};

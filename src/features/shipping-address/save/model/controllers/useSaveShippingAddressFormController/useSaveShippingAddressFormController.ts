import type {LatLngTuple} from "leaflet";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import type {AddressSearchResult} from "@/entities/shipping-address";

import {useDebounce} from "@/shared/lib/async";
import {useToast} from "@/shared/lib/notifications";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib/state";

import {
    useCreateShippingAddressMutation,
    useEditShippingAddressMutation,
    useSearchAddressesQuery,
} from "../../../api/saveShippingAddressApi";
import {
    BLUR_DELAY,
    DEBOUNCE_DELAY,
    MIN_CITY_QUERY_LENGTH,
    MIN_STREET_QUERY_LENGTH,
} from "../../../consts/defaults";
import {buildStreetSearchQuery} from "../../../lib/formatters";
import {validateForm} from "../../../lib/validateForm";
import {
    selectSaveShippingAddressCity,
    selectSaveShippingAddressId,
    selectSaveShippingAddressLocation,
    selectSaveShippingAddressMode,
    selectSaveShippingAddressNumberOfApartment,
    selectSaveShippingAddressStreetAddress,
    selectSaveShippingAddressZipCode,
} from "../../selectors/saveShippingAddressSelectors";
import {saveShippingAddressActions} from "../../slice/saveShippingAddressSlice";

const SAVE_ADDRESS_ERROR_MESSAGE = "Failed to save address. Please try again.";

const getSaveAddressErrorMessage = (error: unknown) => {
    if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
    ) {
        return error.data.message;
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string" &&
        error.message.trim()
    ) {
        return error.message;
    }

    return SAVE_ADDRESS_ERROR_MESSAGE;
};

export const useSaveShippingAddressFormController = () => {
    const dispatch = useAppDispatch();
    const {i18n} = useTranslation();
    const {error} = useToast();

    const location = useAppSelector(selectSaveShippingAddressLocation);
    const editingAddressId = useAppSelector(selectSaveShippingAddressId);
    const mode = useAppSelector(selectSaveShippingAddressMode);
    const streetAddress = useAppSelector(selectSaveShippingAddressStreetAddress);
    const city = useAppSelector(selectSaveShippingAddressCity);
    const numberOfApartment = useAppSelector(selectSaveShippingAddressNumberOfApartment);
    const zipCode = useAppSelector(selectSaveShippingAddressZipCode);

    const [showStreetSuggestions, setShowStreetSuggestions] = useState(false);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);

    const [initialValues] = useState(() => ({
        streetAddress,
        city,
        numberOfApartment,
        zipCode,
        location: [...location] as LatLngTuple,
    }));

    const [createAddress, {isLoading: isCreating}] = useCreateShippingAddressMutation();
    const [editAddress, {isLoading: isEditing}] = useEditShippingAddressMutation();

    const hasChanges =
        mode === "add" ||
        initialValues.streetAddress !== streetAddress ||
        initialValues.city !== city ||
        initialValues.numberOfApartment !== numberOfApartment ||
        initialValues.zipCode !== zipCode ||
        initialValues.location[0] !== location[0] ||
        initialValues.location[1] !== location[1];

    const streetQuery = buildStreetSearchQuery(streetAddress, city);
    const debouncedStreetQuery = useDebounce(streetQuery, DEBOUNCE_DELAY);
    const debouncedCityQuery = useDebounce(city, DEBOUNCE_DELAY);
    const canSave = validateForm(streetAddress, city, numberOfApartment, zipCode) && hasChanges;
    const isSubmitting = isCreating || isEditing;

    const shouldSearchStreet = debouncedStreetQuery.trim().length >= MIN_STREET_QUERY_LENGTH;
    const {data: streetSuggestions} = useSearchAddressesQuery(
        {
            searchQuery: debouncedStreetQuery,
            locale: i18n.language,
        },
        {skip: !shouldSearchStreet || !showStreetSuggestions},
    );

    const shouldSearchCity = debouncedCityQuery.trim().length >= MIN_CITY_QUERY_LENGTH;
    const {data: citySuggestions} = useSearchAddressesQuery(
        {
            searchQuery: debouncedCityQuery,
            locale: i18n.language,
        },
        {skip: !shouldSearchCity || !showCitySuggestions},
    );

    const changeStreetAddress = (value: string) => {
        dispatch(saveShippingAddressActions.setFormStreetAddress(value));
        setShowStreetSuggestions(true);
    };

    const changeCity = (value: string) => {
        dispatch(saveShippingAddressActions.setFormCity(value));
        setShowCitySuggestions(true);
    };

    const changeApartment = (value: string) => {
        dispatch(saveShippingAddressActions.setFormNumberOfApartment(value));
    };

    const changeZipCode = (value: string) => {
        dispatch(saveShippingAddressActions.setFormZipCode(value));
    };

    const selectSuggestion = (suggestion: AddressSearchResult, type: "street" | "city") => {
        dispatch(saveShippingAddressActions.setLocation([suggestion.lat, suggestion.lon]));

        if (type === "street") {
            setShowStreetSuggestions(false);
        } else {
            setShowCitySuggestions(false);
        }
    };

    const focusStreet = () => {
        setShowStreetSuggestions(true);
        setShowCitySuggestions(false);
    };

    const blurStreet = () => {
        setTimeout(() => setShowStreetSuggestions(false), BLUR_DELAY);
    };

    const focusCity = () => {
        setShowCitySuggestions(true);
        setShowStreetSuggestions(false);
    };

    const blurCity = () => {
        setTimeout(() => setShowCitySuggestions(false), BLUR_DELAY);
    };

    const submitAddress = async () => {
        if (!canSave) return;

        setShowStreetSuggestions(false);
        setShowCitySuggestions(false);

        const addressData = {
            city,
            numberOfApartment,
            streetAddress,
            zipCode,
            latitude: location[0],
            longitude: location[1],
        };

        try {
            if (mode === "add") {
                await createAddress(addressData).unwrap();
            } else if (mode === "edit" && editingAddressId) {
                await editAddress({
                    id: editingAddressId,
                    body: addressData,
                }).unwrap();
            }

            dispatch(saveShippingAddressActions.returnToChoose());
        } catch (err: unknown) {
            error(getSaveAddressErrorMessage(err));
        }
    };

    return createControllerResult({
        data: {
            streetAddress,
            streetSuggestions,
            showStreetSuggestions,
            city,
            citySuggestions,
            numberOfApartment,
            zipCode,
            showCitySuggestions,
            mode,
        },
        derived: {
            canSave,
        },
        status: {
            isSubmitting,
        },
        actions: {
            submitAddress,
            changeApartment,
            blurCity,
            changeCity,
            focusCity,
            blurStreet,
            focusStreet,
            changeStreetAddress,
            changeZipCode,
            selectSuggestion,
        },
    });
};


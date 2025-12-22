import type {LatLngTuple} from "leaflet";
import {type FormEvent, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";

import {
    useCreateShippingAddressMutation,
    useEditShippingAddressMutation,
    useSearchAddressesQuery
} from "@/features/manageAddress/api/manageAddressApi.ts";
import {
    BLUR_DELAY,
    DEBOUNCE_DELAY,
    MIN_CITY_QUERY_LENGTH,
    MIN_STREET_QUERY_LENGTH
} from "@/features/manageAddress/consts/defaults.ts";
import {buildStreetSearchQuery} from "@/features/manageAddress/lib/formatters.ts";
import {validateForm} from "@/features/manageAddress/lib/validateForm.ts";
import {
    selectManageAddressCity
} from "@/features/manageAddress/model/selectors/selectManageAddressCity/selectManageAddressCity.tsx";
import {
    selectManageAddressId
} from "@/features/manageAddress/model/selectors/selectManageAddressId/selectManageAddressId.tsx";
import {
    selectManageAddressLocation
} from "@/features/manageAddress/model/selectors/selectManageAddressLocation/selectManageAddressLocation.tsx";
import {
    selectManageAddressMode
} from "@/features/manageAddress/model/selectors/selectManageAddressMode/selectManageAddressMode.tsx";
import {
    selectManageAddressNumberOfApartment
} from "@/features/manageAddress/model/selectors/selectManageAddressNumberOfApartment/selectManageAddressNumberOfApartment.tsx";
import {
    selectManageAddressStreetAddress
} from "@/features/manageAddress/model/selectors/selectManageAddressStreetAddress/selectManageAddressStreetAddress.tsx";
import {
    selectManageAddressZipCode
} from "@/features/manageAddress/model/selectors/selectManageAddressZipCode/selectManageAddressZipCode.tsx";
import {manageAddressActions} from "@/features/manageAddress/model/slice/addressSlice.ts";
import type {AddressSearchResult} from "@/features/manageAddress/model/types/Address.ts";

import {useAppDispatch, useAppSelector, useToast} from "@/shared/lib";
import {useDebounce} from "@/shared/lib/hooks/useDebounce.ts";

export const useEditAddressForm = () => {
    const dispatch = useAppDispatch();
    const {i18n} = useTranslation();
    const {error} = useToast();

    const location = useAppSelector(selectManageAddressLocation);
    const editingAddressId = useAppSelector(selectManageAddressId);
    const mode = useAppSelector(selectManageAddressMode);
    const streetAddress = useAppSelector(selectManageAddressStreetAddress);
    const city = useAppSelector(selectManageAddressCity);
    const numberOfApartment = useAppSelector(
        selectManageAddressNumberOfApartment
    );
    const zipCode = useAppSelector(selectManageAddressZipCode);

    const [showStreetSuggestions, setShowStreetSuggestions] = useState(false);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);

    const [initialValues] = useState(() => ({
        streetAddress,
        city,
        numberOfApartment,
        zipCode,
        location: [...location] as LatLngTuple,
    }));

    const [createAddress, {isLoading: isCreating}] =
        useCreateShippingAddressMutation();
    const [editAddress, {isLoading: isEditing}] =
        useEditShippingAddressMutation();

    const hasChanges = useMemo(() => {
        if (mode === "add") return true;

        return (
            initialValues.streetAddress !== streetAddress ||
            initialValues.city !== city ||
            initialValues.numberOfApartment !== numberOfApartment ||
            initialValues.zipCode !== zipCode ||
            initialValues.location[0] !== location[0] ||
            initialValues.location[1] !== location[1]
        );
    }, [
        mode,
        streetAddress,
        city,
        numberOfApartment,
        zipCode,
        location,
        initialValues,
    ]);

    const streetQuery = buildStreetSearchQuery(streetAddress, city);
    const debouncedStreetQuery = useDebounce(streetQuery, DEBOUNCE_DELAY);
    const debouncedCityQuery = useDebounce(city, DEBOUNCE_DELAY);
    const canSave =
        validateForm(streetAddress, city, numberOfApartment, zipCode) && hasChanges;
    const isSubmitting = isCreating || isEditing;

    const shouldSearchStreet =
        debouncedStreetQuery.trim().length >= MIN_STREET_QUERY_LENGTH;
    const {data: streetSuggestions} = useSearchAddressesQuery(
        {
            searchQuery: debouncedStreetQuery,
            locale: i18n.language,
        },
        {skip: !shouldSearchStreet || !showStreetSuggestions}
    );

    const shouldSearchCity =
        debouncedCityQuery.trim().length >= MIN_CITY_QUERY_LENGTH;
    const {data: citySuggestions} = useSearchAddressesQuery(
        {
            searchQuery: debouncedCityQuery,
            locale: i18n.language,
        },
        {skip: !shouldSearchCity || !showCitySuggestions}
    );

    const handleStreetAddressChange = (value: string) => {
        dispatch(manageAddressActions.setFormStreetAddress(value));
        setShowStreetSuggestions(true);
    };

    const handleCityChange = (value: string) => {
        dispatch(manageAddressActions.setFormCity(value));
        setShowCitySuggestions(true);
    };

    const handleApartmentChange = (value: string) => {
        dispatch(manageAddressActions.setFormNumberOfApartment(value));
    };

    const handleZipCodeChange = (value: string) => {
        dispatch(manageAddressActions.setFormZipCode(value));
    };

    const handleSuggestionClick = (
        suggestion: AddressSearchResult,
        type: "street" | "city"
    ) => {
        dispatch(
            manageAddressActions.setLocation([suggestion.lat, suggestion.lon])
        );

        if (type === "street") {
            setShowStreetSuggestions(false);
        } else {
            setShowCitySuggestions(false);
        }
    };

    const handleStreetFocus = () => {
        setShowStreetSuggestions(true);
        setShowCitySuggestions(false);
    };

    const handleStreetBlur = () => {
        setTimeout(() => setShowStreetSuggestions(false), BLUR_DELAY);
    };

    const handleCityFocus = () => {
        setShowCitySuggestions(true);
        setShowStreetSuggestions(false);
    };

    const handleCityBlur = () => {
        setTimeout(() => setShowCitySuggestions(false), BLUR_DELAY);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

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

            dispatch(manageAddressActions.returnToChoose());
        } catch (err) {
            console.log(err);
            error("error");
        }
    };

    return {
        handleSubmit,
        handleApartmentChange,
        handleCityBlur,
        handleCityChange,
        handleCityFocus,
        handleStreetBlur,
        handleStreetFocus,
        handleStreetAddressChange,
        handleZipCodeChange,
        streetAddress,
        streetSuggestions,
        showStreetSuggestions,
        handleSuggestionClick,
        city,
        citySuggestions,
        numberOfApartment,
        zipCode,
        showCitySuggestions,
        isSubmitting,
        canSave,
        mode
    }
}
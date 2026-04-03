import type {LatLngTuple} from "leaflet";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";

import {useUserLocation} from "@/shared/lib/browser";
import {useAppDispatch, useAppSelector} from "@/shared/lib/state";

import {useGetReverseGeocodeQuery} from "../../../api/saveShippingAddressApi.ts";
import {DEFAULT_LOCATION, MAP_CONFIG} from "../../../config/defaults.ts";
import {formatStreetAddress} from "../../../lib/formatters.ts";
import {
    selectSaveShippingAddressLocation,
    selectSaveShippingAddressMode,
    selectSaveShippingAddressNumberOfApartment,
} from "../../../model/selectors/saveShippingAddressSelectors.ts";
import {saveShippingAddressActions} from "../../../model/slice/saveShippingAddressSlice.ts";

export const useMap = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector(selectSaveShippingAddressMode);
    const markerPosition = useAppSelector(selectSaveShippingAddressLocation);
    const numberOfApartments = useAppSelector(selectSaveShippingAddressNumberOfApartment);
    const {location: userLocation} = useUserLocation();
    const {i18n} = useTranslation();
    const hasManualLocationSelectionRef = useRef(false);

    const zoomLevel = mode === "edit" ? MAP_CONFIG.EDIT_ZOOM : MAP_CONFIG.DEFAULT_ZOOM;

    const {
        data: geocodeData,
        isFetching,
        isError,
    } = useGetReverseGeocodeQuery({
        coords: markerPosition,
        locale: i18n.language,
    });

    const setLocationFromMap = (position: LatLngTuple) => {
        hasManualLocationSelectionRef.current = true;
        dispatch(saveShippingAddressActions.setLocation(position));
    };

    useEffect(() => {
        if (geocodeData) {
            const streetAddress = formatStreetAddress(
                geocodeData.housenumber,
                geocodeData.name,
                geocodeData.street,
            );

            dispatch(
                saveShippingAddressActions.setForm({
                    city: geocodeData.city || "",
                    streetAddress,
                    zipCode: geocodeData.postcode || "",
                    numberOfApartment: numberOfApartments || "",
                }),
            );
        }
    }, [geocodeData, dispatch, numberOfApartments]);

    useEffect(() => {
        if (
            userLocation &&
            mode === "add" &&
            !hasManualLocationSelectionRef.current &&
            markerPosition[0] === DEFAULT_LOCATION[0] &&
            markerPosition[1] === DEFAULT_LOCATION[1]
        ) {
            dispatch(saveShippingAddressActions.setLocation(userLocation));
        }
    }, [userLocation, dispatch, markerPosition, mode]);

    useEffect(() => {
        if (mode !== "add") {
            hasManualLocationSelectionRef.current = false;
        }
    }, [mode]);

    return {
        data: {
            zoomLevel,
            markerPosition,
            geocodeLabel: geocodeData?.label,
        },
        status: {
            geocodeIsFetching: isFetching,
            geocodeIsError: isError,
        },
        actions: {
            setLocationFromMap,
        },
    };
};

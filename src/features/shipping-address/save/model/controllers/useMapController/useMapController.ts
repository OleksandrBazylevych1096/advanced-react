import type {LatLngTuple} from "leaflet";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";

import {useUserLocation} from "@/shared/lib/browser";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib/state";

import {useGetReverseGeocodeQuery} from "../../../api/saveShippingAddressApi";
import {DEFAULT_LOCATION, MAP_CONFIG} from "../../../config/defaults";
import {formatStreetAddress} from "../../../lib/formatters";
import {
    selectSaveShippingAddressLocation,
    selectSaveShippingAddressMode,
    selectSaveShippingAddressNumberOfApartment,
} from "../../selectors/saveShippingAddressSelectors";
import {saveShippingAddressActions} from "../../slice/saveShippingAddressSlice";

export const useMapController = () => {
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

    return createControllerResult({
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
    });
};

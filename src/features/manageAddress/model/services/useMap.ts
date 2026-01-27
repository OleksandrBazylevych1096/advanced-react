import type {LatLngTuple} from "leaflet";
import {useCallback, useEffect, useMemo} from "react";
import {useTranslation} from "react-i18next";

import {useGetReverseGeocodeQuery} from "@/features/manageAddress/api/manageAddressApi.ts";
import {MAP_CONFIG} from "@/features/manageAddress/consts/defaults.ts";
import {formatStreetAddress} from "@/features/manageAddress/lib/formatters.ts";
import {
    selectManageAddressLocation
} from "@/features/manageAddress/model/selectors/selectManageAddressLocation/selectManageAddressLocation.tsx";
import {
    selectManageAddressMode
} from "@/features/manageAddress/model/selectors/selectManageAddressMode/selectManageAddressMode.tsx";
import {
    selectManageAddressNumberOfApartment
} from "@/features/manageAddress/model/selectors/selectManageAddressNumberOfApartment/selectManageAddressNumberOfApartment.tsx";
import {manageAddressActions} from "@/features/manageAddress/model/slice/addressSlice.ts";

import {useAppDispatch, useAppSelector} from "@/shared/lib";
import {useUserLocation} from "@/shared/lib/hooks/useUserLocation.ts";


export const useMap = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector(selectManageAddressMode);
    const markerPosition = useAppSelector(selectManageAddressLocation);
    const numberOfApartments = useAppSelector(
        selectManageAddressNumberOfApartment
    );
    const {location: userLocation} = useUserLocation();
    const {i18n} = useTranslation();


    const zoomLevel = useMemo(() => {
        return mode === "edit" ? MAP_CONFIG.EDIT_ZOOM : MAP_CONFIG.DEFAULT_ZOOM;
    }, [mode]);

    const {data: geocodeData, isFetching, isError} = useGetReverseGeocodeQuery(
        {
            coords: markerPosition,
            locale: i18n.language,
        },
        {
            skip: !markerPosition,
        }
    );

    const handleMapClick = useCallback(
        (position: LatLngTuple) => {
            dispatch(manageAddressActions.setLocation(position));
        },
        [dispatch]
    );

    useEffect(() => {
        if (geocodeData) {
            const streetAddress = formatStreetAddress(
                geocodeData.housenumber,
                geocodeData.name,
                geocodeData.street
            );

            dispatch(
                manageAddressActions.setForm({
                    city: geocodeData.city || "",
                    streetAddress,
                    zipCode: geocodeData.postcode || "",
                    numberOfApartment: numberOfApartments || "",
                })
            );
        }
    }, [geocodeData, dispatch, mode, numberOfApartments]);

    useEffect(() => {
        if (userLocation && mode === "add") {
            dispatch(manageAddressActions.setLocation(userLocation));
        }
    }, [userLocation, dispatch, mode]);


    return {
        zoomLevel,
        markerPosition,
        handleMapClick,
        geocodeLabel: geocodeData?.label,
        geocodeIsFetching: isFetching,
        geocodeIsError: isError
    }
}
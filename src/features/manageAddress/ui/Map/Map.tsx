import L from "leaflet";
import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {MapContainer, Marker, TileLayer, Tooltip} from "react-leaflet";

import {MAP_CONFIG, TILE_LAYER_CONFIG,} from "@/features/manageAddress/consts/defaults";
import {useMap} from "@/features/manageAddress/lib/useMap.ts";

import MapPinIcon from "@/shared/assets/icons/MapPinFilled.svg?raw";
import {Spinner} from "@/shared/ui";

import styles from "./Map.module.scss";
import "leaflet/dist/leaflet.css";
import {MapCenterUpdater} from "./MapCenterUpdater";
import {MapClickHandler} from "./MapClickHandler";
import {MapControls} from "./MapControls";

const createCustomIcon = () =>
    L.divIcon({
        html: MapPinIcon,
        className: styles.icon,
        iconSize: MAP_CONFIG.ICON_SIZE,
        iconAnchor: MAP_CONFIG.ICON_ANCHOR,
    });

export const Map = () => {
    const customIcon = useMemo(() => createCustomIcon(), []);
    const {t} = useTranslation()
    const {zoomLevel, handleMapClick, markerPosition, geocodeLabel, geocodeIsFetching} = useMap()

    if (!markerPosition) {
        return (
            <div className={styles.mapPlaceholder}>
                <Spinner size="lg"/>
                <p>{t("manageAddress.loadingMap")}</p>
            </div>
        );
    }

    return (
        <MapContainer
            className={styles.map}
            center={markerPosition}
            zoom={zoomLevel}
            scrollWheelZoom
            zoomControl={false}
            attributionControl
        >
            <TileLayer {...TILE_LAYER_CONFIG} />

            <MapControls marker={markerPosition}/>
            <MapClickHandler onMapClick={handleMapClick}/>
            <MapCenterUpdater center={markerPosition}/>

            <Marker position={markerPosition} icon={customIcon}>
                {geocodeLabel && (
                    <Tooltip
                        className={styles.tooltip}
                        permanent
                        direction="top"
                        offset={MAP_CONFIG.TOOLTIP_OFFSET}
                    >
                        {geocodeIsFetching ? <Spinner size="sm"/> : geocodeLabel}
                    </Tooltip>
                )}
            </Marker>
        </MapContainer>
    );
};

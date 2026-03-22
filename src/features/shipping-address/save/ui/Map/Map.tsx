import L from "leaflet";
import {MapContainer, Marker, TileLayer, Tooltip} from "react-leaflet";

import MapPinIcon from "@/shared/assets/icons/MapPinFilled.svg?raw";
import {Spinner} from "@/shared/ui/Spinner";

import {MAP_CONFIG, TILE_LAYER_CONFIG} from "../../config/defaults";
import {useMapController} from "../../model/controllers/useMapController/useMapController";

import styles from "./Map.module.scss";
import "leaflet/dist/leaflet.css";
import {MapCenterUpdater} from "./MapHelpers/MapCenterUpdater";
import {MapClickHandler} from "./MapHelpers/MapClickHandler";
import {MapControls} from "./MapHelpers/MapControls";

const createCustomIcon = () =>
    L.divIcon({
        html: MapPinIcon,
        className: styles.icon,
        iconSize: MAP_CONFIG.ICON_SIZE,
        iconAnchor: MAP_CONFIG.ICON_ANCHOR,
    });

export const Map = () => {
    const customIcon = createCustomIcon();
    const {
        data: {zoomLevel, markerPosition, geocodeLabel},
        status: {geocodeIsFetching, geocodeIsError},
        actions: {setLocationFromMap},
    } = useMapController();

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

            <MapControls marker={markerPosition} />
            <MapClickHandler onMapClick={setLocationFromMap} />
            <MapCenterUpdater center={markerPosition} />

            <Marker position={markerPosition} icon={customIcon}>
                {(geocodeLabel || geocodeIsFetching || geocodeIsError) && (
                    <Tooltip
                        className={styles.tooltip}
                        permanent
                        direction="top"
                        offset={MAP_CONFIG.TOOLTIP_OFFSET}
                    >
                        {geocodeIsFetching ? (
                            <Spinner size="sm" />
                        ) : geocodeIsError ? (
                            "Error"
                        ) : (
                            geocodeLabel
                        )}
                    </Tooltip>
                )}
            </Marker>
        </MapContainer>
    );
};

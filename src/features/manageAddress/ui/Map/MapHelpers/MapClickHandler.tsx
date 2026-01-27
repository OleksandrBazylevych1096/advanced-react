import type { LatLngTuple } from "leaflet";
import { useMapEvents } from "react-leaflet";

export const MapClickHandler = ({
  onMapClick,
}: {
  onMapClick: (position: LatLngTuple) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

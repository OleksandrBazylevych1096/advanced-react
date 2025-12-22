import type { LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";

export const useUserLocation = () => {
  const [location, setLocation] = useState<LatLngTuple | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation не підтримується вашим браузером");
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition): void => {
      setLocation([position.coords.latitude, position.coords.longitude]);
      setError(null);
      setLoading(false);
    };

    const handleError = (err: GeolocationPositionError): void => {
      let errorMessage = "Не вдалося отримати координати";

      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Користувач заборонив доступ до геолокації";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Інформація про місцезнаходження недоступна";
          break;
        case err.TIMEOUT:
          errorMessage = "Перевищено час очікування запиту";
          break;
        default:
          errorMessage = "Невідома помилка при отриманні координат";
      }

      setError(errorMessage);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  }, []);

  return { location, error, loading };
};

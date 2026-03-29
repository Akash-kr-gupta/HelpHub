// src/hooks/Location.js
import { useState, useEffect } from "react";

const useLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Unable to fetch location.");
        setLocation({ latitude: null, longitude: null });
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    // Optional: fetch location on mount
    // getLocation();
  }, []);

  return { location, error, loading, getLocation };
};

export default useLocation;
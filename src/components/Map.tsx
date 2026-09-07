import { useEffect, useRef } from "react";
import { MAPS_CONFIG } from "../config/environment";

interface MapProps {
  events: any[];
  userLocation?: { latitude: number; longitude: number } | null;
  onMarkerClick?: (eventId: string) => void;
}

const Map: React.FC<MapProps> = ({ events, userLocation, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Load Google Maps script dynamically
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_CONFIG.API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Default center from configuration
      const defaultCenter = MAPS_CONFIG.DEFAULT_CENTER;

      // Use user location if available
      const center = userLocation
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : defaultCenter;

      // Create map instance
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: userLocation ? 10 : MAPS_CONFIG.DEFAULT_ZOOM,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });

      // Add markers for events
      addEventMarkers();

      // Add user location marker if available
      if (userLocation) {
        new window.google.maps.Marker({
          position: { lat: userLocation.latitude, lng: userLocation.longitude },
          map: mapInstanceRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          title: "Your Location",
        });

        // Add circle for 100km radius
        new window.google.maps.Circle({
          strokeColor: "#4285F4",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#4285F4",
          fillOpacity: 0.1,
          map: mapInstanceRef.current,
          center: { lat: userLocation.latitude, lng: userLocation.longitude },
          radius: 100000, // 100km in meters
        });
      }
    };

    const addEventMarkers = () => {
      if (!mapInstanceRef.current || !events.length) return;

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Add markers for each event
      events.forEach((event) => {
        if (!event.latitude || !event.longitude) return;

        const marker = new window.google.maps.Marker({
          position: { lat: event.latitude, lng: event.longitude },
          map: mapInstanceRef.current,
          title: event.title,
          animation: window.google.maps.Animation.DROP,
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="max-width: 200px;">
              <h5>${event.title}</h5>
              <p>${event.venue}</p>
              <p><strong>Date:</strong> ${event.date}</p>
              <button
                id="view-event-${event.id}"
                style="background-color: #4361ee; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;"
              >
                View Details
              </button>
            </div>
          `,
        });

        // Add click listener to marker
        marker.addListener("click", () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        // Add click listener to the "View Details" button in info window
        window.google.maps.event.addListener(infoWindow, "domready", () => {
          document
            .getElementById(`view-event-${event.id}`)
            ?.addEventListener("click", () => {
              if (onMarkerClick) {
                onMarkerClick(event.id);
              }
            });
        });

        markersRef.current.push(marker);
      });
    };

    loadGoogleMapsScript();

    return () => {
      // Clean up markers
      markersRef.current.forEach((marker) => marker.setMap(null));
    };
  }, [events, userLocation, onMarkerClick]);

  // Update markers when events change
  useEffect(() => {
    if (mapInstanceRef.current && events.length > 0) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Add markers for each event
      events.forEach((event) => {
        if (!event.latitude || !event.longitude) return;

        const marker = new window.google.maps.Marker({
          position: { lat: event.latitude, lng: event.longitude },
          map: mapInstanceRef.current,
          title: event.title,
        });

        markersRef.current.push(marker);
      });
    }
  }, [events]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    ></div>
  );
};

export default Map;

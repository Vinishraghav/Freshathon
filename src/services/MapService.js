import { MAPS_CONFIG } from "../config/environment";

/**
 * MapService - A service for handling map-related functionality
 */
class MapService {
  constructor() {
    this.apiKey = MAPS_CONFIG.API_KEY;
    this.defaultCenter = MAPS_CONFIG.DEFAULT_CENTER;
    this.defaultZoom = MAPS_CONFIG.DEFAULT_ZOOM;
    this.mapInstance = null;
    this.markers = [];
    this.infoWindows = [];
    this.geocoder = null;
    this.placesService = null;
    this.directionsService = null;
    this.directionsRenderer = null;
    this.isLoaded = false;
    this.loadPromise = null;
  }

  /**
   * Load the Google Maps API
   * @returns {Promise} A promise that resolves when the API is loaded
   */
  loadMapsApi() {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Check if API is already loaded
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        this.initServices();
        resolve();
        return;
      }

      // Create callback function
      const callbackName = `googleMapsCallback_${Math.random().toString(36).substr(2, 9)}`;
      window[callbackName] = () => {
        this.isLoaded = true;
        this.initServices();
        resolve();
        delete window[callbackName];
      };

      // Load the script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = (error) => {
        reject(new Error("Failed to load Google Maps API"));
        delete window[callbackName];
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  /**
   * Initialize Google Maps services
   */
  initServices() {
    if (!this.isLoaded || !window.google || !window.google.maps) {
      return;
    }

    this.geocoder = new window.google.maps.Geocoder();
    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsRenderer = new window.google.maps.DirectionsRenderer();
  }

  /**
   * Initialize a map in the specified element
   * @param {HTMLElement} element - The DOM element to render the map in
   * @param {Object} options - Map options
   * @returns {Promise<google.maps.Map>} The map instance
   */
  async initMap(element, options = {}) {
    await this.loadMapsApi();

    if (!element) {
      throw new Error("Map element is required");
    }

    const mapOptions = {
      center: options.center || this.defaultCenter,
      zoom: options.zoom || this.defaultZoom,
      mapTypeControl: options.mapTypeControl !== undefined ? options.mapTypeControl : false,
      fullscreenControl: options.fullscreenControl !== undefined ? options.fullscreenControl : true,
      streetViewControl: options.streetViewControl !== undefined ? options.streetViewControl : false,
      zoomControl: options.zoomControl !== undefined ? options.zoomControl : true,
      styles: options.styles || [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      ...options,
    };

    this.mapInstance = new window.google.maps.Map(element, mapOptions);
    return this.mapInstance;
  }

  /**
   * Add a marker to the map
   * @param {Object} options - Marker options
   * @returns {google.maps.Marker} The marker instance
   */
  addMarker(options) {
    if (!this.mapInstance) {
      throw new Error("Map not initialized");
    }

    const marker = new window.google.maps.Marker({
      map: this.mapInstance,
      position: options.position,
      title: options.title,
      icon: options.icon,
      animation: options.animation,
      ...options,
    });

    this.markers.push(marker);
    return marker;
  }

  /**
   * Add an info window to a marker
   * @param {google.maps.Marker} marker - The marker to attach the info window to
   * @param {string|Node} content - The content of the info window
   * @param {Object} options - Info window options
   * @returns {google.maps.InfoWindow} The info window instance
   */
  addInfoWindow(marker, content, options = {}) {
    const infoWindow = new window.google.maps.InfoWindow({
      content,
      ...options,
    });

    marker.addListener("click", () => {
      // Close all other info windows
      this.infoWindows.forEach((iw) => iw.close());
      infoWindow.open(this.mapInstance, marker);
    });

    this.infoWindows.push(infoWindow);
    return infoWindow;
  }

  /**
   * Geocode an address to get coordinates
   * @param {string} address - The address to geocode
   * @returns {Promise<Object>} The geocoded result
   */
  async geocodeAddress(address) {
    await this.loadMapsApi();

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            formattedAddress: results[0].formatted_address,
            placeId: results[0].place_id,
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  /**
   * Reverse geocode coordinates to get an address
   * @param {Object} latLng - The coordinates to reverse geocode
   * @returns {Promise<Object>} The reverse geocoded result
   */
  async reverseGeocode(latLng) {
    await this.loadMapsApi();

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve({
            address: results[0].formatted_address,
            placeId: results[0].place_id,
            addressComponents: results[0].address_components,
          });
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    });
  }

  /**
   * Calculate the distance between two points
   * @param {Object} origin - The origin coordinates
   * @param {Object} destination - The destination coordinates
   * @returns {number} The distance in kilometers
   */
  calculateDistance(origin, destination) {
    if (!window.google || !window.google.maps) {
      throw new Error("Google Maps API not loaded");
    }

    const originLatLng = new window.google.maps.LatLng(origin.lat, origin.lng);
    const destLatLng = new window.google.maps.LatLng(destination.lat, destination.lng);

    // Calculate distance in meters
    const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
      originLatLng,
      destLatLng
    );

    // Convert to kilometers
    return distanceInMeters / 1000;
  }

  /**
   * Get the user's current location
   * @returns {Promise<Object>} The user's location
   */
  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  /**
   * Clear all markers from the map
   */
  clearMarkers() {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  /**
   * Clear all info windows
   */
  clearInfoWindows() {
    this.infoWindows.forEach((infoWindow) => infoWindow.close());
    this.infoWindows = [];
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.clearMarkers();
    this.clearInfoWindows();
    this.mapInstance = null;
  }
}

// Export a singleton instance
export default new MapService();

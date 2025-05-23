import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EventList from "../components/EventList";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import DateFilter from "../components/DateFilter";
import Map from "../components/Map";
import { getEvents, getNearbyEvents } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const EventDiscovery = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nearbyError, setNearbyError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [searchFilters, setSearchFilters] = useState({
    term: "",
    category: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get user's location and fetch nearby events
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting location:", error);
            setNearbyError(
              "Unable to get your location. Please enable location services."
            );
            setNearbyLoading(false);
          }
        );
      } else {
        setNearbyError("Geolocation is not supported by your browser.");
        setNearbyLoading(false);
      }
    };

    getUserLocation();
  }, []);

  // Fetch nearby events when user location is available
  useEffect(() => {
    const fetchNearbyEvents = async () => {
      if (!userLocation) return;

      try {
        setNearbyLoading(true);
        const data = await getNearbyEvents(
          userLocation.latitude,
          userLocation.longitude
        );
        setNearbyEvents(data);
      } catch (err) {
        console.error("Error fetching nearby events:", err);
        setNearbyError("Failed to load nearby events. Please try again later.");
      } finally {
        setNearbyLoading(false);
      }
    };

    fetchNearbyEvents();
  }, [userLocation]);

  // Filter events based on search criteria
  const filterEvents = useCallback(() => {
    const { term, category, location, startDate, endDate } = searchFilters;

    // If no filters are applied, show all events
    if (!term && !category && !location && !startDate && !endDate) {
      setFilteredEvents(events);
      return;
    }

    // Apply filters
    const filtered = events.filter((event) => {
      // Text search filter
      const matchesTerm =
        !term ||
        event.title.toLowerCase().includes(term.toLowerCase()) ||
        (event.description &&
          event.description.toLowerCase().includes(term.toLowerCase()));

      // Category filter
      const matchesCategory = !category || event.category === category;

      // Location filter
      const matchesLocation =
        !location ||
        (event.venue &&
          event.venue.toLowerCase().includes(location.toLowerCase()));

      // Date range filter
      let matchesDateRange = true;
      if (startDate || endDate) {
        const eventDate = event.date;

        if (startDate && eventDate < startDate) {
          matchesDateRange = false;
        }

        if (endDate && eventDate > endDate) {
          matchesDateRange = false;
        }
      }

      return (
        matchesTerm && matchesCategory && matchesLocation && matchesDateRange
      );
    });

    setFilteredEvents(filtered);
  }, [events, searchFilters]);

  // Apply filters when search criteria or events change
  useEffect(() => {
    filterEvents();
  }, [filterEvents, events, searchFilters]);

  // Handle search
  const handleSearch = (filters) => {
    // Preserve date filters when updating search filters
    const { startDate, endDate } = searchFilters;
    setSearchFilters({ ...filters, startDate, endDate });
  };

  // Handle map marker click
  const handleMarkerClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Get current events based on active tab
  const currentEvents = activeTab === "all" ? filteredEvents : nearbyEvents;
  const isLoading = activeTab === "all" ? loading : nearbyLoading;
  const currentError = activeTab === "all" ? error : nearbyError;

  return (
    <div className="container">
      <h1 className="mb-4">Discover Events</h1>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Category Filter */}
      <div className="row">
        <div className="col-md-6">
          <CategoryFilter
            onCategoryChange={(category) =>
              setSearchFilters({ ...searchFilters, category })
            }
            selectedCategory={searchFilters.category || "all"}
          />
        </div>
        <div className="col-md-6">
          <DateFilter
            onDateFilterChange={({ startDate, endDate }) =>
              setSearchFilters({ ...searchFilters, startDate, endDate })
            }
          />
        </div>
      </div>

      {/* View Mode and Tab Selector */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Events
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "nearby" ? "active" : ""}`}
              onClick={() => setActiveTab("nearby")}
            >
              Nearby Events (100km)
            </button>
          </li>
        </ul>

        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${
              viewMode === "list" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setViewMode("list")}
          >
            <i className="bi bi-list-ul me-1"></i> List
          </button>
          <button
            type="button"
            className={`btn ${
              viewMode === "map" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setViewMode("map")}
          >
            <i className="bi bi-map me-1"></i> Map
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {currentError && <div className="alert alert-danger">{currentError}</div>}

      {/* Location Warning */}
      {activeTab === "nearby" &&
        !userLocation &&
        !nearbyError &&
        !nearbyLoading && (
          <div className="alert alert-info">
            <i className="bi bi-geo-alt me-2"></i>
            Please enable location services to see nearby events.
          </div>
        )}

      {/* Map View */}
      {viewMode === "map" && (
        <div className="mb-4">
          {isLoading ? (
            <div className="text-center py-5">
              <LoadingSpinner />
            </div>
          ) : (
            <Map
              events={currentEvents}
              userLocation={userLocation}
              onMarkerClick={handleMarkerClick}
            />
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <EventList
          events={currentEvents}
          loading={isLoading}
          title={
            activeTab === "all" ? "All Upcoming Events" : "Events Near You"
          }
          emptyMessage={
            activeTab === "all"
              ? "No events found. Check back later for upcoming events!"
              : "No events found within 100km of your location."
          }
        />
      )}
    </div>
  );
};

export default EventDiscovery;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { formatDate, formatTime } from "../utils/dateUtils";
import LoadingSpinner from "./LoadingSpinner";
import CategoryBadge from "./CategoryBadge";
import ReminderForm from "./ReminderForm";
import ShareButtons from "./ShareButtons";
import RelatedEvents from "./RelatedEvents";
import SaveEventButton from "./SaveEventButton";
import Map from "./Map";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventDoc = await getDoc(doc(db, "events", id));

        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !event) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">{error || "Event Not Found"}</h2>
        <Link to="/events" className="btn btn-primary mt-3">
          Back to Events
        </Link>
      </div>
    );
  }

  // Check if event has location data for map
  const hasLocationData = event.latitude && event.longitude;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          {/* Event Image */}
          <div className="position-relative mb-4">
            <img
              src={
                event.image ||
                `https://source.unsplash.com/random/800x600/?${
                  event.category?.toLowerCase() || "event"
                }`
              }
              className="img-fluid rounded shadow event-details-image"
              alt={event.title}
            />
            {event.category && (
              <div className="position-absolute top-0 start-0 m-3">
                <CategoryBadge category={event.category} />
              </div>
            )}
          </div>

          {/* Event Title and Description */}
          <div className="mb-4">
            <h1 className="mb-3">{event.title}</h1>
            <div className="mb-4">
              <h4>About This Event</h4>
              <p className="lead">{event.description}</p>
            </div>
          </div>

          {/* Map Section */}
          {hasLocationData && (
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Location</h4>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? (
                    <>
                      <i className="bi bi-eye-slash me-1"></i>
                      Hide Map
                    </>
                  ) : (
                    <>
                      <i className="bi bi-eye me-1"></i>
                      Show Map
                    </>
                  )}
                </button>
              </div>

              {showMap && <Map events={[event]} userLocation={null} />}
            </div>
          )}

          {/* Share Buttons */}
          <div className="mb-4">
            <ShareButtons
              eventTitle={event.title}
              eventUrl={window.location.href}
            />
          </div>

          {/* Related Events */}
          <RelatedEvents
            currentEventId={id}
            category={event.category}
            venue={event.venue}
          />
        </div>

        <div className="col-lg-4">
          {/* Event Details Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Event Details</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <i className="bi bi-calendar me-2"></i>
                  <strong>Date:</strong> {formatDate(event.date)}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-clock me-2"></i>
                  <strong>Time:</strong> {formatTime(event.time)}
                </li>
                <li className="list-group-item">
                  <i className="bi bi-geo-alt me-2"></i>
                  <strong>Venue:</strong> {event.venue}
                </li>
                {event.category && (
                  <li className="list-group-item">
                    <i className="bi bi-tag me-2"></i>
                    <strong>Category:</strong> {event.category}
                  </li>
                )}
                {event.organizerId && (
                  <li className="list-group-item">
                    <i className="bi bi-building me-2"></i>
                    <strong>Organizer:</strong>{" "}
                    {event.organizerName || "Event Organizer"}
                  </li>
                )}
              </ul>
              <div className="d-grid gap-2 mt-3">
                <a
                  href={event.registrationLink}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-box-arrow-up-right me-2"></i>
                  Register Now
                </a>
                <div className="d-flex gap-2 mt-2">
                  <SaveEventButton eventId={id} eventData={event} />
                  <Link
                    to="/events"
                    className="btn btn-outline-secondary flex-grow-1"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Events
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Reminder Form */}
          <ReminderForm
            eventId={id}
            eventTitle={event.title}
            eventDate={event.date}
            eventTime={event.time}
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { formatDate } from "../utils/dateUtils";
import CategoryBadge from "./CategoryBadge";

const RelatedEvents = ({ currentEventId, category, venue }) => {
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      try {
        setLoading(true);
        const eventsRef = collection(db, "events");
        let relatedQuery;
        
        // First try to find events with the same category
        if (category) {
          relatedQuery = query(
            eventsRef,
            where("category", "==", category),
            where("id", "!=", currentEventId),
            limit(3)
          );
          
          const categorySnapshot = await getDocs(relatedQuery);
          if (!categorySnapshot.empty) {
            const events = categorySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setRelatedEvents(events);
            setLoading(false);
            return;
          }
        }
        
        // If no category matches or no category provided, try venue
        if (venue) {
          relatedQuery = query(
            eventsRef,
            where("venue", "==", venue),
            where("id", "!=", currentEventId),
            limit(3)
          );
          
          const venueSnapshot = await getDocs(relatedQuery);
          if (!venueSnapshot.empty) {
            const events = venueSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setRelatedEvents(events);
            setLoading(false);
            return;
          }
        }
        
        // If still no results, just get the latest events
        relatedQuery = query(
          eventsRef,
          where("id", "!=", currentEventId),
          limit(3)
        );
        
        const snapshot = await getDocs(relatedQuery);
        const events = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRelatedEvents(events);
      } catch (error) {
        console.error("Error fetching related events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentEventId) {
      fetchRelatedEvents();
    }
  }, [currentEventId, category, venue]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (relatedEvents.length === 0) {
    return null;
  }

  return (
    <div className="related-events mt-5">
      <h4 className="mb-4">You Might Also Like</h4>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {relatedEvents.map(event => (
          <div key={event.id} className="col">
            <div className="card h-100 shadow-sm hover-card">
              <div className="position-relative">
                <img
                  src={event.image || `https://source.unsplash.com/random/800x600/?${event.category?.toLowerCase() || 'event'}`}
                  className="card-img-top"
                  alt={event.title}
                  style={{ height: "140px", objectFit: "cover" }}
                />
                <div className="position-absolute top-0 start-0 m-2">
                  {event.category && <CategoryBadge category={event.category} />}
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title text-truncate">{event.title}</h5>
                <p className="card-text mb-1 small text-muted">
                  <i className="bi bi-calendar me-2"></i>
                  {formatDate(event.date)}
                </p>
                <p className="card-text mb-2 small text-muted">
                  <i className="bi bi-geo-alt me-2"></i>
                  {event.venue}
                </p>
                <Link to={`/events/${event.id}`} className="btn btn-sm btn-outline-primary mt-2">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedEvents;

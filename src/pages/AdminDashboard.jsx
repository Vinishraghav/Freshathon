import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { getEventsByOrganizer } from "../services/FirebaseServices";
import { deleteEvent } from "../services/api";
import { formatDate } from "../utils/dateUtils";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;

        if (!user) {
          setError("You must be logged in to view your events");
          setLoading(false);
          return;
        }

        const userEvents = await getEventsByOrganizer(user.uid);
        setEvents(userEvents);
      } catch (err) {
        console.error("Error fetching organizer events:", err);
        setError("Failed to load your events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteEvent(eventId);
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Organizer Dashboard</h1>
        <Link to="/admin/events/create" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Create New Event
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {events.length === 0 ? (
        <div className="text-center my-5">
          <h3>You haven't created any events yet</h3>
          <p className="lead">
            Get started by creating your first event using the button above.
          </p>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title mb-4">Your Events</h2>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <Link
                          to={`/events/${event.id}`}
                          className="text-decoration-none"
                        >
                          {event.title}
                        </Link>
                      </td>
                      <td>{formatDate(event.date)}</td>
                      <td>{event.venue}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link
                            to={`/admin/events/edit/${event.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={deleteLoading}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

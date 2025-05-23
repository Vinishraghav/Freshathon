import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import EventForm from "../components/EventForm";
import LoadingSpinner from "../components/LoadingSpinner";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventDoc = await getDoc(doc(db, "events", id));
        
        if (!eventDoc.exists()) {
          setError("Event not found");
          setLoading(false);
          return;
        }
        
        const eventData = { id: eventDoc.id, ...eventDoc.data() };
        
        // Check if the current user is the organizer of this event
        const user = auth.currentUser;
        if (!user || eventData.organizerId !== user.uid) {
          setError("You don't have permission to edit this event");
          setLoading(false);
          return;
        }
        
        setEvent(eventData);
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

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger">{error}</h2>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mb-4">Edit Event</h1>
      <EventForm initialData={event} isEditing={true} />
    </div>
  );
};

export default EditEvent;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc 
} from "firebase/firestore";

const SaveEventButton = ({ eventId, eventData }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        
        if (!user) {
          setIsSaved(false);
          setLoading(false);
          return;
        }
        
        const savedEventsRef = collection(db, "savedEvents");
        const q = query(
          savedEventsRef, 
          where("userId", "==", user.uid),
          where("eventId", "==", eventId)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setIsSaved(true);
          setSavedId(querySnapshot.docs[0].id);
        } else {
          setIsSaved(false);
          setSavedId(null);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkIfSaved();
  }, [eventId]);
  
  const handleSaveToggle = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      // Redirect to login if not logged in
      navigate("/student-login");
      return;
    }
    
    try {
      setProcessing(true);
      
      if (isSaved && savedId) {
        // Unsave the event
        await deleteDoc(doc(db, "savedEvents", savedId));
        setIsSaved(false);
        setSavedId(null);
      } else {
        // Save the event
        const savedEventRef = await addDoc(collection(db, "savedEvents"), {
          userId: user.uid,
          eventId: eventId,
          savedAt: new Date().toISOString(),
          // Store minimal event data for quick access
          eventTitle: eventData?.title || "",
          eventDate: eventData?.date || "",
          eventVenue: eventData?.venue || ""
        });
        
        setIsSaved(true);
        setSavedId(savedEventRef.id);
      }
    } catch (error) {
      console.error("Error toggling saved status:", error);
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <button className="btn btn-outline-secondary" disabled>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </button>
    );
  }
  
  return (
    <button
      className={`btn ${isSaved ? "btn-danger" : "btn-outline-danger"}`}
      onClick={handleSaveToggle}
      disabled={processing}
      aria-label={isSaved ? "Unsave event" : "Save event"}
      title={isSaved ? "Unsave event" : "Save event"}
    >
      {processing ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      ) : (
        <i className={`bi ${isSaved ? "bi-heart-fill" : "bi-heart"}`}></i>
      )}
      <span className="ms-1 d-none d-md-inline">
        {isSaved ? "Saved" : "Save"}
      </span>
    </button>
  );
};

export default SaveEventButton;

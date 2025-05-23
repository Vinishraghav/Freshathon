import { useState } from "react";
import { auth } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ReminderForm = ({ eventId, eventTitle, eventDate, eventTime }) => {
  const [email, setEmail] = useState("");
  const [reminderTime, setReminderTime] = useState("1hour");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Get current user's email if logged in
  useState(() => {
    if (auth.currentUser) {
      setEmail(auth.currentUser.email || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // Calculate reminder date based on event date and selected reminder time
      const eventDateTime = new Date(`${eventDate}T${eventTime}`);
      let reminderDateTime = new Date(eventDateTime);
      
      switch (reminderTime) {
        case "1hour":
          reminderDateTime.setHours(reminderDateTime.getHours() - 1);
          break;
        case "3hours":
          reminderDateTime.setHours(reminderDateTime.getHours() - 3);
          break;
        case "1day":
          reminderDateTime.setDate(reminderDateTime.getDate() - 1);
          break;
        case "2days":
          reminderDateTime.setDate(reminderDateTime.getDate() - 2);
          break;
        case "1week":
          reminderDateTime.setDate(reminderDateTime.getDate() - 7);
          break;
        default:
          reminderDateTime.setHours(reminderDateTime.getHours() - 1);
      }
      
      // Save reminder to Firestore
      await addDoc(collection(db, "reminders"), {
        eventId,
        eventTitle,
        eventDate,
        eventTime,
        email,
        reminderTime,
        reminderDateTime: reminderDateTime.toISOString(),
        createdAt: new Date().toISOString(),
        userId: auth.currentUser?.uid || null,
        sent: false
      });
      
      setSuccess(true);
      setEmail("");
      setReminderTime("1hour");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Error setting reminder:", err);
      setError("Failed to set reminder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">
          <i className="bi bi-bell me-2"></i>
          Set Email Reminder
        </h5>
        
        {success && (
          <div className="alert alert-success" role="alert">
            <i className="bi bi-check-circle me-2"></i>
            Reminder set successfully! We'll email you before the event.
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="reminderTime" className="form-label">Remind Me</label>
            <select
              className="form-select"
              id="reminderTime"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            >
              <option value="1hour">1 hour before</option>
              <option value="3hours">3 hours before</option>
              <option value="1day">1 day before</option>
              <option value="2days">2 days before</option>
              <option value="1week">1 week before</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Setting Reminder...
              </>
            ) : (
              <>
                <i className="bi bi-bell-fill me-2"></i>
                Set Reminder
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;

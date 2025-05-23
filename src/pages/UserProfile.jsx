import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import LoadingSpinner from "../components/LoadingSpinner";
import EventList from "../components/EventList";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form states
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/student-login");
        return;
      }
      
      setUser(currentUser);
      setDisplayName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      
      fetchUserProfile(currentUser.uid);
      fetchSavedEvents(currentUser.uid);
      fetchReminders(currentUser.email);
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      
      // Check if user profile exists in Firestore
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        // Create a basic profile if none exists
        setUserProfile({
          uid: userId,
          displayName: auth.currentUser.displayName || "",
          email: auth.currentUser.email || "",
          role: "student"
        });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSavedEvents = async (userId) => {
    try {
      // Get saved events from Firestore
      const savedEventsRef = collection(db, "savedEvents");
      const q = query(savedEventsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      // Get the actual event data for each saved event
      const eventPromises = querySnapshot.docs.map(async (doc) => {
        const eventId = doc.data().eventId;
        const eventDoc = await getDoc(doc(db, "events", eventId));
        
        if (eventDoc.exists()) {
          return { id: eventDoc.id, ...eventDoc.data(), savedId: doc.id };
        }
        return null;
      });
      
      const events = await Promise.all(eventPromises);
      setSavedEvents(events.filter(event => event !== null));
    } catch (err) {
      console.error("Error fetching saved events:", err);
    }
  };
  
  const fetchReminders = async (userEmail) => {
    try {
      // Get reminders from Firestore
      const remindersRef = collection(db, "reminders");
      const q = query(remindersRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);
      
      const remindersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setReminders(remindersList);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);
      
      // Update display name if changed
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Update email if changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      
      // Update password if provided
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError("Passwords do not match");
          setUpdating(false);
          return;
        }
        
        await updatePassword(user, newPassword);
      }
      
      // Update profile in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
        email,
        updatedAt: new Date().toISOString()
      });
      
      setSuccess("Profile updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      
      // Refresh user data
      setUser(auth.currentUser);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Your Profile</h1>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="bi bi-person me-2"></i>
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            <i className="bi bi-bookmark me-2"></i>
            Saved Events
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "reminders" ? "active" : ""}`}
            onClick={() => setActiveTab("reminders")}
          >
            <i className="bi bi-bell me-2"></i>
            Reminders
          </button>
        </li>
      </ul>
      
      {activeTab === "profile" && (
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Edit Profile</h5>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3">
                    <label htmlFor="displayName" className="form-label">Display Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="text-center mb-3">
                  <div className="avatar-placeholder mb-3">
                    <i className="bi bi-person-circle display-1"></i>
                  </div>
                  <h5>{user.displayName || "User"}</h5>
                  <p className="text-muted">{user.email}</p>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Account Type:</span>
                  <span className="badge bg-primary">Student</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Saved Events:</span>
                  <span className="badge bg-secondary">{savedEvents.length}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Active Reminders:</span>
                  <span className="badge bg-secondary">{reminders.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "saved" && (
        <div>
          <EventList 
            events={savedEvents} 
            loading={false} 
            title="Your Saved Events" 
            emptyMessage="You haven't saved any events yet. Browse events and save them to see them here!"
          />
        </div>
      )}
      
      {activeTab === "reminders" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-4">Your Reminders</h5>
            
            {reminders.length === 0 ? (
              <p className="text-center">You don't have any reminders set up yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Event Date</th>
                      <th>Reminder Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reminders.map((reminder) => (
                      <tr key={reminder.id}>
                        <td>{reminder.eventTitle}</td>
                        <td>{reminder.eventDate} {reminder.eventTime}</td>
                        <td>{reminder.reminderTime.replace(/([A-Z])/g, ' $1').toLowerCase()}</td>
                        <td>
                          {reminder.sent ? (
                            <span className="badge bg-success">Sent</span>
                          ) : (
                            <span className="badge bg-warning">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

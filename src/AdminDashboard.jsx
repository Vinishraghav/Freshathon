import { useState } from "react";

const AdminDashboard = ({ onLogout, addEvent }) => {
  const [event, setEvent] = useState({
    title: "",
    date: "",
    location: "",
    image: "",
    link: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent(event);
    setEvent({ title: "", date: "", location: "", image: "", link: "" });
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <button className="btn btn-danger" onClick={onLogout}>
        Logout
      </button>
      <h3 className="mt-3">Add Event</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
          required
        />
        <input
          type="date"
          className="form-control mt-2"
          value={event.date}
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
          required
        />
        <input
          type="text"
          className="form-control mt-2"
          placeholder="Location"
          value={event.location}
          onChange={(e) => setEvent({ ...event, location: e.target.value })}
          required
        />
        <input
          type="url"
          className="form-control mt-2"
          placeholder="Image URL"
          value={event.image}
          onChange={(e) => setEvent({ ...event, image: e.target.value })}
          required
        />
        <input
          type="url"
          className="form-control mt-2"
          placeholder="Event Link"
          value={event.link}
          onChange={(e) => setEvent({ ...event, link: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-success mt-3">
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;

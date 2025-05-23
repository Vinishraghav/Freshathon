import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEvents } from "../services/api";
import EventCard from "../components/EventCard";

const Home = () => {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        const allEvents = await getEvents();
        // Get 3 random events to feature
        const randomEvents = allEvents
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setFeaturedEvents(randomEvents);
      } catch (error) {
        console.error("Error fetching featured events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="row align-items-center py-5">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-3">
            Discover Amazing Events Near You
          </h1>
          <p className="lead mb-4">
            Eventsphere is your one-stop platform for discovering and attending
            the best college events across India. Find tech conferences,
            cultural festivals, workshops, and more!
          </p>
          <div className="d-grid gap-2 d-md-flex">
            <button
              className="btn btn-primary btn-lg px-4"
              onClick={() => navigate("/events")}
            >
              Explore Events
            </button>
            <button
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={() => navigate("/college-login")}
            >
              Organizer Login
            </button>
          </div>
        </div>
        <div className="col-lg-6 mt-5 mt-lg-0">
          <img
            src="https://source.unsplash.com/random/800x600/?event"
            alt="Events"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="py-5">
        <h2 className="text-center mb-4">Featured Events</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {loading ? (
            <div className="col-12 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            featuredEvents.map((event) => (
              <div key={event.id} className="col">
                <EventCard {...event} />
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-4">
          <Link to="/events" className="btn btn-outline-primary">
            View All Events
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-5 bg-light rounded">
        <h2 className="text-center mb-4">How It Works</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 text-primary mb-3">
                  <i className="bi bi-search"></i>
                </div>
                <h3>Discover</h3>
                <p>
                  Browse through a wide range of events happening across India
                  or find events near your location.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 text-primary mb-3">
                  <i className="bi bi-calendar-event"></i>
                </div>
                <h3>Attend</h3>
                <p>
                  Register for events through external registration links
                  provided by the organizers.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="display-4 text-primary mb-3">
                  <i className="bi bi-megaphone"></i>
                </div>
                <h3>Organize</h3>
                <p>
                  College officials can create and manage their events through
                  our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-5 text-center">
        <h2>Ready to get started?</h2>
        <p className="lead">
          Join thousands of students discovering amazing events every day.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
          <button
            className="btn btn-primary btn-lg px-4"
            onClick={() => navigate("/student-login")}
          >
            Student Login
          </button>
          <button
            className="btn btn-success btn-lg px-4"
            onClick={() => navigate("/college-login")}
          >
            Organizer Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

import EventCard from "./EventCard";
import LoadingSpinner from "./LoadingSpinner";

const EventList = ({
  events,
  loading,
  title = "Upcoming Events",
  emptyMessage = "No events found",
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center my-5">
        <h3>{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="mb-4">{title}</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {events.map((event) => (
          <div key={event.id} className="col">
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;

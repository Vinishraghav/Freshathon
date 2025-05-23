import { useParams } from "react-router-dom";
import EventDetailsComponent from "../components/EventDetails";

const EventDetails = () => {
  const { id } = useParams();
  
  return <EventDetailsComponent />;
};

export default EventDetails;

import { Link } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";
import CategoryBadge from "./CategoryBadge";
import { useState } from "react";

const EventCard = ({
  id,
  title,
  date,
  time,
  venue,
  image,
  registrationLink,
  distance,
  category,
  description,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card h-100 shadow-sm hover-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="position-relative">
        <img
          src={
            image ||
            `https://source.unsplash.com/random/800x600/?${
              category?.toLowerCase() || "event"
            }`
          }
          className="card-img-top"
          alt={title}
          style={{
            height: "180px",
            objectFit: "cover",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        <div className="position-absolute top-0 start-0 m-2">
          {category && <CategoryBadge category={category} />}
        </div>
        {distance && (
          <span className="position-absolute top-0 end-0 badge bg-info m-2">
            {distance} km away
          </span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{title}</h5>
        <p className="card-text mb-1 text-muted">
          <i className="bi bi-calendar me-2"></i>
          {formatDate(date)}
        </p>
        <p className="card-text mb-1 text-muted">
          <i className="bi bi-clock me-2"></i>
          {time}
        </p>
        <p className="card-text mb-2 text-muted">
          <i className="bi bi-geo-alt me-2"></i>
          {venue}
        </p>

        {description && (
          <p
            className="card-text small mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </p>
        )}

        <div className="mt-auto d-flex justify-content-between">
          <Link to={`/events/${id}`} className="btn btn-outline-primary">
            <i className="bi bi-info-circle me-1"></i>
            Details
          </Link>
          <a
            href={registrationLink}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-box-arrow-up-right me-1"></i>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

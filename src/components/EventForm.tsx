import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { uploadEventImage } from "../services/FirebaseServices";
import { createEvent, updateEvent } from "../services/api";

interface EventFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData = {},
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData.image || null
  );

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    date: initialData.date || "",
    time: initialData.time || "",
    venue: initialData.venue || "",
    description: initialData.description || "",
    category: initialData.category || "",
    registrationLink: initialData.registrationLink || "",
    latitude: initialData.latitude || "",
    longitude: initialData.longitude || "",
  });

  useEffect(() => {
    // Update form data if initialData changes (e.g., when editing)
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        date: initialData.date || "",
        time: initialData.time || "",
        venue: initialData.venue || "",
        description: initialData.description || "",
        category: initialData.category || "",
        registrationLink: initialData.registrationLink || "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
      });

      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // Validate required fields
      const requiredFields = [
        "title",
        "date",
        "time",
        "venue",
        "description",
        "registrationLink",
      ];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          setError(
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          );
          setLoading(false);
          return;
        }
      }

      // Get current user
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to create an event");
        setLoading(false);
        return;
      }

      let imageUrl = initialData.image || "";

      // Upload image if a new one was selected
      if (imageFile) {
        const eventId = initialData.id || `temp-${Date.now()}`;
        imageUrl = await uploadEventImage(imageFile, eventId);
      }

      // Prepare event data
      const eventData = {
        ...formData,
        image: imageUrl,
        organizerId: user.uid,
        // Convert latitude and longitude to numbers if provided
        ...(formData.latitude && { latitude: parseFloat(formData.latitude) }),
        ...(formData.longitude && {
          longitude: parseFloat(formData.longitude),
        }),
      };

      if (isEditing && initialData.id) {
        // Update existing event
        await updateEvent(initialData.id, eventData);
        navigate(`/events/${initialData.id}`);
      } else {
        // Create new event
        const response = await createEvent(eventData);
        navigate(`/events/${response.id}`);
      }
    } catch (err: any) {
      console.error("Error saving event:", err);
      setError(err.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title mb-4">
          {isEditing ? "Edit Event" : "Create New Event"}
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Event Title*
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="date" className="form-label">
                Date*
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="time" className="form-label">
                Time*
              </label>
              <input
                type="time"
                className="form-control"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="venue" className="form-label">
              Venue*
            </label>
            <input
              type="text"
              className="form-control"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="latitude" className="form-label">
                Latitude (for map)
              </label>
              <input
                type="number"
                step="any"
                className="form-control"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g., 12.9716"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="longitude" className="form-label">
                Longitude (for map)
              </label>
              <input
                type="number"
                step="any"
                className="form-control"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g., 77.5946"
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Arts">Arts</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Food">Food</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description*
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="registrationLink" className="form-label">
              Registration Link*
            </label>
            <input
              type="url"
              className="form-control"
              id="registrationLink"
              name="registrationLink"
              value={formData.registrationLink}
              onChange={handleChange}
              placeholder="https://example.com/register"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="form-label">
              Event Image
            </label>
            <input
              type="file"
              className="form-control"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="img-thumbnail"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              type="button"
              className="btn btn-outline-secondary me-md-2"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Saving...
                </>
              ) : isEditing ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;

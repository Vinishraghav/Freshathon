import axios from "axios";
import { auth } from "../firebaseConfig";
import { API_CONFIG } from "../config/environment";

const API_URL = API_CONFIG.BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Event API calls
export const getEvents = async () => {
  try {
    const response = await api.get("/events");
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return empty array instead of throwing error to prevent app from crashing
    return [];
  }
};

export const getNearbyEvents = async (latitude, longitude) => {
  try {
    const response = await api.get(
      `/events/nearby?lat=${latitude}&lon=${longitude}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby events:", error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post("/events", eventData);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export default api;

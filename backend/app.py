from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime
import math

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Firebase Admin SDK
try:
    # Use service account key file for Firebase Admin SDK
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase Admin SDK initialized successfully")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    # Continue without Firebase Admin SDK for now
    db = None

# Helper function to calculate distance between two coordinates using Haversine formula
def calculate_distance(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    # Radius of Earth in kilometers
    radius = 6371
    
    # Calculate the distance
    distance = radius * c
    return distance

# Routes
@app.route('/')
def home():
    return jsonify({"message": "Eventsphere API is running"})

# Get all events
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        if db:
            # Get events from Firestore
            events_ref = db.collection('events')
            events = []
            for doc in events_ref.stream():
                event_data = doc.to_dict()
                event_data['id'] = doc.id
                events.append(event_data)
            return jsonify(events)
        else:
            # Return sample data if Firebase is not initialized
            with open('sample_events.json', 'r') as f:
                events = json.load(f)
            return jsonify(events)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get nearby events (within 100km)
@app.route('/api/events/nearby', methods=['GET'])
def get_nearby_events():
    try:
        # Get user's location from query parameters
        user_lat = float(request.args.get('lat', 0))
        user_lon = float(request.args.get('lon', 0))
        
        if db:
            # Get events from Firestore
            events_ref = db.collection('events')
            all_events = []
            for doc in events_ref.stream():
                event_data = doc.to_dict()
                event_data['id'] = doc.id
                all_events.append(event_data)
        else:
            # Use sample data if Firebase is not initialized
            with open('sample_events.json', 'r') as f:
                all_events = json.load(f)
        
        # Filter events within 100km
        nearby_events = []
        for event in all_events:
            if 'latitude' in event and 'longitude' in event:
                event_lat = float(event['latitude'])
                event_lon = float(event['longitude'])
                distance = calculate_distance(user_lat, user_lon, event_lat, event_lon)
                if distance <= 100:  # 100km radius
                    event['distance'] = round(distance, 2)
                    nearby_events.append(event)
        
        return jsonify(nearby_events)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create a new event
@app.route('/api/events', methods=['POST'])
def create_event():
    try:
        # Get the event data from the request
        event_data = request.json
        
        # Validate required fields
        required_fields = ['title', 'date', 'time', 'venue', 'description', 'registrationLink', 'organizerId']
        for field in required_fields:
            if field not in event_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Add timestamp
        event_data['createdAt'] = datetime.now().isoformat()
        
        if db:
            # Add event to Firestore
            events_ref = db.collection('events')
            new_event = events_ref.add(event_data)
            return jsonify({"id": new_event[1].id, "message": "Event created successfully"}), 201
        else:
            # Return success message without actually saving
            return jsonify({"id": "sample-id", "message": "Event created successfully (sample mode)"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update an event
@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        # Get the updated event data
        event_data = request.json
        
        if db:
            # Update event in Firestore
            event_ref = db.collection('events').document(event_id)
            event_ref.update(event_data)
            return jsonify({"message": "Event updated successfully"})
        else:
            # Return success message without actually updating
            return jsonify({"message": "Event updated successfully (sample mode)"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete an event
@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        if db:
            # Delete event from Firestore
            event_ref = db.collection('events').document(event_id)
            event_ref.delete()
            return jsonify({"message": "Event deleted successfully"})
        else:
            # Return success message without actually deleting
            return jsonify({"message": "Event deleted successfully (sample mode)"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Create sample_events.json if it doesn't exist
    if not os.path.exists('sample_events.json'):
        sample_events = [
            {
                "id": "1",
                "title": "Tech Conference 2025",
                "date": "2025-04-10",
                "time": "09:00",
                "venue": "Chennai Convention Center",
                "description": "Annual technology conference featuring the latest innovations.",
                "category": "Technology",
                "image": "https://source.unsplash.com/random/800x600/?tech",
                "registrationLink": "https://example.com/register",
                "organizerId": "org1",
                "latitude": 13.0827,
                "longitude": 80.2707
            },
            {
                "id": "2",
                "title": "Startup Meetup",
                "date": "2025-04-15",
                "time": "18:00",
                "venue": "Bangalore Tech Park",
                "description": "Networking event for startups and investors.",
                "category": "Business",
                "image": "https://source.unsplash.com/random/800x600/?startup",
                "registrationLink": "https://example.com/register",
                "organizerId": "org2",
                "latitude": 12.9716,
                "longitude": 77.5946
            },
            {
                "id": "3",
                "title": "Music Festival",
                "date": "2025-05-05",
                "time": "16:00",
                "venue": "Mumbai Beach",
                "description": "Annual music festival featuring top artists.",
                "category": "Music",
                "image": "https://source.unsplash.com/random/800x600/?music",
                "registrationLink": "https://example.com/register",
                "organizerId": "org3",
                "latitude": 19.0760,
                "longitude": 72.8777
            }
        ]
        with open('sample_events.json', 'w') as f:
            json.dump(sample_events, f)
    
    # Run the Flask app
    app.run(debug=True, port=5000)

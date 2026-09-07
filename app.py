from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import json
from datetime import datetime, timedelta
# Uncomment when you have your Firebase credentials
# from firebase_auth import create_user, verify_id_token

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Set a secret key for session management

# Sample events data (in a real app, this would come from a database)
events = [
    {
        "id": 1,
        "title": "Tech Innovation Summit",
        "date": "Jun 15, 2025",
        "time": "10:00 AM - 4:00 PM",
        "venue": "Tech Hub, Bangalore",
        "image": "https://source.unsplash.com/random/300x200/?tech",
        "category": "Technology",
        "description": "Join us for a day of innovation, networking, and learning about the latest tech trends.",
        "price": 1500,
        "rating": 4.8,
        "attendees": 120,
        "organizer": "TechMinds Association",
        "featured": True,
        "latitude": 12.9716,
        "longitude": 77.5946
    },
    {
        "id": 2,
        "title": "Campus Music Festival",
        "date": "Jun 20, 2025",
        "time": "5:00 PM - 10:00 PM",
        "venue": "Central Auditorium, Delhi",
        "image": "https://source.unsplash.com/random/300x200/?music",
        "category": "Arts",
        "description": "Experience amazing performances from top artists and emerging talents on campus.",
        "price": 500,
        "rating": 4.5,
        "attendees": 350,
        "organizer": "College Music Club",
        "featured": False,
        "latitude": 28.7041,
        "longitude": 77.1025
    },
    {
        "id": 3,
        "title": "Design Thinking Workshop",
        "date": "Jun 25, 2025",
        "time": "9:00 AM - 1:00 PM",
        "venue": "Innovation Center, Mumbai",
        "image": "https://source.unsplash.com/random/300x200/?workshop",
        "category": "Education",
        "description": "Learn the principles of design thinking and how to apply them to solve real-world problems.",
        "price": 0,
        "rating": 4.7,
        "attendees": 45,
        "organizer": "Design Academy",
        "featured": False,
        "latitude": 19.0760,
        "longitude": 72.8777
    }
]

# Routes
@app.route('/')
def index():
    return render_template('index.html', events=events)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Here you would implement Firebase authentication
        # For now, we'll just simulate a successful login
        session['user'] = {'email': request.form.get('email')}
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Here you would implement Firebase user creation
        # For now, we'll just simulate a successful registration
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    # Check if user is logged in
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html')

@app.route('/events/<int:event_id>')
def event_details(event_id):
    # Find the event with the given ID
    event = next((e for e in events if e["id"] == event_id), None)
    if event is None:
        return redirect(url_for('index'))
    return render_template('event_details.html', event=event)

@app.route('/events/<int:event_id>/book')
def book_event(event_id):
    # Find the event with the given ID
    event = next((e for e in events if e["id"] == event_id), None)
    if event is None:
        return redirect(url_for('index'))
    return render_template('booking.html', event=event)

@app.route('/profile')
def profile():
    # Check if user is logged in
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('profile.html')

@app.route('/search')
def search():
    # Get search parameters
    query = request.args.get('q', '')
    category = request.args.get('category', '')
    max_price = request.args.get('max_price', 5000)
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    location = request.args.get('location', '')
    free_only = request.args.get('free_only', '')
    sort = request.args.get('sort', '')

    # Convert max_price to integer
    try:
        max_price = int(max_price)
    except ValueError:
        max_price = 5000

    # Filter events based on search parameters
    filtered_events = events.copy()

    # Filter by query (search in title, description, and venue)
    if query:
        filtered_events = [
            event for event in filtered_events
            if query.lower() in event['title'].lower()
            or query.lower() in event['description'].lower()
            or query.lower() in event['venue'].lower()
            or query.lower() in event['category'].lower()
        ]

    # Filter by category
    if category:
        filtered_events = [event for event in filtered_events if event['category'] == category]

    # Filter by price
    if free_only:
        filtered_events = [event for event in filtered_events if event['price'] == 0]
    else:
        filtered_events = [event for event in filtered_events if event['price'] <= max_price]

    # Filter by location
    if location:
        filtered_events = [event for event in filtered_events if location in event['venue']]

    # Sort events
    if sort == 'date_asc':
        # This is a simplified sort - in a real app, you'd parse the date properly
        filtered_events.sort(key=lambda x: x['date'])
    elif sort == 'date_desc':
        filtered_events.sort(key=lambda x: x['date'], reverse=True)
    elif sort == 'price_asc':
        filtered_events.sort(key=lambda x: x['price'])
    elif sort == 'price_desc':
        filtered_events.sort(key=lambda x: x['price'], reverse=True)
    elif sort == 'rating':
        filtered_events.sort(key=lambda x: x['rating'], reverse=True)

    return render_template('search.html', events=filtered_events)

@app.route('/create-event', methods=['GET', 'POST'])
def create_event():
    # Check if user is logged in
    if 'user' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        # In a real app, you would save the event to the database
        # For now, just redirect to the home page
        return redirect(url_for('index'))

    return render_template('create_event.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)

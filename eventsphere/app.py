import os
import json
import datetime
import uuid
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import firebase_admin
from firebase_admin import credentials, auth, firestore
from flask_socketio import SocketIO, emit, join_room, leave_room
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get('SECRET_KEY', 'eventsphere-secret-key')
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize Firebase
try:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase initialized successfully")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    # For development, we'll use a sample JSON file for events
    firebase_admin.initialize_app()

# Sample events data for development
def load_sample_events():
    try:
        with open('sample_events.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Authentication middleware
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'organizer':
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/student-login', methods=['GET', 'POST'])
def student_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        try:
            # Sign in with Firebase Authentication
            user = auth.get_user_by_email(email)

            # Check if user is a student
            user_doc = db.collection('users').document(user.uid).get()
            if user_doc.exists and user_doc.to_dict().get('role') == 'student':
                session['user_id'] = user.uid
                session['email'] = email
                session['role'] = 'student'
                return redirect(url_for('events'))
            else:
                flash('Invalid credentials or you do not have student access', 'error')
        except Exception as e:
            flash(f'Login failed: {str(e)}', 'error')

    return render_template('student_login.html')

@app.route('/college-login', methods=['GET', 'POST'])
def college_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        try:
            # Sign in with Firebase Authentication
            user = auth.get_user_by_email(email)

            # Check if user is an organizer
            user_doc = db.collection('users').document(user.uid).get()
            if user_doc.exists and user_doc.to_dict().get('role') == 'organizer':
                session['user_id'] = user.uid
                session['email'] = email
                session['role'] = 'organizer'
                return redirect(url_for('admin_dashboard'))
            else:
                flash('Invalid credentials or you do not have organizer access', 'error')
        except Exception as e:
            flash(f'Login failed: {str(e)}', 'error')

    return render_template('college_login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/events')
def events():
    return render_template('events.html')

@app.route('/events/<event_id>')
def event_details(event_id):
    return render_template('event_details.html', event_id=event_id)

@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    return render_template('admin_dashboard.html')

@app.route('/admin/enhanced-dashboard')
@admin_required
def enhanced_dashboard():
    return render_template('enhanced_dashboard.html')

@app.route('/admin/live-events')
@admin_required
def live_events():
    return render_template('live_events.html')

@app.route('/admin/events/create', methods=['GET', 'POST'])
@admin_required
def create_event():
    if request.method == 'POST':
        # Get form data
        title = request.form.get('title')
        date = request.form.get('date')
        time = request.form.get('time')
        venue = request.form.get('venue')
        description = request.form.get('description')
        registration_link = request.form.get('registration_link')
        category = request.form.get('category')
        image_url = request.form.get('image_url', '')

        # Validate required fields
        if not all([title, date, time, venue, description, registration_link]):
            flash('All fields are required', 'error')
            return render_template('create_event.html')

        # Create event document
        event_data = {
            'title': title,
            'date': date,
            'time': time,
            'venue': venue,
            'description': description,
            'registrationLink': registration_link,
            'category': category,
            'image': image_url,
            'organizerId': session.get('user_id'),
            'organizerName': session.get('email').split('@')[0],
            'createdAt': datetime.datetime.now().isoformat()
        }

        try:
            # Add to Firestore
            db.collection('events').add(event_data)
            flash('Event created successfully', 'success')
            return redirect(url_for('admin_dashboard'))
        except Exception as e:
            flash(f'Error creating event: {str(e)}', 'error')

    return render_template('create_event.html')

@app.route('/admin/events/edit/<event_id>', methods=['GET', 'POST'])
@admin_required
def edit_event(event_id):
    if request.method == 'POST':
        # Get form data
        title = request.form.get('title')
        date = request.form.get('date')
        time = request.form.get('time')
        venue = request.form.get('venue')
        description = request.form.get('description')
        registration_link = request.form.get('registration_link')
        category = request.form.get('category')
        image_url = request.form.get('image_url', '')

        # Validate required fields
        if not all([title, date, time, venue, description, registration_link]):
            flash('All fields are required', 'error')
            return redirect(url_for('edit_event', event_id=event_id))

        # Update event document
        event_data = {
            'title': title,
            'date': date,
            'time': time,
            'venue': venue,
            'description': description,
            'registrationLink': registration_link,
            'category': category,
            'image': image_url,
            'updatedAt': datetime.datetime.now().isoformat()
        }

        try:
            # Update in Firestore
            db.collection('events').document(event_id).update(event_data)
            flash('Event updated successfully', 'success')
            return redirect(url_for('admin_dashboard'))
        except Exception as e:
            flash(f'Error updating event: {str(e)}', 'error')

    # Get event data for editing
    try:
        event = db.collection('events').document(event_id).get()
        if event.exists:
            event_data = event.to_dict()
            event_data['id'] = event_id
            return render_template('edit_event.html', event=event_data)
        else:
            flash('Event not found', 'error')
            return redirect(url_for('admin_dashboard'))
    except Exception as e:
        flash(f'Error retrieving event: {str(e)}', 'error')
        return redirect(url_for('admin_dashboard'))

@app.route('/admin/events/delete/<event_id>', methods=['POST'])
@admin_required
def delete_event(event_id):
    try:
        # Delete from Firestore
        db.collection('events').document(event_id).delete()
        flash('Event deleted successfully', 'success')
    except Exception as e:
        flash(f'Error deleting event: {str(e)}', 'error')

    return redirect(url_for('admin_dashboard'))

# API Routes
@app.route('/api/events', methods=['GET'])
def api_events():
    try:
        # Get events from Firestore
        events_ref = db.collection('events').order_by('date').limit(100)
        events = [{'id': doc.id, **doc.to_dict()} for doc in events_ref.stream()]
        return jsonify(events)
    except Exception as e:
        print(f"Error fetching events from Firestore: {e}")
        # Fallback to sample data
        return jsonify(load_sample_events())

@app.route('/api/events/nearby', methods=['GET'])
def api_nearby_events():
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))

        # In a real app, you would query Firestore with geolocation
        # For now, we'll return sample data
        events = load_sample_events()

        # Filter events within 100km (simplified calculation)
        nearby_events = []
        for event in events:
            if 'latitude' in event and 'longitude' in event:
                event_lat = float(event['latitude'])
                event_lon = float(event['longitude'])

                # Simple distance calculation (not accurate for large distances)
                distance = ((event_lat - lat) ** 2 + (event_lon - lon) ** 2) ** 0.5 * 111  # Approx km

                if distance <= 100:  # Within 100km
                    event['distance'] = round(distance, 1)
                    nearby_events.append(event)

        return jsonify(nearby_events)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# API Routes for Live Event Management
@app.route('/api/events/live/<event_id>', methods=['POST'])
@admin_required
def start_live_event(event_id):
    try:
        # Get event data
        event = db.collection('events').document(event_id).get()
        if not event.exists:
            return jsonify({'error': 'Event not found'}), 404

        event_data = event.to_dict()

        # Update event status to live
        db.collection('events').document(event_id).update({
            'status': 'live',
            'liveStartedAt': datetime.datetime.now().isoformat(),
            'updatedAt': datetime.datetime.now().isoformat()
        })

        # Emit socket event to notify clients
        socketio.emit('event_live', {
            'event_id': event_id,
            'title': event_data.get('title'),
            'organizer': event_data.get('organizerName')
        }, broadcast=True)

        return jsonify({'success': True, 'message': 'Event is now live'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/live/<event_id>/end', methods=['POST'])
@admin_required
def end_live_event(event_id):
    try:
        # Get event data
        event = db.collection('events').document(event_id).get()
        if not event.exists:
            return jsonify({'error': 'Event not found'}), 404

        event_data = event.to_dict()

        # Update event status to completed
        db.collection('events').document(event_id).update({
            'status': 'completed',
            'liveEndedAt': datetime.datetime.now().isoformat(),
            'updatedAt': datetime.datetime.now().isoformat()
        })

        # Emit socket event to notify clients
        socketio.emit('event_ended', {
            'event_id': event_id,
            'title': event_data.get('title'),
            'organizer': event_data.get('organizerName')
        }, broadcast=True)

        return jsonify({'success': True, 'message': 'Event has ended'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/live/<event_id>/announce', methods=['POST'])
@admin_required
def send_announcement(event_id):
    try:
        message = request.json.get('message')
        if not message:
            return jsonify({'error': 'Message is required'}), 400

        # Get event data
        event = db.collection('events').document(event_id).get()
        if not event.exists:
            return jsonify({'error': 'Event not found'}), 404

        event_data = event.to_dict()

        # Save announcement to database
        announcement_data = {
            'eventId': event_id,
            'message': message,
            'createdAt': datetime.datetime.now().isoformat(),
            'createdBy': session.get('user_id'),
            'createdByName': session.get('email').split('@')[0]
        }

        db.collection('announcements').add(announcement_data)

        # Emit socket event to notify clients
        socketio.emit('announcement', {
            'event_id': event_id,
            'message': message,
            'title': event_data.get('title'),
            'timestamp': datetime.datetime.now().isoformat()
        }, room=f'event_{event_id}')

        return jsonify({'success': True, 'message': 'Announcement sent'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/live/<event_id>/attendees', methods=['GET'])
@admin_required
def get_live_attendees(event_id):
    try:
        # Get event data
        event = db.collection('events').document(event_id).get()
        if not event.exists:
            return jsonify({'error': 'Event not found'}), 404

        # Get attendees who are currently online
        attendees_ref = db.collection('attendees').where('eventId', '==', event_id).where('isOnline', '==', True)
        attendees = [{'id': doc.id, **doc.to_dict()} for doc in attendees_ref.stream()]

        return jsonify(attendees)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/analytics', methods=['GET'])
@admin_required
def get_analytics():
    try:
        # Get organizer's events
        organizer_id = session.get('user_id')
        events_ref = db.collection('events').where('organizerId', '==', organizer_id)
        events = [{'id': doc.id, **doc.to_dict()} for doc in events_ref.stream()]

        # Calculate analytics
        total_events = len(events)
        total_attendees = 0
        live_events = 0
        completed_events = 0

        for event in events:
            # Count attendees
            attendees_ref = db.collection('attendees').where('eventId', '==', event['id'])
            attendee_count = len([doc for doc in attendees_ref.stream()])
            total_attendees += attendee_count

            # Count live and completed events
            if event.get('status') == 'live':
                live_events += 1
            elif event.get('status') == 'completed':
                completed_events += 1

        # Calculate engagement rate (simplified)
        engagement_rate = '0%'
        if total_attendees > 0:
            engagement_rate = f"{int((total_attendees / (total_events * 100)) * 100)}%"

        return jsonify({
            'totalEvents': total_events,
            'totalAttendees': total_attendees,
            'liveEvents': live_events,
            'completedEvents': completed_events,
            'engagementRate': engagement_rate
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Socket.IO event handlers
@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")

@socketio.on('join_event')
def handle_join_event(data):
    event_id = data.get('event_id')
    if not event_id:
        return

    room = f'event_{event_id}'
    join_room(room)
    print(f"Client {request.sid} joined room: {room}")

    # Update attendee status if authenticated
    if 'user_id' in session:
        try:
            # Find attendee record
            attendees_ref = db.collection('attendees').where('eventId', '==', event_id).where('userId', '==', session['user_id'])
            attendees = [doc for doc in attendees_ref.stream()]

            if attendees:
                # Update existing record
                attendee_id = attendees[0].id
                db.collection('attendees').document(attendee_id).update({
                    'isOnline': True,
                    'lastSeenAt': datetime.datetime.now().isoformat()
                })
            else:
                # Create new record
                attendee_data = {
                    'eventId': event_id,
                    'userId': session['user_id'],
                    'email': session.get('email'),
                    'isOnline': True,
                    'joinedAt': datetime.datetime.now().isoformat(),
                    'lastSeenAt': datetime.datetime.now().isoformat()
                }
                db.collection('attendees').add(attendee_data)

            # Emit to organizers
            socketio.emit('attendee_joined', {
                'event_id': event_id,
                'user_id': session['user_id'],
                'email': session.get('email'),
                'timestamp': datetime.datetime.now().isoformat()
            }, room=f'organizers_{event_id}')
        except Exception as e:
            print(f"Error updating attendee status: {e}")

@socketio.on('leave_event')
def handle_leave_event(data):
    event_id = data.get('event_id')
    if not event_id:
        return

    room = f'event_{event_id}'
    leave_room(room)
    print(f"Client {request.sid} left room: {room}")

    # Update attendee status if authenticated
    if 'user_id' in session:
        try:
            # Find attendee record
            attendees_ref = db.collection('attendees').where('eventId', '==', event_id).where('userId', '==', session['user_id'])
            attendees = [doc for doc in attendees_ref.stream()]

            if attendees:
                # Update existing record
                attendee_id = attendees[0].id
                db.collection('attendees').document(attendee_id).update({
                    'isOnline': False,
                    'lastSeenAt': datetime.datetime.now().isoformat()
                })

            # Emit to organizers
            socketio.emit('attendee_left', {
                'event_id': event_id,
                'user_id': session['user_id'],
                'email': session.get('email'),
                'timestamp': datetime.datetime.now().isoformat()
            }, room=f'organizers_{event_id}')
        except Exception as e:
            print(f"Error updating attendee status: {e}")

if __name__ == '__main__':
    socketio.run(app, debug=True)

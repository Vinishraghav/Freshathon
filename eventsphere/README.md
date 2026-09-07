# Eventsphere

Eventsphere is a full-stack web application for event discovery and management, primarily targeted at college students and event organizers in India.

## 🚀 Features

### For Students (General Users)
- View all events across India
- Explore nearby events within 100km radius
- Filter events by category
- View detailed event information
- Share events on social media

### For College/Venue Organizers
- Secure login system
- Dashboard to manage events
- Create, edit, and delete events
- Upload event images
- Track event visibility

## 🛠️ Tech Stack

### Frontend
- HTML, CSS, JavaScript
- Bootstrap 5 for responsive UI
- Firebase Authentication

### Backend
- Python (Flask framework)
- Firebase Firestore for data storage
- Firebase Storage for images

## 📋 Project Structure

```
eventsphere/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── serviceAccountKey.json # Firebase credentials
├── sample_events.json     # Sample event data
├── static/                # Static assets
│   ├── css/               # CSS stylesheets
│   ├── js/                # JavaScript files
│   └── img/               # Images
└── templates/             # HTML templates
    ├── base.html          # Base template
    ├── index.html         # Home page
    ├── events.html        # Events listing page
    ├── event_details.html # Event details page
    ├── student_login.html # Student login page
    ├── college_login.html # College login page
    ├── admin_dashboard.html # Admin dashboard
    ├── create_event.html  # Create event page
    └── edit_event.html    # Edit event page
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/eventsphere.git
cd eventsphere
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Set up Firebase
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Generate service account key and save as `serviceAccountKey.json`

4. Run the application
```bash
python app.py
```

5. Open your browser and navigate to `http://localhost:5000`

## 🌟 Key Features Explained

### Geolocation
The application uses the browser's geolocation API to find the user's current location and displays events within a 100km radius.

### Event Categories
Events are categorized to help users find relevant events quickly. Categories include Technology, Business, Education, Arts, Music, Sports, Food, and Health.

### Dark Mode
The application includes a dark mode toggle for better user experience in low-light environments.

### Responsive Design
The application is fully responsive and works well on mobile devices, tablets, and desktops.

## 👥 Contributors
- [Your Name](https://github.com/yourusername)
- [Team Member 1](https://github.com/teammember1)
- [Team Member 2](https://github.com/teammember2)
- [Team Member 3](https://github.com/teammember3)

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

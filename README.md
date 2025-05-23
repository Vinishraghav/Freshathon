# Eventsphere

Eventsphere is a full-stack web application for event discovery and management, primarily targeted at college students and event organizers in India.

## 🚀 Features

### For Students (General Users)

- View all events across India
- Explore nearby events within 100km radius
- Filter events by category, date, and location
- View detailed event information
- Save favorite events
- Set email reminders for events
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
├── backend/               # Flask backend
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── serviceAccountKey.json  # Firebase credentials
├── src/                   # Frontend source code
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API and Firebase services
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   ├── firebaseConfig.js  # Firebase configuration
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── .gitignore             # Git ignore file
├── package.json           # Node.js dependencies
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Firebase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/eventsphere.git
cd eventsphere
```

2. Install frontend dependencies

```bash
npm install
```

3. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

4. Set up Firebase

   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Generate service account key and save as `backend/serviceAccountKey.json`

5. Start the development servers

```bash
# Start both frontend and backend
npm start
```

## 🌟 Key Features Explained

### Geolocation

The application uses the browser's geolocation API to find the user's current location and displays events within a 100km radius.

### Event Categories

Events are categorized to help users find relevant events quickly. Categories include Technology, Business, Education, Arts, Music, Sports, Food, and Health.

### Date Filtering

Users can filter events by date range, including options for today, tomorrow, this week, this month, or a custom date range.

### Event Reminders

Users can set email reminders for events they're interested in, with options to be reminded 1 hour, 3 hours, 1 day, 2 days, or 1 week before the event.

### Event Sharing

Events can be shared on social media platforms including Facebook, Twitter, WhatsApp, and LinkedIn.

### Dark Mode

The application includes a dark mode toggle for better user experience in low-light environments.

## 👥 Contributors

- [Your Name](https://github.com/yourusername)
- [Team Member 1](https://github.com/teammember1)
- [Team Member 2](https://github.com/teammember2)
- [Team Member 3](https://github.com/teammember3)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

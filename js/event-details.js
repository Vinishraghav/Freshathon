// Event Details JavaScript for Eventsphere

// DOM Elements
const eventHeader = document.getElementById('event-header');
const eventTitle = document.getElementById('event-title');
const eventCategory = document.getElementById('event-category');
const eventOrganizer = document.getElementById('event-organizer');
const eventDate = document.getElementById('event-date');
const eventTime = document.getElementById('event-time');
const eventVenue = document.getElementById('event-venue');
const eventDescription = document.getElementById('event-description');
const registerButton = document.getElementById('register-button');
const saveEventButton = document.getElementById('save-event-button');
const notifyButton = document.getElementById('notify-button');
const shareFacebook = document.getElementById('share-facebook');
const shareTwitter = document.getElementById('share-twitter');
const shareWhatsapp = document.getElementById('share-whatsapp');
const shareLinkedin = document.getElementById('share-linkedin');
const similarEventsContainer = document.getElementById('similar-events');
const contactForm = document.getElementById('contact-form');

// State
let currentEvent = null;
let map = null;
let marker = null;

// Initialize event details page
function initEventDetailsPage() {
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (!eventId) {
        // No event ID provided, redirect to events page
        window.location.href = 'events.html';
        return;
    }
    
    // Find event in sample events
    currentEvent = sampleEvents.find(event => event.id === eventId);
    
    if (!currentEvent) {
        // Event not found, show error message
        showEventNotFound();
        return;
    }
    
    // Display event details
    displayEventDetails(currentEvent);
    
    // Initialize map
    initMap(currentEvent.latitude, currentEvent.longitude, currentEvent.venue);
    
    // Load similar events
    loadSimilarEvents(currentEvent);
    
    // Set up event listeners
    setupEventListeners(currentEvent);
}

// Display event details
function displayEventDetails(event) {
    // Update page title
    document.title = `${event.title} - Eventsphere`;
    
    // Set header background
    eventHeader.style.backgroundImage = `url(${event.image})`;
    
    // Update event details
    eventTitle.textContent = event.title;
    eventCategory.textContent = event.category;
    eventOrganizer.innerHTML = `<i class="bi bi-building"></i> Organized by: ${event.organizerName}`;
    eventDate.textContent = formatDate(event.date);
    eventTime.textContent = formatTime(event.time);
    eventVenue.textContent = event.venue;
    eventDescription.textContent = event.description;
    
    // Update register button
    registerButton.href = event.registrationLink;
}

// Initialize map
function initMap(latitude, longitude, venueName) {
    if (!latitude || !longitude) return;
    
    // Create map
    map = L.map('map').setView([latitude, longitude], 15);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker
    marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup(`<b>${venueName}</b>`).openPopup();
}

// Load similar events
function loadSimilarEvents(currentEvent) {
    if (!similarEventsContainer) return;
    
    // Find events in the same category
    const similarEvents = sampleEvents.filter(event => 
        event.category === currentEvent.category && 
        event.id !== currentEvent.id
    ).slice(0, 3);
    
    if (similarEvents.length === 0) {
        similarEventsContainer.innerHTML = '<div class="col-12 text-center">No similar events found.</div>';
        return;
    }
    
    // Create HTML for similar events
    let eventsHTML = '';
    similarEvents.forEach(event => {
        eventsHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${event.image}" class="card-img-top" alt="${event.title}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-primary">${event.category}</span>
                            <small class="text-muted">${formatDate(event.date)}</small>
                        </div>
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">${event.description.substring(0, 100)}...</p>
                    </div>
                    <div class="card-footer bg-white border-top-0">
                        <a href="event-details.html?id=${event.id}" class="btn btn-primary w-100">View Details</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    similarEventsContainer.innerHTML = eventsHTML;
}

// Show event not found message
function showEventNotFound() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-calendar-x display-1 text-muted"></i>
            <h2 class="mt-4">Event Not Found</h2>
            <p class="text-muted">The event you're looking for doesn't exist or has been removed.</p>
            <a href="events.html" class="btn btn-primary mt-3">Browse Events</a>
        </div>
    `;
}

// Format time (e.g., "09:00" to "09:00 AM")
function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    
    if (hour < 12) {
        return `${timeString} AM`;
    } else if (hour === 12) {
        return `${timeString} PM`;
    } else {
        return `${hour - 12}:${minutes} PM`;
    }
}

// Set up event listeners
function setupEventListeners(event) {
    // Save event button
    if (saveEventButton) {
        saveEventButton.addEventListener('click', () => {
            const isSaved = saveEventButton.classList.contains('active');
            
            if (isSaved) {
                saveEventButton.classList.remove('active', 'btn-primary');
                saveEventButton.classList.add('btn-outline-primary');
                saveEventButton.innerHTML = '<i class="bi bi-bookmark me-2"></i> Save Event';
                alert('Event removed from saved events.');
            } else {
                saveEventButton.classList.remove('btn-outline-primary');
                saveEventButton.classList.add('active', 'btn-primary');
                saveEventButton.innerHTML = '<i class="bi bi-bookmark-fill me-2"></i> Saved';
                alert('Event saved! You can view your saved events in your profile.');
            }
        });
    }
    
    // Notify button
    if (notifyButton) {
        notifyButton.addEventListener('click', () => {
            const isNotifying = notifyButton.classList.contains('active');
            
            if (isNotifying) {
                notifyButton.classList.remove('active', 'btn-primary');
                notifyButton.classList.add('btn-outline-primary');
                notifyButton.innerHTML = '<i class="bi bi-bell me-2"></i> Get Notified';
                alert('Notifications turned off for this event.');
            } else {
                notifyButton.classList.remove('btn-outline-primary');
                notifyButton.classList.add('active', 'btn-primary');
                notifyButton.innerHTML = '<i class="bi bi-bell-fill me-2"></i> Notifications On';
                alert('You will receive notifications about this event!');
            }
        });
    }
    
    // Share buttons
    if (shareFacebook) {
        shareFacebook.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(event.title);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank');
        });
    }
    
    if (shareTwitter) {
        shareTwitter.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(`Check out this event: ${event.title}`);
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        });
    }
    
    if (shareWhatsapp) {
        shareWhatsapp.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(`Check out this event: ${event.title}`);
            window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        });
    }
    
    if (shareLinkedin) {
        shareLinkedin.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(event.title);
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        });
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Your message has been sent to the organizer. They will get back to you soon!');
            contactForm.reset();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initEventDetailsPage);

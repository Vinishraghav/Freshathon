// Main JavaScript for Eventsphere

// Sample events data (in a real application, this would come from an API)
const sampleEvents = [
    {
        id: "1",
        title: "Tech Conference 2025",
        date: "2025-04-10",
        time: "09:00",
        venue: "Bangalore Convention Center",
        description: "Join us for the biggest tech conference in India. Learn from industry experts, network with professionals, and discover the latest innovations.",
        category: "Technology",
        image: "https://source.unsplash.com/random/800x600/?tech",
        registrationLink: "https://example.com/register",
        organizerId: "org1",
        organizerName: "Tech Association of India",
        latitude: 12.9716,
        longitude: 77.5946
    },
    {
        id: "2",
        title: "Business Summit",
        date: "2025-05-15",
        time: "10:00",
        venue: "Mumbai Business Hub",
        description: "A premier business event focusing on entrepreneurship, investment opportunities, and market trends. Connect with industry leaders and potential investors.",
        category: "Business",
        image: "https://source.unsplash.com/random/800x600/?business",
        registrationLink: "https://example.com/register",
        organizerId: "org2",
        organizerName: "Indian Chamber of Commerce",
        latitude: 19.0760,
        longitude: 72.8777
    },
    {
        id: "3",
        title: "Music Festival",
        date: "2025-06-20",
        time: "16:00",
        venue: "Chennai Beach Arena",
        description: "Experience the best of Indian and international music at this three-day festival. Featuring top artists, food stalls, and activities for all ages.",
        category: "Entertainment",
        image: "https://source.unsplash.com/random/800x600/?music",
        registrationLink: "https://example.com/register",
        organizerId: "org3",
        organizerName: "Sound Wave Productions",
        latitude: 13.0827,
        longitude: 80.2707
    },
    {
        id: "4",
        title: "College Hackathon",
        date: "2025-04-20",
        time: "10:00",
        venue: "Delhi Technical University",
        description: "A 24-hour coding competition for college students. Solve real-world problems, win exciting prizes, and get noticed by top tech companies.",
        category: "Technology",
        image: "https://source.unsplash.com/random/800x600/?coding",
        registrationLink: "https://example.com/register",
        organizerId: "org4",
        organizerName: "Delhi Tech Society",
        latitude: 28.7041,
        longitude: 77.1025
    }
];

// DOM Elements
const featuredEventsContainer = document.getElementById('featured-events');

// Format date to a more readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Create event card HTML
function createEventCard(event) {
    return `
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="card h-100">
                <img src="${event.image}" class="card-img-top" alt="${event.title}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary">${event.category}</span>
                        <small class="text-muted">${formatDate(event.date)}</small>
                    </div>
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text text-truncate">${event.description}</p>
                    <div class="d-flex align-items-center mb-3">
                        <i class="bi bi-geo-alt me-2"></i>
                        <span>${event.venue}</span>
                    </div>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <a href="event-details.html?id=${event.id}" class="btn btn-primary w-100">View Details</a>
                </div>
            </div>
        </div>
    `;
}

// Load featured events
function loadFeaturedEvents() {
    if (featuredEventsContainer) {
        let eventsHTML = '';
        
        // Use only the first 4 events for the featured section
        const featuredEvents = sampleEvents.slice(0, 4);
        
        featuredEvents.forEach(event => {
            eventsHTML += createEventCard(event);
        });
        
        featuredEventsContainer.innerHTML = eventsHTML;
    }
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Check for saved dark mode preference
function checkDarkModePreference() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
    }
}

// Initialize the application
function initApp() {
    loadFeaturedEvents();
    checkDarkModePreference();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

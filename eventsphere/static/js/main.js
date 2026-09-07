// Main JavaScript file for Eventsphere

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Add animation to elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Handle form submissions with validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
    
    // Get user's location for nearby events
    const nearbyEventsContainer = document.getElementById('nearby-events');
    if (nearbyEventsContainer) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    // Show loading spinner
                    nearbyEventsContainer.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-3">Finding events near you...</p></div>';
                    
                    // Fetch nearby events
                    fetchNearbyEvents(lat, lon);
                },
                error => {
                    console.error('Error getting location:', error);
                    nearbyEventsContainer.innerHTML = '<div class="alert alert-warning" role="alert"><i class="bi bi-exclamation-triangle me-2"></i>Could not access your location. Please allow location access to see nearby events.</div>';
                }
            );
        } else {
            nearbyEventsContainer.innerHTML = '<div class="alert alert-warning" role="alert"><i class="bi bi-exclamation-triangle me-2"></i>Geolocation is not supported by your browser. Please use a modern browser to see nearby events.</div>';
        }
    }
    
    // Handle category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const eventCards = document.querySelectorAll('.event-card');
            
            eventCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.closest('.col').style.display = 'block';
                } else {
                    card.closest('.col').style.display = 'none';
                }
            });
        });
    }
    
    // Handle search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const eventCards = document.querySelectorAll('.event-card');
            
            eventCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const venue = card.querySelector('.card-venue').textContent.toLowerCase();
                const description = card.querySelector('.card-text').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || venue.includes(searchTerm) || description.includes(searchTerm)) {
                    card.closest('.col').style.display = 'block';
                } else {
                    card.closest('.col').style.display = 'none';
                }
            });
        });
    }
});

// Function to fetch nearby events
function fetchNearbyEvents(lat, lon) {
    fetch(`/api/events/nearby?lat=${lat}&lon=${lon}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            displayEvents(events, 'nearby-events');
        })
        .catch(error => {
            console.error('Error fetching nearby events:', error);
            document.getElementById('nearby-events').innerHTML = '<div class="alert alert-danger" role="alert"><i class="bi bi-exclamation-circle me-2"></i>Failed to load nearby events. Please try again later.</div>';
        });
}

// Function to fetch all events
function fetchAllEvents() {
    const eventsContainer = document.getElementById('all-events');
    if (!eventsContainer) return;
    
    // Show loading spinner
    eventsContainer.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-3">Loading events...</p></div>';
    
    fetch('/api/events')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            displayEvents(events, 'all-events');
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            eventsContainer.innerHTML = '<div class="alert alert-danger" role="alert"><i class="bi bi-exclamation-circle me-2"></i>Failed to load events. Please try again later.</div>';
        });
}

// Function to display events
function displayEvents(events, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<div class="alert alert-info" role="alert"><i class="bi bi-info-circle me-2"></i>No events found.</div>';
        return;
    }
    
    let html = '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">';
    
    events.forEach(event => {
        const categoryClass = event.category ? event.category.toLowerCase() : '';
        
        html += `
            <div class="col fade-in">
                <div class="card event-card h-100" data-category="${event.category || ''}">
                    <div class="position-relative">
                        <img src="${event.image || 'https://source.unsplash.com/random/800x600/?event'}" class="card-img-top" alt="${event.title}">
                        <span class="badge category-badge ${categoryClass} position-absolute top-0 end-0 m-2">${event.category || 'Event'}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-date mb-1"><i class="bi bi-calendar-event me-2"></i>${formatDate(event.date)} at ${event.time}</p>
                        <p class="card-venue mb-2"><i class="bi bi-geo-alt me-2"></i>${event.venue}</p>
                        ${event.distance ? `<p class="card-distance mb-2"><i class="bi bi-pin-map me-2"></i>${event.distance} km away</p>` : ''}
                        <p class="card-text">${truncateText(event.description, 100)}</p>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <a href="/events/${event.id}" class="btn btn-primary w-100">View Details</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Function to delete event with confirmation
function confirmDelete(eventId, eventTitle) {
    if (confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
        document.getElementById(`delete-form-${eventId}`).submit();
    }
}

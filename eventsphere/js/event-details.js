/**
 * Eventsphere - Event Details JavaScript
 * Handles functionality specific to the event details page
 */

// Sample events data
const events = [
    {
        id: "1",
        title: "Tech Conference 2025",
        date: "2025-04-10",
        time: "09:00",
        venue: "Chennai Convention Center",
        description: "Annual technology conference featuring the latest innovations in AI, machine learning, and blockchain. Join industry experts for workshops, panel discussions, and networking opportunities.\n\nThe conference will feature keynote speeches from industry leaders, hands-on workshops, and networking sessions. Topics covered will include artificial intelligence, machine learning, blockchain technology, cybersecurity, and more.\n\nThis is a great opportunity for students, professionals, and enthusiasts to learn about the latest trends in technology and connect with like-minded individuals.",
        category: "technology",
        image: "https://source.unsplash.com/random/800x600/?tech",
        registrationLink: "https://example.com/register",
        organizerName: "TechEvents India",
        latitude: 13.0827,
        longitude: 80.2707,
        price: 1500,
        rating: 4.8,
        attendees: 850,
        gallery: [
            "https://source.unsplash.com/random/800x600/?conference",
            "https://source.unsplash.com/random/800x600/?technology",
            "https://source.unsplash.com/random/800x600/?coding",
            "https://source.unsplash.com/random/800x600/?developer"
        ]
    },
    {
        id: "2",
        title: "Startup Meetup",
        date: "2025-04-15",
        time: "18:00",
        venue: "Bangalore Tech Park",
        description: "Networking event for startups and investors. Pitch your ideas, meet potential investors, and connect with like-minded entrepreneurs.\n\nThe meetup will feature pitch sessions where startups can present their ideas to a panel of investors, networking opportunities, and mentorship sessions with experienced entrepreneurs.\n\nThis is a great opportunity for startups to gain visibility, receive feedback on their ideas, and potentially secure funding for their ventures.",
        category: "business",
        image: "https://source.unsplash.com/random/800x600/?startup",
        registrationLink: "https://example.com/register",
        organizerName: "Startup India",
        latitude: 12.9716,
        longitude: 77.5946,
        price: 500,
        rating: 4.5,
        attendees: 350,
        gallery: [
            "https://source.unsplash.com/random/800x600/?business",
            "https://source.unsplash.com/random/800x600/?meeting",
            "https://source.unsplash.com/random/800x600/?entrepreneur",
            "https://source.unsplash.com/random/800x600/?startup"
        ]
    },
    {
        id: "3",
        title: "Music Festival",
        date: "2025-05-05",
        time: "16:00",
        venue: "Mumbai Beach",
        description: "Annual music festival featuring top artists from around the world. Enjoy a day of music, food, and fun by the beach.\n\nThe festival will feature performances from both established and emerging artists across various genres including rock, pop, electronic, and indie. There will also be food stalls, art installations, and interactive activities.\n\nBring your friends and family for a day of music, food, and fun by the beach!",
        category: "music",
        image: "https://source.unsplash.com/random/800x600/?music",
        registrationLink: "https://example.com/register",
        organizerName: "Mumbai Music Events",
        latitude: 19.0760,
        longitude: 72.8777,
        price: 2000,
        rating: 4.9,
        attendees: 1500,
        gallery: [
            "https://source.unsplash.com/random/800x600/?concert",
            "https://source.unsplash.com/random/800x600/?festival",
            "https://source.unsplash.com/random/800x600/?band",
            "https://source.unsplash.com/random/800x600/?stage"
        ]
    },
    {
        id: "4",
        title: "College Hackathon",
        date: "2025-04-20",
        time: "10:00",
        venue: "Delhi Technical University",
        description: "24-hour coding competition for college students. Form teams, solve real-world problems, and win exciting prizes.\n\nThe hackathon will challenge participants to develop innovative solutions to real-world problems. Teams will have 24 hours to ideate, design, and develop their projects. Mentors will be available throughout the event to provide guidance and support.\n\nThis is a great opportunity for students to apply their skills, learn from peers, and showcase their talent to potential employers.",
        category: "technology",
        image: "https://source.unsplash.com/random/800x600/?coding",
        registrationLink: "https://example.com/register",
        organizerName: "Delhi Tech University",
        latitude: 28.7501,
        longitude: 77.1177,
        price: 0,
        rating: 4.7,
        attendees: 500,
        gallery: [
            "https://source.unsplash.com/random/800x600/?hackathon",
            "https://source.unsplash.com/random/800x600/?programming",
            "https://source.unsplash.com/random/800x600/?coder",
            "https://source.unsplash.com/random/800x600/?laptop"
        ]
    },
    {
        id: "5",
        title: "Art Exhibition",
        date: "2025-05-10",
        time: "11:00",
        venue: "Kolkata Art Gallery",
        description: "Exhibition featuring works from emerging artists across India. Explore paintings, sculptures, and digital art in this immersive experience.\n\nThe exhibition will showcase a diverse range of artistic expressions including paintings, sculptures, installations, and digital art. Visitors will have the opportunity to meet the artists, attend workshops, and participate in guided tours.\n\nThis is a great opportunity to support emerging artists and experience the vibrant art scene of India.",
        category: "arts",
        image: "https://source.unsplash.com/random/800x600/?art",
        registrationLink: "https://example.com/register",
        organizerName: "Kolkata Arts Council",
        latitude: 22.5726,
        longitude: 88.3639,
        price: 300,
        rating: 4.6,
        attendees: 750,
        gallery: [
            "https://source.unsplash.com/random/800x600/?gallery",
            "https://source.unsplash.com/random/800x600/?painting",
            "https://source.unsplash.com/random/800x600/?sculpture",
            "https://source.unsplash.com/random/800x600/?exhibition"
        ]
    },
    {
        id: "6",
        title: "Sports Tournament",
        date: "2025-05-15",
        time: "08:00",
        venue: "Hyderabad Stadium",
        description: "Inter-college sports tournament featuring cricket, football, basketball, and athletics. Cheer for your favorite teams and witness thrilling competitions.\n\nThe tournament will feature competitions in cricket, football, basketball, volleyball, and athletics. Colleges from across the country will participate in this prestigious event.\n\nCome and cheer for your favorite teams and witness thrilling competitions!",
        category: "sports",
        image: "https://source.unsplash.com/random/800x600/?sports",
        registrationLink: "https://example.com/register",
        organizerName: "Hyderabad Sports Association",
        latitude: 17.4065,
        longitude: 78.4772,
        price: 200,
        rating: 4.4,
        attendees: 1200,
        gallery: [
            "https://source.unsplash.com/random/800x600/?stadium",
            "https://source.unsplash.com/random/800x600/?cricket",
            "https://source.unsplash.com/random/800x600/?football",
            "https://source.unsplash.com/random/800x600/?basketball"
        ]
    }
];

// Get event ID from URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

// Google Maps variable
let map;

// Initialize Google Map
function initMap(lat, lng, venue) {
    if (!lat || !lng) return;
    
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    const location = { lat, lng };
    
    map = new google.maps.Map(mapElement, {
        center: location,
        zoom: 15,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true
    });
    
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: venue
    });
    
    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${venue}</strong></div>`
    });
    
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
    
    // Open info window by default
    infoWindow.open(map, marker);
}

// Display event details
function displayEventDetails(event) {
    const container = document.getElementById('event-details-container');
    
    // Update breadcrumb
    document.getElementById('event-title-breadcrumb').textContent = event.title;
    
    // Format date
    const eventDate = new Date(event.date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = eventDate.toLocaleDateString(undefined, options);
    
    // Calculate days remaining
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysRemaining = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    // Create HTML
    let html = `
        <div class="row">
            <div class="col-lg-8">
                <img src="${event.image}" class="img-fluid event-image mb-4" alt="${event.title}">
                
                <h1 class="mb-3">${event.title}</h1>
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge category-badge ${event.category}">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                    <div class="rating-stars">
                        ${generateRatingStars(event.rating)}
                        <span class="ms-2 text-muted">(${event.rating}/5)</span>
                    </div>
                </div>
                
                <div class="event-meta">
                    <div class="event-meta-item">
                        <i class="bi bi-calendar-event"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="bi bi-clock"></i>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="bi bi-geo-alt"></i>
                        <span>${event.venue}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="bi bi-building"></i>
                        <span>${event.organizerName}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="bi bi-people"></i>
                        <span>${event.attendees} attendees</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="bi bi-currency-rupee"></i>
                        <span>${event.price === 0 ? 'Free' : '₹' + event.price}</span>
                    </div>
                </div>
                
                <!-- Event Countdown -->
                ${daysRemaining > 0 ? `
                <div class="event-countdown mb-4">
                    <div class="row" id="countdown-timer">
                        <div class="col-3 countdown-item">
                            <div class="countdown-number" id="countdown-days">${daysRemaining}</div>
                            <div class="countdown-label">Days</div>
                        </div>
                        <div class="col-3 countdown-item">
                            <div class="countdown-number" id="countdown-hours">00</div>
                            <div class="countdown-label">Hours</div>
                        </div>
                        <div class="col-3 countdown-item">
                            <div class="countdown-number" id="countdown-minutes">00</div>
                            <div class="countdown-label">Minutes</div>
                        </div>
                        <div class="col-3 countdown-item">
                            <div class="countdown-number" id="countdown-seconds">00</div>
                            <div class="countdown-label">Seconds</div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">About This Event</h5>
                        <p class="card-text">${event.description.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                
                <!-- Event Gallery -->
                <h5 class="mb-3">Event Gallery</h5>
                <div class="row event-gallery mb-4">
                    ${event.gallery.map(img => `
                        <div class="col-6 col-md-3 mb-3">
                            <img src="${img}" class="img-fluid" alt="Event gallery image" data-bs-toggle="modal" data-bs-target="#galleryModal" onclick="openGalleryModal('${img}')">
                        </div>
                    `).join('')}
                </div>
                
                <div class="d-grid gap-2">
                    <a href="${event.registrationLink}" class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
                        <i class="bi bi-box-arrow-up-right me-2"></i>
                        Register Now
                    </a>
                    <a href="events.html" class="btn btn-outline-secondary">
                        <i class="bi bi-arrow-left me-2"></i>
                        Back to Events
                    </a>
                </div>
            </div>
            
            <div class="col-lg-4">
                <!-- Event Location Map -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Event Location</h5>
                        <div id="map" class="mb-3"></div>
                        <p class="mb-0">
                            <i class="bi bi-geo-alt me-2"></i>
                            ${event.venue}
                        </p>
                    </div>
                </div>
                
                <!-- Share This Event -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Share This Event</h5>
                        <div class="d-flex gap-2 mt-3">
                            <a href="#" class="btn btn-outline-primary share-btn" data-type="facebook" aria-label="Share on Facebook">
                                <i class="bi bi-facebook"></i>
                            </a>
                            <a href="#" class="btn btn-outline-info share-btn" data-type="twitter" aria-label="Share on Twitter">
                                <i class="bi bi-twitter-x"></i>
                            </a>
                            <a href="#" class="btn btn-outline-success share-btn" data-type="whatsapp" aria-label="Share on WhatsApp">
                                <i class="bi bi-whatsapp"></i>
                            </a>
                            <a href="#" class="btn btn-outline-secondary share-btn" data-type="email" aria-label="Share via Email">
                                <i class="bi bi-envelope"></i>
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Set Reminder -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Set Reminder</h5>
                        <form id="reminderForm" class="needs-validation" novalidate>
                            <div class="mb-3">
                                <label for="reminderEmail" class="form-label">Email Address</label>
                                <input type="email" class="form-control" id="reminderEmail" required>
                                <div class="invalid-feedback">
                                    Please enter a valid email address.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="reminderTime" class="form-label">Remind Me</label>
                                <select class="form-select" id="reminderTime" required>
                                    <option value="" selected disabled>Select when to remind</option>
                                    <option value="1hour">1 hour before</option>
                                    <option value="3hours">3 hours before</option>
                                    <option value="1day">1 day before</option>
                                    <option value="3days">3 days before</option>
                                    <option value="1week">1 week before</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please select when to remind you.
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">
                                <i class="bi bi-bell me-2"></i>
                                Set Reminder
                            </button>
                        </form>
                    </div>
                </div>
                
                <!-- Organizer -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Organizer</h5>
                        <div class="d-flex align-items-center mb-3">
                            <div class="flex-shrink-0">
                                <i class="bi bi-building fs-1 text-primary"></i>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-0">${event.organizerName}</h6>
                                <p class="text-muted mb-0">Event Organizer</p>
                            </div>
                        </div>
                        <a href="#" class="btn btn-outline-primary btn-sm w-100">
                            <i class="bi bi-envelope me-1"></i> Contact Organizer
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Initialize map
    initMap(event.latitude, event.longitude, event.venue);
    
    // Initialize countdown timer
    if (daysRemaining > 0) {
        startCountdown(event.date, event.time);
    }
    
    // Set up reminder form submission
    document.getElementById('reminderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }
        
        alert('Reminder set successfully! You will receive an email reminder before the event.');
        this.reset();
        this.classList.remove('was-validated');
    });
    
    // Initialize social sharing
    initializeSocialSharing(event);
    
    // Load related events
    loadRelatedEvents(event);
}

// Generate rating stars
function generateRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="bi bi-star-fill"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="bi bi-star-half"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }
    
    return stars;
}

// Start countdown timer
function startCountdown(dateStr, timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const eventDate = new Date(dateStr);
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdown-timer').innerHTML = '<div class="col-12 text-center">This event has already started!</div>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('countdown-days').textContent = days;
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Initialize social sharing
function initializeSocialSharing(event) {
    const shareButtons = document.querySelectorAll('.share-btn');
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(event.title);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const type = this.dataset.type;
            let shareUrl;
            
            switch(type) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${title}&body=Check out this event: ${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Load related events
function loadRelatedEvents(currentEvent) {
    const relatedEvents = events.filter(event => 
        event.category === currentEvent.category && event.id !== currentEvent.id
    );
    
    const relatedEventsContainer = document.getElementById('related-events');
    
    if (relatedEvents.length === 0) {
        relatedEventsContainer.innerHTML = '<div class="col-12"><p class="text-muted">No related events found.</p></div>';
        return;
    }
    
    let html = '';
    
    relatedEvents.forEach((event, index) => {
        html += `
            <div class="col fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="card h-100">
                    <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 180px; object-fit: cover;">
                    <div class="card-body">
                        <span class="badge category-badge ${event.category} float-end">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text mb-1"><i class="bi bi-calendar-event me-2"></i>${formatDate(event.date)} at ${event.time}</p>
                        <p class="card-text mb-2"><i class="bi bi-geo-alt me-2"></i>${event.venue}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="text-muted">${event.price === 0 ? 'Free' : '₹' + event.price}</span>
                            <div class="rating-stars small">
                                ${generateRatingStars(event.rating)}
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0">
                        <a href="event_details.html?id=${event.id}" class="btn btn-primary w-100">View Details</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    relatedEventsContainer.innerHTML = html;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Open gallery modal
function openGalleryModal(imageUrl) {
    // Create modal if it doesn't exist
    if (!document.getElementById('galleryModal')) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'galleryModal';
        modal.tabIndex = '-1';
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body p-0">
                        <button type="button" class="btn-close position-absolute top-0 end-0 m-2 bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        <img src="${imageUrl}" class="img-fluid" id="galleryModalImage" alt="Gallery image">
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Initialize the modal
        new bootstrap.Modal(modal).show();
    } else {
        // Update image and show modal
        document.getElementById('galleryModalImage').src = imageUrl;
        const galleryModal = new bootstrap.Modal(document.getElementById('galleryModal'));
        galleryModal.show();
    }
}

// Load event details when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (!eventId) {
        document.getElementById('event-details-container').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-circle me-2"></i>
                Event ID not specified. Please go back to the <a href="events.html">events page</a> and select an event.
            </div>
        `;
        return;
    }
    
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        document.getElementById('event-details-container').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-circle me-2"></i>
                Event not found. Please go back to the <a href="events.html">events page</a> and select a valid event.
            </div>
        `;
        return;
    }
    
    displayEventDetails(event);
    
    // Update page title
    document.title = `${event.title} - Eventsphere`;
});

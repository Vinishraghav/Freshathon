// Events JavaScript for Eventsphere

// DOM Elements
const eventsContainer = document.getElementById('events-container');
const eventCount = document.getElementById('event-count');
const searchInput = document.getElementById('event-search');
const searchButton = document.getElementById('search-button');
const resetFiltersButton = document.getElementById('reset-filters');
const categoryFilters = document.querySelectorAll('.category-filter');
const dateFilters = document.querySelectorAll('.date-filter');
const sortOptions = document.querySelectorAll('.sort-option');

// State
let filteredEvents = [];
let currentSort = 'date-asc';
let searchQuery = '';
let selectedCategories = ['Technology', 'Business', 'Entertainment', 'Education'];
let selectedDateFilter = 'all';

// Initialize events page
function initEventsPage() {
    // Get events from main.js or fetch from API
    filteredEvents = [...sampleEvents];
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        // Update UI to reflect the category filter
        selectedCategories = [categoryParam];
        categoryFilters.forEach(filter => {
            filter.checked = filter.value === categoryParam;
        });
    }
    
    // Render events
    renderEvents();
    
    // Set up event listeners
    setupEventListeners();
}

// Create event card HTML
function createEventCard(event) {
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <img src="${event.image}" class="card-img-top" alt="${event.title}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary">${event.category}</span>
                        <small class="text-muted">${formatDate(event.date)}</small>
                    </div>
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">${event.description.substring(0, 100)}...</p>
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-geo-alt me-2"></i>
                        <span>${event.venue}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-clock me-2"></i>
                        <span>${event.time}</span>
                    </div>
                </div>
                <div class="card-footer bg-white border-top-0">
                    <a href="event-details.html?id=${event.id}" class="btn btn-primary w-100">View Details</a>
                </div>
            </div>
        </div>
    `;
}

// Render events based on current filters and sort
function renderEvents() {
    if (!eventsContainer) return;
    
    // Apply filters
    let events = applyFilters();
    
    // Apply sorting
    events = sortEvents(events);
    
    // Update event count
    if (eventCount) {
        eventCount.textContent = `Showing ${events.length} event${events.length !== 1 ? 's' : ''}`;
    }
    
    // Render events
    if (events.length > 0) {
        let eventsHTML = '';
        events.forEach(event => {
            eventsHTML += createEventCard(event);
        });
        eventsContainer.innerHTML = eventsHTML;
    } else {
        eventsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="py-5">
                    <i class="bi bi-calendar-x fs-1 text-muted"></i>
                    <h3 class="mt-3">No events found</h3>
                    <p class="text-muted">Try adjusting your filters or search query.</p>
                    <button class="btn btn-primary mt-3" id="clear-all-filters">Clear All Filters</button>
                </div>
            </div>
        `;
        
        // Add event listener to the clear all filters button
        const clearAllFiltersButton = document.getElementById('clear-all-filters');
        if (clearAllFiltersButton) {
            clearAllFiltersButton.addEventListener('click', resetFilters);
        }
    }
}

// Apply filters to events
function applyFilters() {
    return sampleEvents.filter(event => {
        // Category filter
        const categoryMatch = selectedCategories.includes(event.category);
        
        // Date filter
        const dateMatch = filterByDate(event.date);
        
        // Search filter
        const searchMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.venue.toLowerCase().includes(searchQuery.toLowerCase());
        
        return categoryMatch && dateMatch && searchMatch;
    });
}

// Filter events by date
function filterByDate(dateString) {
    if (selectedDateFilter === 'all') return true;
    
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDay = eventDate.getDate();
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();
    
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    switch (selectedDateFilter) {
        case 'today':
            return eventDay === currentDay && 
                   eventMonth === currentMonth && 
                   eventYear === currentYear;
        
        case 'week':
            const oneWeekLater = new Date(today);
            oneWeekLater.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= oneWeekLater;
        
        case 'month':
            return eventMonth === currentMonth && eventYear === currentYear;
        
        default:
            return true;
    }
}

// Sort events based on current sort option
function sortEvents(events) {
    return [...events].sort((a, b) => {
        switch (currentSort) {
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            
            case 'name-asc':
                return a.title.localeCompare(b.title);
            
            case 'name-desc':
                return b.title.localeCompare(a.title);
            
            default:
                return 0;
        }
    });
}

// Reset all filters
function resetFilters() {
    // Reset search
    if (searchInput) searchInput.value = '';
    searchQuery = '';
    
    // Reset categories
    selectedCategories = ['Technology', 'Business', 'Entertainment', 'Education'];
    categoryFilters.forEach(filter => {
        filter.checked = true;
    });
    
    // Reset date filter
    selectedDateFilter = 'all';
    dateFilters.forEach(filter => {
        filter.checked = filter.value === 'all';
    });
    
    // Reset sort
    currentSort = 'date-asc';
    
    // Re-render events
    renderEvents();
}

// Set up event listeners
function setupEventListeners() {
    // Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderEvents();
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            searchQuery = searchInput.value;
            renderEvents();
        });
    }
    
    // Category filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            // Get all checked categories
            selectedCategories = [];
            categoryFilters.forEach(f => {
                if (f.checked) {
                    selectedCategories.push(f.value);
                }
            });
            
            renderEvents();
        });
    });
    
    // Date filters
    dateFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            selectedDateFilter = filter.value;
            renderEvents();
        });
    });
    
    // Sort options
    sortOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            currentSort = option.dataset.sort;
            renderEvents();
        });
    });
    
    // Reset filters
    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', resetFilters);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initEventsPage);

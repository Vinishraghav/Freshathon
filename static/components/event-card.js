/**
 * Event Card Component
 * 
 * Displays event information in a card format with hover effects,
 * badges, and interactive elements.
 */

class EventCard {
  constructor(cardElement) {
    this.card = cardElement;
    this.isHovered = false;
    this.eventId = this.card.dataset.eventId;
    this.eventData = {
      title: this.card.dataset.title,
      date: this.card.dataset.date,
      time: this.card.dataset.time,
      venue: this.card.dataset.venue,
      image: this.card.dataset.image,
      category: this.card.dataset.category
    };
    
    this.init();
  }

  init() {
    // Add hover effects
    this.card.addEventListener('mouseenter', () => this.handleHover(true));
    this.card.addEventListener('mouseleave', () => this.handleHover(false));
    
    // Initialize bookmark button
    const bookmarkBtn = this.card.querySelector('.bookmark-button');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', this.toggleBookmark.bind(this));
    }
    
    // Calculate days left
    this.calculateDaysLeft();
    
    // Initialize rating stars
    this.renderRatingStars();
  }

  handleHover(isHovered) {
    this.isHovered = isHovered;
    const cardImage = this.card.querySelector('.card-img-top');
    if (cardImage) {
      cardImage.style.transform = isHovered ? 'scale(1.1)' : 'scale(1)';
    }
  }

  calculateDaysLeft() {
    const dateElement = this.card.querySelector('[data-date]');
    if (!dateElement) return;
    
    const date = dateElement.dataset.date;
    if (date) {
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Calculate days remaining
      const timeDiff = eventDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Update days left badge if it exists
      const daysLeftBadge = this.card.querySelector('.days-left-badge');
      if (daysLeftBadge && daysDiff > 0 && daysDiff < 30) {
        daysLeftBadge.innerHTML = `
          <i class="fas fa-clock-fill me-1"></i>
          ${daysDiff} ${daysDiff === 1 ? 'day' : 'days'} left
        `;
        daysLeftBadge.style.display = 'block';
      }
    }
  }

  renderRatingStars() {
    const ratingElement = this.card.querySelector('.event-rating');
    if (!ratingElement) return;
    
    const rating = parseFloat(ratingElement.dataset.rating) || 4.5;
    const starsContainer = ratingElement.querySelector('.stars-container');
    if (!starsContainer) return;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHTML += '<i class="fas fa-star text-warning"></i>';
      } else if (i === fullStars + 1 && hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
      } else {
        starsHTML += '<i class="far fa-star text-warning"></i>';
      }
    }
    
    starsContainer.innerHTML = starsHTML;
    ratingElement.querySelector('.rating-value').textContent = `(${rating})`;
  }

  toggleBookmark(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const bookmarkBtn = e.currentTarget;
    const icon = bookmarkBtn.querySelector('i');
    
    // Toggle bookmark state
    if (icon.classList.contains('far')) {
      // Save bookmark
      icon.classList.remove('far');
      icon.classList.add('fas');
      this.saveBookmark();
    } else {
      // Remove bookmark
      icon.classList.remove('fas');
      icon.classList.add('far');
      this.removeBookmark();
    }
  }

  saveBookmark() {
    // Get existing bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    // Check if this event is already bookmarked
    if (!bookmarks.some(bookmark => bookmark.id === this.eventId)) {
      // Add this event to bookmarks
      bookmarks.push({
        id: this.eventId,
        ...this.eventData,
        savedAt: new Date().toISOString()
      });
      
      // Save updated bookmarks
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      
      // Show success message
      this.showToast('Event saved to bookmarks!');
    }
  }

  removeBookmark() {
    // Get existing bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    // Remove this event from bookmarks
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== this.eventId);
    
    // Save updated bookmarks
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    
    // Show success message
    this.showToast('Event removed from bookmarks');
  }

  showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast show position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="toast-header">
        <i class="fas fa-bookmark me-2 text-primary"></i>
        <strong class="me-auto">Eventsphere</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

// Initialize all event cards when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach(card => new EventCard(card));
});

/**
 * Footer Component
 * 
 * Handles newsletter subscription and theme toggling functionality.
 */

class Footer {
  constructor() {
    this.email = '';
    this.subscribed = false;
    this.darkMode = localStorage.getItem('theme') === 'dark';
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize newsletter form
      const newsletterForm = document.getElementById('newsletter-form');
      if (newsletterForm) {
        newsletterForm.addEventListener('submit', this.handleSubscribe.bind(this));
      }
      
      // Initialize theme toggle
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        
        // Set initial state
        this.updateThemeToggleButton();
      }
      
      // Set current year in copyright text
      const yearElement = document.getElementById('current-year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    });
  }

  handleSubscribe(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('newsletter-email');
    if (!emailInput) return;
    
    this.email = emailInput.value;
    
    if (this.email && this.email.includes('@')) {
      this.subscribed = true;
      
      // In a real app, you would send this to your backend
      console.log('Subscribed with email:', this.email);
      
      // Show success message
      const newsletterSection = document.querySelector('.newsletter-section');
      const formContainer = document.querySelector('.newsletter-form-container');
      const successContainer = document.querySelector('.newsletter-success-container');
      
      if (formContainer && successContainer) {
        formContainer.style.display = 'none';
        successContainer.style.display = 'block';
      }
      
      // Reset form
      emailInput.value = '';
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    
    if (this.darkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    
    this.updateThemeToggleButton();
  }

  updateThemeToggleButton() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (themeToggle && themeIcon) {
      if (this.darkMode) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        themeToggle.setAttribute('title', 'Switch to light mode');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        themeToggle.setAttribute('title', 'Switch to dark mode');
      }
    }
  }
}

// Initialize the footer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Footer();
});

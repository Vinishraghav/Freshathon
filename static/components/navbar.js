/**
 * Navbar Component
 * 
 * A responsive navigation bar with dynamic user authentication state,
 * dropdown menus, and theme toggle functionality.
 */

class Navbar {
  constructor() {
    this.scrolled = false;
    this.mobileMenuOpen = false;
    this.darkMode = localStorage.getItem('theme') === 'dark';
    this.init();
  }

  init() {
    // Handle scroll effect for navbar
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Initialize mobile menu toggle
    document.addEventListener('DOMContentLoaded', () => {
      const navbarToggler = document.querySelector('.navbar-toggler');
      if (navbarToggler) {
        navbarToggler.addEventListener('click', this.toggleMobileMenu.bind(this));
      }

      // Initialize dropdowns
      const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
      dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          const parent = toggle.closest('.dropdown');
          parent.classList.toggle('show');
          const menu = parent.querySelector('.dropdown-menu');
          menu.classList.toggle('show');
        });
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
          document.querySelectorAll('.dropdown.show').forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.querySelector('.dropdown-menu').classList.remove('show');
          });
        }
      });

      // Handle logout button
      const logoutBtn = document.querySelector('.logout-button');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', this.handleLogout.bind(this));
      }
    });
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.scrolled = true;
      document.querySelector('.navbar').classList.add('navbar-scrolled');
    } else {
      this.scrolled = false;
      document.querySelector('.navbar').classList.remove('navbar-scrolled');
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse) {
      if (this.mobileMenuOpen) {
        navbarCollapse.classList.add('show');
      } else {
        navbarCollapse.classList.remove('show');
      }
    }
  }

  async handleLogout() {
    try {
      // In a real app, this would call your backend logout endpoint
      // For now, just redirect to home page
      window.location.href = '/logout';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Check if a link is active
  static isActive(path) {
    const currentPath = window.location.pathname;
    if (path === '/') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  }
}

// Initialize the navbar when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Navbar();
});

/**
 * Eventsphere - Main JavaScript
 * Handles common functionality across the platform
 */

document.addEventListener("DOMContentLoaded", function () {
  // Check for saved dark mode preference
  const darkModePreference = localStorage.getItem("darkMode");

  // Apply dark mode if previously enabled
  if (darkModePreference === "enabled") {
    document.body.classList.add("dark-mode");
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
      darkModeToggle.checked = true;
    }
  }

  // Set up dark mode toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
      }
    });
  }

  // Set active nav link based on current page
  setActiveNavLink();

  // Initialize tooltips
  initializeTooltips();

  // Initialize popovers
  initializePopovers();

  // Initialize form validation
  initializeFormValidation();

  // Initialize social sharing
  initializeSocialSharing();

  // Apply URL parameters to filters
  applyUrlParamsToFilters();
});

// Set active nav link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop();

  // Default to index.html if no page is specified
  const activePage = currentPage || "index.html";

  // Find all nav links
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  // Remove active class from all links
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to current page link
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === activePage ||
      (activePage === "index.html" && href === "./") ||
      (activePage === "index.html" && href === "/")
    ) {
      link.classList.add("active");
    } else if (href && activePage.includes(href) && href !== "./") {
      link.classList.add("active");
    }
  });
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Initialize Bootstrap popovers
function initializePopovers() {
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
}

// Initialize form validation
function initializeFormValidation() {
  // Fetch all forms with the 'needs-validation' class
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });

  // Real-time validation for password confirmation
  const passwordConfirmationFields = document.querySelectorAll(
    'input[name="confirmPassword"]'
  );
  passwordConfirmationFields.forEach((field) => {
    field.addEventListener("input", function () {
      const password = this.form.querySelector('input[name="password"]').value;
      const confirmPassword = this.value;

      if (password !== confirmPassword) {
        this.setCustomValidity("Passwords do not match");
      } else {
        this.setCustomValidity("");
      }
    });
  });
}

// Display events in a container
function displayEvents(events, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = "";

  if (events.length === 0) {
    html = `
            <div class="col-12">
                <div class="alert alert-info" role="alert">
                    <i class="bi bi-info-circle me-2"></i>
                    No events found matching your criteria.
                </div>
            </div>
        `;
  } else {
    events.forEach((event, index) => {
      const categoryClass = event.category ? event.category.toLowerCase() : "";

      html += `
                <div class="col fade-in" style="animation-delay: ${
                  index * 0.1
                }s">
                    <div class="card h-100">
                        <img src="${
                          event.image ||
                          "https://source.unsplash.com/random/800x600/?event"
                        }" class="card-img-top" alt="${event.title}">
                        <div class="card-body">
                            <span class="badge category-badge ${categoryClass} float-end">${
        event.category || "Event"
      }</span>
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text mb-1"><i class="bi bi-calendar-event me-2"></i>${formatDate(
                              event.date
                            )} at ${event.time}</p>
                            <p class="card-text mb-2"><i class="bi bi-geo-alt me-2"></i>${
                              event.venue
                            }</p>
                            <p class="card-text">${truncateText(
                              event.description,
                              100
                            )}</p>
                        </div>
                        <div class="card-footer bg-transparent border-top-0">
                            <a href="event_details.html?id=${
                              event.id
                            }" class="btn btn-primary w-100">View Details</a>
                        </div>
                    </div>
                </div>
            `;
    });
  }

  container.innerHTML = html;
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "";

  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Truncate text
function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Calculate distance between two coordinates in kilometers (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

/**
 * Initialize Social Sharing
 * Sets up social sharing functionality for event pages
 */
function initializeSocialSharing() {
  const shareButtons = document.querySelectorAll(".share-btn");

  shareButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const type = this.dataset.type;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);

      let shareUrl;

      switch (type) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case "whatsapp":
          shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`;
          break;
        case "email":
          shareUrl = `mailto:?subject=${title}&body=Check out this event: ${url}`;
          break;
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400");
      }
    });
  });
}

/**
 * Get URL parameters
 */
function getUrlParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split("&");

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    if (pair[0]) {
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
  }

  return params;
}

/**
 * Apply URL parameters to filters
 * Used to handle category links and other filter parameters in the URL
 */
function applyUrlParamsToFilters() {
  const params = getUrlParams();

  // Apply category filter if present in URL
  if (params.category) {
    const categoryFilter = document.getElementById("category-filter");
    if (
      categoryFilter &&
      categoryFilter.querySelector(`option[value="${params.category}"]`)
    ) {
      categoryFilter.value = params.category;

      // Trigger change event to apply filter
      const event = new Event("change");
      categoryFilter.dispatchEvent(event);
    }
  }
}

// Add event listeners when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize popovers
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Get the button element
  const clickMeButton = document.getElementById("clickMeButton");

  // Add click event listener
  if (clickMeButton) {
    clickMeButton.addEventListener("click", function () {
      alert(
        "Welcome to Eventsphere! Discover and join exciting events happening around you."
      );
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Form validation
  const forms = document.querySelectorAll(".needs-validation");
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

  // Password strength indicator
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm_password");

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const password = this.value;
      let strength = 0;

      if (password.length >= 8) strength += 1;
      if (password.match(/[a-z]+/)) strength += 1;
      if (password.match(/[A-Z]+/)) strength += 1;
      if (password.match(/[0-9]+/)) strength += 1;
      if (password.match(/[^a-zA-Z0-9]+/)) strength += 1;

      const strengthBar = document.querySelector(".password-strength");
      if (strengthBar) {
        strengthBar.className = "password-strength progress-bar";

        if (strength <= 2) {
          strengthBar.classList.add("bg-danger");
          strengthBar.style.width = "33%";
          strengthBar.textContent = "Weak";
        } else if (strength <= 4) {
          strengthBar.classList.add("bg-warning");
          strengthBar.style.width = "66%";
          strengthBar.textContent = "Medium";
        } else {
          strengthBar.classList.add("bg-success");
          strengthBar.style.width = "100%";
          strengthBar.textContent = "Strong";
        }
      }
    });
  }

  // Password confirmation validation
  if (passwordInput && confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", function () {
      if (this.value !== passwordInput.value) {
        this.setCustomValidity("Passwords do not match");
      } else {
        this.setCustomValidity("");
      }
    });
  }

  // Initialize dark mode
  initDarkMode();
});

// Dark mode functionality
function initDarkMode() {
  // Check for saved theme preference or use the system preference
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    updateThemeIcon(true);
  } else {
    document.documentElement.setAttribute("data-bs-theme", "light");
    updateThemeIcon(false);
  }

  // Add event listener to theme toggle button
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

function toggleTheme() {
  const isDarkMode =
    document.documentElement.getAttribute("data-bs-theme") === "dark";

  if (isDarkMode) {
    document.documentElement.setAttribute("data-bs-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("theme", "dark");
  }

  updateThemeIcon(!isDarkMode);
}

function updateThemeIcon(isDarkMode) {
  const themeIcon = document.getElementById("theme-icon");
  if (themeIcon) {
    if (isDarkMode) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }
}

// TAILWIND CONFIGURATION
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        slideInUp: "slideInUp 0.6s ease-out",
        fadeIn: "fadeIn 0.8s ease-out",
        shake: "shake 0.5s ease-in-out",
        success: "success 0.6s ease-out",
        gradient: "gradient 3s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" },
          "100%": { boxShadow: "0 0 30px rgba(59, 130, 246, 0.8)" },
        },
        slideInUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        success: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
};

// CONFIGURATION & CONSTANTS

const API_BASE_URL = "http://localhost:5000/api";

// AUTHENTICATION STATUS CHECK

/**
 * Check if user is already authenticated and redirect to dashboard
 * This prevents logged-in users from seeing the login page
 */
function checkAuthStatus() {
  const token = localStorage.getItem("token");
  if (token) {
    // Verify token is still valid by making a quick API call
    fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "dashboard.html";
        } else {
          // Token is invalid, remove it
          localStorage.removeItem("token");
        }
      })
      .catch((error) => {
        console.error("Token verification failed:", error);
        // Keep user on login page if verification fails
      });
  }
}

// DARK MODE FUNCTIONALITY

/**
 * Initialize and enforce dark mode permanently
 */
function initDarkMode() {
  // Always enable dark mode
  document.documentElement.classList.add("dark");
  // Remove any light mode preference from localStorage
  localStorage.setItem("theme", "dark");
}

// EVENT LISTENERS SETUP

function setupEventListeners() {
  // Form switching
  const showSignupBtn = document.getElementById("showSignup");
  const showLoginBtn = document.getElementById("showLogin");

  if (showSignupBtn) {
    showSignupBtn.addEventListener("click", switchToSignup);
  }

  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", switchToLogin);
  }

  // Password visibility toggles
  const toggleLoginPassword = document.getElementById("toggleLoginPassword");
  const toggleSignupPassword = document.getElementById("toggleSignupPassword");

  if (toggleLoginPassword) {
    toggleLoginPassword.addEventListener("click", () => {
      togglePasswordVisibility("loginPassword", "toggleLoginPassword");
    });
  }

  if (toggleSignupPassword) {
    toggleSignupPassword.addEventListener("click", () => {
      togglePasswordVisibility("signupPassword", "toggleSignupPassword");
    });
  }

  // Form submissions
  const loginFormElement = document.getElementById("loginFormElement");
  const signupFormElement = document.getElementById("signupFormElement");

  if (loginFormElement) {
    loginFormElement.addEventListener("submit", handleLogin);
  }

  if (signupFormElement) {
    signupFormElement.addEventListener("submit", handleSignup);
  }
}

// FORM SWITCHING ANIMATIONS

function switchToSignup() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  loginForm.style.animation = "slideInUp 0.4s ease-out reverse";
  setTimeout(() => {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    signupForm.style.animation = "slideInUp 0.4s ease-out";
  }, 200);
}

// Switch from signup to login form with smooth animation

function switchToLogin() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  signupForm.style.animation = "slideInUp 0.4s ease-out reverse";
  setTimeout(() => {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    loginForm.style.animation = "slideInUp 0.4s ease-out";
  }, 200);
}

// PASSWORD VISIBILITY TOGGLE

/**
 * Toggle password field visibility
 * @param {string} inputId - ID of password input field
 * @param {string} buttonId - ID of toggle button
 */
function togglePasswordVisibility(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  if (!input || !button) return;

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "🙈";
    button.style.animation = "success 0.3s ease-out";
  } else {
    input.type = "password";
    button.textContent = "👁️";
    button.style.animation = "success 0.3s ease-out";
  }
}

// ALERT SYSTEM

/**
 * Display alert messages with animations
 * @param {string} elementId - ID of alert container
 * @param {string} message - Message to display
 * @param {string} type - Alert type ('error' or 'success')
 */
function showAlert(elementId, message, type = "error") {
  const alertElement = document.getElementById(elementId);
  if (!alertElement) return;

  const styles = {
    error: "bg-red-500/20 text-red-200 border-red-500/30 backdrop-blur-md",
    success:
      "bg-green-500/20 text-green-200 border-green-500/30 backdrop-blur-md",
  };

  alertElement.className = `mb-6 p-4 rounded-2xl ${styles[type]} animate-slideInUp`;
  alertElement.textContent = message;
  alertElement.classList.remove("hidden");

  // Auto-hide alert after 5 seconds
  setTimeout(() => {
    alertElement.style.animation = "fadeIn 0.3s ease-out reverse";
    setTimeout(() => {
      alertElement.classList.add("hidden");
    }, 300);
  }, 5000);
}

// LOADING STATE MANAGEMENT

/**
 * Toggle loading state for form buttons
 * @param {string} buttonId - ID of button element
 * @param {string} spinnerId - ID of spinner element
 * @param {string} textId - ID of button text element
 * @param {boolean} isLoading - Whether to show loading state
 */
function toggleLoading(buttonId, spinnerId, textId, isLoading) {
  const button = document.getElementById(buttonId);
  const spinner = document.getElementById(spinnerId);
  const text = document.getElementById(textId);

  if (!button || !spinner || !text) return;

  if (isLoading) {
    button.disabled = true;
    button.style.animation = "glow 1s ease-in-out infinite alternate";
    spinner.classList.remove("hidden");
    text.textContent = "Please wait...";
  } else {
    button.disabled = false;
    button.style.animation = "";
    spinner.classList.add("hidden");
    text.textContent = buttonId.includes("login") ? "Sign In" : "Sign Up";
  }
}

// LOGIN FUNCTIONALITY

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  // Basic validation
  if (!email || !password) {
    showAlert("alertMessage", "Please fill in all fields");
    document.getElementById("loginFormElement").style.animation =
      "shake 0.5s ease-in-out";
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert("alertMessage", "Please enter a valid email address");
    document.getElementById("loginFormElement").style.animation =
      "shake 0.5s ease-in-out";
    return;
  }

  toggleLoading("loginBtn", "loginSpinner", "loginBtnText", true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.token) {
      // Store authentication token securely
      localStorage.setItem("token", data.token);

      // Store user info if provided
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      showAlert("alertMessage", "Login successful! 🎉", "success");

      // Success animation
      document.getElementById("loginBtn").style.animation =
        "success 0.6s ease-out";

      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      showAlert("alertMessage", data.message || "Login failed");
      document.getElementById("loginFormElement").style.animation =
        "shake 0.5s ease-in-out";
    }
  } catch (error) {
    console.error("Login error:", error);
    showAlert(
      "alertMessage",
      "Network error. Please check if the server is running."
    );
    document.getElementById("loginFormElement").style.animation =
      "shake 0.5s ease-in-out";
  } finally {
    toggleLoading("loginBtn", "loginSpinner", "loginBtnText", false);
  }
}

// SIGNUP FUNCTIONALITY

/**
 * Handle signup form submission
 * @param {Event} e - Form submit event
 */
async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  // Basic validation
  if (!name || !email || !password) {
    showAlert("signupAlertMessage", "Please fill in all fields");
    document.getElementById("signupFormElement").style.animation =
      "shake 0.5s ease-in-out";
    return;
  }

  // Name validation
  if (name.length < 3) {
    showAlert("signupAlertMessage", "Name must be at least 3 characters long");
    document.getElementById("signupFormElement").style.animation =
      "shake 0.5s ease-in-out";
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert("signupAlertMessage", "Please enter a valid email address");
    document.getElementById("signupFormElement").style.animation =
      "shake 0.5s ease-in-out";
    return;
  }

  // Password strength validation
  if (password.length < 6) {
    showAlert(
      "signupAlertMessage",
      "Password must be at least 6 characters long"
    );
    document.getElementById("signupFormElement").style.animation =
      "shake 0.5s ease-in-out";
    return;
  }

  toggleLoading("signupBtn", "signupSpinner", "signupBtnText", true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      showAlert(
        "signupAlertMessage",
        "Account created successfully! 🌟",
        "success"
      );

      // Success animation
      document.getElementById("signupBtn").style.animation =
        "success 0.6s ease-out";

      // Clear form
      document.getElementById("signupFormElement").reset();

      // Switch to login form after success
      setTimeout(() => {
        switchToLogin();
        // Pre-fill email in login form
        setTimeout(() => {
          document.getElementById("loginEmail").value = email;
        }, 300);
      }, 1500);
    } else {
      let errorMessage = data.message || "Registration failed";

      // Handle validation errors from backend
      if (data.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors
          .map((err) => err.msg || err.message || err)
          .join(", ");
      }

      showAlert("signupAlertMessage", errorMessage);
      document.getElementById("signupFormElement").style.animation =
        "shake 0.5s ease-in-out";
    }
  } catch (error) {
    console.error("Signup error:", error);
    showAlert(
      "signupAlertMessage",
      "Network error. Please check if the server is running."
    );
    document.getElementById("signupFormElement").style.animation =
      "shake 0.5s ease-in-out";
  } finally {
    toggleLoading("signupBtn", "signupSpinner", "signupBtnText", false);
  }
}

// INITIALIZATION

function initializeApp() {
  initDarkMode();
  setupEventListeners();
  checkAuthStatus();
}

document.addEventListener("DOMContentLoaded", initializeApp);

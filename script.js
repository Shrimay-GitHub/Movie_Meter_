// Dynamic API URL based on environment
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
    : '/api';
let movies = [];

// Declare global functions for inline event handlers
window.handleImageLoad = handleImageLoad;
window.handleImageError = handleImageError;
window.login = login;
window.signup = signup;
window.logout = logout;
window.rateMovie = rateMovie;
window.filterMovies = filterMovies;

// Health check and connection validation
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const health = await response.json();
            console.log('Server health:', health.status);
            return true;
        } else {
            console.error('Server health check failed:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Server connection error:', error);
        return false;
    }
}

// Image loading helper functions
function handleImageLoad(imgElement) {
    // Add loaded class to image
    imgElement.classList.add('loaded');
    
    // Add loaded class to parent container to hide loading spinner
    const container = imgElement.closest('.image-container');
    if (container) {
        container.classList.add('loaded');
    }
    
    // Fade in the image smoothly
    imgElement.style.opacity = '1';
    
    // Get movie title for logging
    const movieTitle = imgElement.closest('.movie-card')?.querySelector('.movie-title')?.textContent || 'Unknown';
    console.log(`✅ Image loaded successfully: ${movieTitle}`);
}

function handleImageError(imgElement, movieTitle) {
    console.log('Image failed to load:', imgElement.src);
    
    // Try alternative image URLs if main fails
    const currentSrc = imgElement.src;
    
    // If it's not already a placeholder, try the alternative sizes
    if (!currentSrc.includes('via.placeholder.com')) {
        // Try w300 instead of w500
        if (currentSrc.includes('w500')) {
            const altSrc = currentSrc.replace('w500', 'w300');
            console.log('Trying alternative size:', altSrc);
            imgElement.src = altSrc;
            return; // Don't fallback to placeholder yet
        }
        
        // Try original size
        if (currentSrc.includes('w300')) {
            const originalSrc = currentSrc.replace('w300', 'original');
            console.log('Trying original size:', originalSrc);
            imgElement.src = originalSrc;
            return; // Don't fallback to placeholder yet
        }
    }
    
    // All alternatives failed, use placeholder
    console.log('All image sources failed, using placeholder');
    
    // Remove any loading states
    imgElement.classList.remove('loading');
    const container = imgElement.closest('.image-container');
    if (container) {
        container.classList.add('loaded');
    }
    
    // Set placeholder image with better styling
    imgElement.onerror = null; // Prevent infinite loop
    imgElement.src = `https://via.placeholder.com/300x450/2a2a2a/ffffff?text=${movieTitle.replace(/\s+/g, '%20')}`;
    imgElement.classList.add('placeholder-image');
    imgElement.style.opacity = '1';
    imgElement.alt = `${movieTitle} - Poster not available`;
}

function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const loginBtn = document.getElementById("login-btn");
    const errorMsg = document.getElementById("error-msg");

    // Hide previous errors
    errorMsg.style.display = "none";

    if (username === "" || password === "") {
        showError("error-msg", "Please enter both username and password!");
        return;
    }

    // Show loading state
    loginBtn.classList.add("loading");
    loginBtn.innerHTML = '<span>Signing In...</span>';
    loginBtn.disabled = true;

    try {
        console.log('Attempting login for username:', username);
        
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        console.log('Login response:', { status: response.status, ok: response.ok });

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            
            console.log('Login successful, token stored');
            
            // Success animation
            loginBtn.innerHTML = '<span>Success! Redirecting...</span>';
            loginBtn.style.background = 'linear-gradient(135deg, #ff6b35, #ff4500)';
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            console.log('Login failed:', data.error);
            showError("error-msg", data.error || "Login failed. Please check your credentials and try again.");
        }
    } catch (error) {
        console.error('Login error:', error);
        showError("error-msg", "Network error. Please check your connection and try again.");
    } finally {
        // Reset button state if there was an error
        if (!localStorage.getItem("token")) {
            loginBtn.classList.remove("loading");
            loginBtn.innerHTML = '<span>Sign In</span>';
            loginBtn.disabled = false;
        }
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

async function loadMovies() {
    if (!checkAuth()) return;

    const loadingScreen = document.getElementById("loading-screen");
    const moviesContainer = document.getElementById("movies-container");
    const welcomeUser = document.getElementById("welcome-user");
    
    // Show loading screen
    if (loadingScreen) {
        loadingScreen.style.display = "flex";
    }
    
    // Display username in navbar
    const username = localStorage.getItem("username");
    if (welcomeUser && username) {
        welcomeUser.textContent = `Welcome, ${username}!`;
    }

    try {
        const token = localStorage.getItem("token");
        const timestamp = new Date().getTime(); // Cache busting
        const response = await fetch(`${API_BASE_URL}/movies?t=${timestamp}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        });

        if (response.ok) {
            movies = await response.json();
            console.log(`Loaded ${movies.length} movies successfully`);
            
            // Hide loading screen
            if (loadingScreen) {
                loadingScreen.style.display = "none";
            }
            
            await displayMovies();
        } else {
            console.error('Failed to load movies:', response.status, response.statusText);
            if (response.status === 401) {
                showNotification("Session expired. Please login again.", "error");
                logout();
            } else {
                showNotification("Failed to load movies. Please try again.", "error");
            }
        }
    } catch (error) {
        console.error('Error loading movies:', error);
        if (loadingScreen) {
            loadingScreen.style.display = "none";
        }
        showNotification("Network error. Please check your connection.", "error");
    }
}

async function displayMovies() {
    allMovies = movies; // Store all movies for filtering
    await displayFilteredMovies(allMovies); // Use the new filtering function
}



async function getUserRating(movieId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/ratings/${movieId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.rating;
        }
        return 0;
    } catch (error) {
        console.error('Error getting user rating:', error);
        return 0;
    }
}

async function signup() {
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const dob = document.getElementById("signup-dob").value;
    const phone = document.getElementById("signup-phone").value.trim();
    const signupBtn = document.getElementById("signup-btn");
    const errorMsg = document.getElementById("signup-error-msg");

    // Hide previous errors
    errorMsg.style.display = "none";

    if (!username || !email || !password || !dob || !phone) {
        showError("signup-error-msg", "Please fill out all fields!");
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError("signup-error-msg", "Please enter a valid email address!");
        return;
    }

    // Password strength check
    if (password.length < 6) {
        showError("signup-error-msg", "Password must be at least 6 characters long!");
        return;
    }

    // Show loading state
    signupBtn.classList.add("loading");
    signupBtn.innerHTML = '<span>Creating Account...</span>';
    signupBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, dob, phone })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            
            // Success animation
            signupBtn.innerHTML = '<span>Account Created! Redirecting...</span>';
            signupBtn.style.background = 'linear-gradient(135deg, #00b894, #00a085)';
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            showError("signup-error-msg", data.error || "Signup failed. Please try again.");
        }
    } catch (error) {
        showError("signup-error-msg", "Network error. Please check your connection and try again.");
        console.error('Signup error:', error);
    } finally {
        // Reset button state if there was an error
        if (!localStorage.getItem("token")) {
            signupBtn.classList.remove("loading");
            signupBtn.innerHTML = '<span>Create Account</span>';
            signupBtn.disabled = false;
        }
    }
}

// Page initialization with health check
if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
    // Check server health before loading movies
    checkServerHealth().then(isHealthy => {
        if (isHealthy) {
            loadMovies();
        } else {
            const loadingScreen = document.getElementById("loading-screen");
            if (loadingScreen) {
                loadingScreen.style.display = "none";
            }
            showNotification("Server is currently unavailable. Please try again later.", "error");
        }
    });
}

if (window.location.pathname.includes("signup.html")) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
}

// Movie filtering and search functionality
let allMovies = []; // Store all movies for filtering

function filterMovies() {
    const searchTerm = document.getElementById('movie-search')?.value.toLowerCase() || '';
    const yearFilter = document.getElementById('year-filter')?.value || '';
    
    let filteredMovies = allMovies.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchTerm);
        
        let yearMatch = true;
        if (yearFilter) {
            const releaseYear = parseInt(movie.release);
            switch(yearFilter) {
                case '2020s': yearMatch = releaseYear >= 2020; break;
                case '2010s': yearMatch = releaseYear >= 2010 && releaseYear < 2020; break;
                case '2000s': yearMatch = releaseYear >= 2000 && releaseYear < 2010; break;
                case '1990s': yearMatch = releaseYear >= 1990 && releaseYear < 2000; break;
                case '1980s': yearMatch = releaseYear >= 1980 && releaseYear < 1990; break;
                case '1970s': yearMatch = releaseYear >= 1970 && releaseYear < 1980; break;
            }
        }
        
        return titleMatch && yearMatch;
    });
    
    displayFilteredMovies(filteredMovies);
}

async function displayFilteredMovies(moviesToShow) {
    const container = document.getElementById("movies-container");
    container.innerHTML = "";
    
    if (moviesToShow.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>🎬 No movies found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    for (let i = 0; i < moviesToShow.length; i++) {
        const movie = moviesToShow[i];
        const userRating = await getUserRating(movie._id);
        const displayRating = userRating || movie.defaultRating;
        
        let stars = "";
        for (let j = 1; j <= 5; j++) {
            const filled = j <= displayRating ? "★" : "☆";
            stars += `<span class="star" onclick="rateMovie('${movie._id}', ${j})" title="Rate ${j} star${j > 1 ? 's' : ''}">${filled}</span>`;
        }

        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card slide-up';
        movieCard.style.animationDelay = `${i * 0.05}s`; // Faster animation for filtering
        movieCard.dataset.movieId = movie._id;
        
        movieCard.innerHTML = `
            <div class="image-container">
                <img src="${movie.img}" 
                     alt="${movie.title} poster" 
                     loading="lazy"
                     decoding="async"
                     onerror="handleImageError(this, '${encodeURIComponent(movie.title)}');"
                     onload="handleImageLoad(this);">
                <div class="image-overlay">
                    <span class="view-details">★ ${displayRating.toFixed(1)}</span>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <span>📅 ${movie.release}</span>
                    <span>⭐ ${displayRating.toFixed(1)}</span>
                </div>
            </div>
            <div class="rating-section">
                <div class="rating-label">Your Rating</div>
                <div class="rating">${stars}</div>
            </div>
        `;
        
        container.appendChild(movieCard);
        
        // Add small delay for staggered animation
        await new Promise(resolve => setTimeout(resolve, 20));
    }
}

// Utility Functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
        errorElement.style.animation = "slideUp 0.3s ease-out";
    }
}

// Enhanced notification system with better positioning and animations
function showNotification(message, type = "info") {
    // Remove existing notifications to prevent stacking
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: ${type === "error" ? "rgba(255, 107, 107, 0.95)" : 
                    type === "success" ? "rgba(0, 184, 148, 0.95)" : 
                    "rgba(116, 185, 255, 0.95)"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        z-index: 10000;
        animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        max-width: 350px;
        word-wrap: break-word;
        font-weight: 500;
        border: 1px solid ${type === "error" ? "rgba(255, 107, 107, 0.3)" : 
                           type === "success" ? "rgba(0, 184, 148, 0.3)" : 
                           "rgba(116, 185, 255, 0.3)"};
    `;
    
    // Add icon based on type
    const icon = type === "error" ? "⚠️" : type === "success" ? "✅" : "ℹ️";
    notification.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${message}`;
    
    document.body.appendChild(notification);
    
    // Auto-remove notification
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = "slideOutRight 0.4s ease-in";
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }
    }, 4000);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = "slideOutRight 0.3s ease-in";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Add CSS animations for notifications
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance and user experience optimizations
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 MovieMeter: DOM Content Loaded');
    
    // Force refresh logos to show new design
    const logos = document.querySelectorAll('img[src*="logo.svg"]');
    logos.forEach(logo => {
        const currentSrc = logo.src;
        if (!currentSrc.includes('?v=')) {
            logo.src = currentSrc.includes('?') ? currentSrc + '&v=2024' : currentSrc + '?v=2024';
        }
    });
    
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Check if we're on a secure connection
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        console.warn('⚠️ Consider using HTTPS for better security');
    }
    
    // Remove loading class after everything is loaded
    window.addEventListener('load', function() {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        console.log('✅ MovieMeter: All resources loaded');
    });
    
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Log app version and environment info
    console.log('🎬 MovieMeter v1.0.0 - Ready!');
    console.log('📍 Environment:', {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
    });
    
    // Monitor network status
    window.addEventListener('online', function() {
        console.log('📶 Network: Back online');
        showNotification('📶 Connection restored!', 'success');
    });
    
    window.addEventListener('offline', function() {
        console.log('⚠️ Network: Gone offline');
        showNotification('⚠️ No internet connection', 'error');
    });
});

// Enhanced keyboard navigation
document.addEventListener('keydown', function(event) {
    // Enter key for login/signup forms
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT') {
            if (window.location.pathname.includes('login.html')) {
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn && !loginBtn.disabled) {
                    event.preventDefault();
                    login();
                }
            } else if (window.location.pathname.includes('signup.html')) {
                const signupBtn = document.getElementById('signup-btn');
                if (signupBtn && !signupBtn.disabled) {
                    event.preventDefault();
                    signup();
                }
            }
        }
    }
    
    // Escape key to clear error messages and close notifications
    if (event.key === 'Escape') {
        const errorMsg = document.getElementById('error-msg');
        const signupErrorMsg = document.getElementById('signup-error-msg');
        const notifications = document.querySelectorAll('.notification');
        
        if (errorMsg) errorMsg.style.display = 'none';
        if (signupErrorMsg) signupErrorMsg.style.display = 'none';
        notifications.forEach(notification => notification.click());
    }
    
    // Number keys for quick rating (1-5)
    if (event.key >= '1' && event.key <= '5' && !event.target.matches('input')) {
        const hoveredCard = document.querySelector('.movie-card:hover');
        if (hoveredCard) {
            const movieId = hoveredCard.dataset.movieId;
            if (movieId) {
                const rating = parseInt(event.key);
                rateMovie(movieId, rating);
            }
        }
    }
});

// Add loading screen animation

// Enhanced rating with visual feedback and optimistic updates
async function rateMovie(movieId, rating) {
    try {
        // Optimistic UI update - update stars immediately
        const movieCard = event.target.closest('.movie-card');
        const stars = movieCard.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.textContent = (index + 1) <= rating ? '★' : '☆';
            star.style.color = (index + 1) <= rating ? '#ffd700' : '#ffd700';
        });
        
        // Add visual feedback to clicked star
        event.target.style.transform = 'scale(1.5) rotate(360deg)';
        event.target.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            event.target.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
        
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ movieId, rating })
        });

        if (response.ok) {
            const movieTitle = movieCard.querySelector('.movie-title').textContent;
            showNotification(`⭐ Rated "${movieTitle}" ${rating} star${rating > 1 ? 's' : ''}!`, "success");
            
            // Update the display rating in the movie details
            const ratingDisplay = movieCard.querySelector('.movie-details span:last-child');
            if (ratingDisplay) {
                ratingDisplay.textContent = `⭐ ${rating.toFixed(1)}`;
            }
            
            // Add success animation to the card
            movieCard.style.transform = 'scale(1.02)';
            movieCard.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.4)';
            
            setTimeout(() => {
                movieCard.style.transform = 'scale(1)';
                movieCard.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
            }, 500);
            
        } else {
            console.error('Failed to submit rating');
            // Revert optimistic update
            await displayMovies();
            
            if (response.status === 401) {
                logout();
            } else {
                showNotification("⚠️ Failed to submit rating. Please try again.", "error");
            }
        }
    } catch (error) {
        console.error('Error submitting rating:', error);
        // Revert optimistic update
        await displayMovies();
        showNotification("⚠️ Network error. Please try again.", "error");
    }
}

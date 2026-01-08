// Customer Dashboard JavaScript

// Check authentication
const userData = Storage.get('karyasetu_user');
const userProfile = Storage.get('karyasetu_user_profile');
const userRole = localStorage.getItem('karyasetu_user_role');

if (!userData || !userData.loggedIn) {
    window.location.href = '../auth/login.html';
}

// Verify this is a customer
if (userRole !== 'customer') {
    window.location.href = '../dashboard/worker-dashboard.html';
}

if (!userProfile) {
    window.location.href = '../onboarding/customer-about.html';
}

// Update user info in sidebar
document.getElementById('userName').textContent = userData.name || 'User';
document.getElementById('userRole').textContent = 'Customer';

// Sidebar functionality
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarToggle = document.getElementById('sidebarToggle');

mobileMenuBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Navigation
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const contentArea = document.getElementById('contentArea');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        loadPage(page);

        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Close sidebar on mobile
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showConfirm('Are you sure you want to logout?', () => {
        Storage.clear();
        window.location.href = '../index.html';
    });
});

// Page loader function
async function loadPage(pageName) {
    showLoading('Loading...');

    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const pageContent = getPageContent(pageName);
        contentArea.innerHTML = pageContent;
        initializePage(pageName);
        hideLoading();
    } catch (error) {
        console.error('Error loading page:', error);
        contentArea.innerHTML = `
      <div class="error-state">
        <h2>Error Loading Page</h2>
        <p>Something went wrong. Please try again.</p>
        <button class="btn btn-primary" onclick="location.reload()">Reload</button>
      </div>
    `;
        hideLoading();
    }
}

// Get page content
function getPageContent(pageName) {
    const pages = {
        'profile': getProfilePage(),
        'mechanic': getServicePage('Mechanic', '🔧'),
        'plumber': getServicePage('Plumber', '🚰'),
        'electrician': getServicePage('Electrician', '⚡'),
        'carpenter': getServicePage('Carpenter', '🪚'),
        'painter': getServicePage('Painter', '🎨'),
        'tailor': getServicePage('Tailor', '🧵'),
        'driver': getServicePage('Driver', '🚗'),
        'cleaner': getServicePage('Cleaner', '🧹'),
        'home-appliances': getHomeAppliancesPage(),
        'radar': getRadarPage(),
        'my-bookings': getMyBookingsPage(),
        'favorites': getFavoritesPage(),
        'wallet': getWalletPage(),
        'support': getSupportPage(),
        'settings': getSettingsPage()
    };

    return pages[pageName] || getCustomerHomePage();
}

// Customer Home Page
function getCustomerHomePage() {
    return `
    <div class="dashboard-home">
      <!-- Welcome Header -->
      <div class="dashboard-welcome">
        <div class="welcome-content">
          <h1>Welcome back, <span id="dashboardUserName">${userData.name || 'User'}</span>! 👋</h1>
          <p>Find skilled workers for your needs today</p>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-primary" onclick="loadPage('mechanic')">
            <span>Book Service</span>
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card stat-primary">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-label">Active Bookings</div>
            <div class="stat-value" id="activeBookings">0</div>
            <div class="stat-change positive">+2 this week</div>
          </div>
        </div>

        <div class="stat-card stat-success">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-label">Completed</div>
            <div class="stat-value" id="completedJobs">0</div>
            <div class="stat-change positive">+5 this month</div>
          </div>
        </div>

        <div class="stat-card stat-warning">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-label">Wallet Balance</div>
            <div class="stat-value">₹<span id="walletBalance">0</span></div>
            <div class="stat-change neutral">Click to add funds</div>
          </div>
        </div>

        <div class="stat-card stat-info">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-label">Favorites</div>
            <div class="stat-value" id="favoriteCount">0</div>
            <div class="stat-change positive">Saved workers</div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Quick Services -->
        <div class="dashboard-card quick-services-card">
          <div class="card-header">
            <h2>Quick Services</h2>
            <button class="btn-text" onclick="showToast('View all services', 'info')">View All</button>
          </div>
          <div class="quick-services-grid">
            <div class="service-quick-item" data-page="mechanic">
              <div class="service-quick-icon">🔧</div>
              <div class="service-quick-name">Mechanic</div>
            </div>
            <div class="service-quick-item" data-page="plumber">
              <div class="service-quick-icon">🚰</div>
              <div class="service-quick-name">Plumber</div>
            </div>
            <div class="service-quick-item" data-page="electrician">
              <div class="service-quick-icon">⚡</div>
              <div class="service-quick-name">Electrician</div>
            </div>
            <div class="service-quick-item" data-page="carpenter">
              <div class="service-quick-icon">🪚</div>
              <div class="service-quick-name">Carpenter</div>
            </div>
            <div class="service-quick-item" data-page="painter">
              <div class="service-quick-icon">🎨</div>
              <div class="service-quick-name">Painter</div>
            </div>
            <div class="service-quick-item" data-page="cleaner">
              <div class="service-quick-icon">🧹</div>
              <div class="service-quick-name">Cleaner</div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="dashboard-card activity-card">
          <div class="card-header">
            <h2>Recent Activity</h2>
            <button class="btn-text" onclick="loadPage('my-bookings')">View All</button>
          </div>
          <div class="activity-list" id="activityList">
            <div class="activity-item">
              <div class="activity-icon activity-success">✓</div>
              <div class="activity-content">
                <div class="activity-title">Plumbing job completed</div>
                <div class="activity-time">2 hours ago</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon activity-info">📋</div>
              <div class="activity-content">
                <div class="activity-title">New booking confirmed</div>
                <div class="activity-time">5 hours ago</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon activity-warning">💰</div>
              <div class="activity-content">
                <div class="activity-title">Payment processed ₹500</div>
                <div class="activity-time">1 day ago</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Nearby Workers -->
        <div class="dashboard-card nearby-card">
          <div class="card-header">
            <h2>📍 Nearby Workers</h2>
            <button class="btn-text" onclick="loadPage('radar')">View Map</button>
          </div>
          <div class="nearby-list" id="nearbyWorkers">
            <div class="nearby-worker">
              <div class="nearby-worker-avatar">🔧</div>
              <div class="nearby-worker-info">
                <div class="nearby-worker-name">Rajesh Kumar</div>
                <div class="nearby-worker-meta">Mechanic • 1.2 km away</div>
              </div>
              <div class="nearby-worker-rating">⭐ 4.8</div>
            </div>
            <div class="nearby-worker">
              <div class="nearby-worker-avatar">⚡</div>
              <div class="nearby-worker-info">
                <div class="nearby-worker-name">Amit Singh</div>
                <div class="nearby-worker-meta">Electrician • 2.5 km away</div>
              </div>
              <div class="nearby-worker-rating">⭐ 4.9</div>
            </div>
            <div class="nearby-worker">
              <div class="nearby-worker-avatar">🚰</div>
              <div class="nearby-worker-info">
                <div class="nearby-worker-name">Suresh Patel</div>
                <div class="nearby-worker-meta">Plumber • 3.1 km away</div>
              </div>
              <div class="nearby-worker-rating">⭐ 4.7</div>
            </div>
          </div>
        </div>

        <!-- Trending Services -->
        <div class="dashboard-card trending-card">
          <div class="card-header">
            <h2>🔥 Trending Now</h2>
          </div>
          <div class="trending-list">
            <div class="trending-item" onclick="loadPage('mechanic')">
              <div class="trending-info">
                <span class="trending-rank">#1</span>
                <span class="trending-name">Vehicle Repair</span>
              </div>
              <div class="trending-badge">Hot</div>
            </div>
            <div class="trending-item" onclick="loadPage('electrician')">
              <div class="trending-info">
                <span class="trending-rank">#2</span>
                <span class="trending-name">Electrical Work</span>
              </div>
              <div class="trending-badge">Popular</div>
            </div>
            <div class="trending-item" onclick="loadPage('plumber')">
              <div class="trending-info">
                <span class="trending-rank">#3</span>
                <span class="trending-name">Plumbing Services</span>
              </div>
              <div class="trending-badge">Rising</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Profile page
function getProfilePage() {
    const profile = userProfile || {};
    const user = userData || {};

    return `
    <div class="page-header">
      <h1 class="page-title">My Profile</h1>
      <p class="page-subtitle">Manage your account information</p>
    </div>
    
    <div class="profile-container">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Personal Information</h2>
        </div>
        <div class="profile-info">
          <div class="info-item">
            <label>Name</label>
            <p>${user.name || 'Not set'}</p>
          </div>
          <div class="info-item">
            <label>Phone</label>
            <p>${user.phone || 'Not set'}</p>
          </div>
          <div class="info-item">
            <label>Email</label>
            <p>${user.email || 'Not set'}</p>
          </div>
          <div class="info-item">
            <label>Role</label>
            <p style="text-transform: capitalize;">Customer</p>
          </div>
          <div class="info-item">
            <label>Location</label>
            <p>${profile.location || 'Not set'}</p>
          </div>
          <div class="info-item">
            <label>Address</label>
            <p>${profile.address || 'Not set'}</p>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary" onclick="showToast('Edit feature coming soon!', 'info')">Edit Profile</button>
        </div>
      </div>
    </div>
  `;
}

// Service page template
function getServicePage(serviceName, icon) {
    const workers = generateMockWorkers(serviceName);

    return `
    <div class="page-header">
      <h1 class="page-title">${icon} ${serviceName} Services</h1>
      <p class="page-subtitle">Find verified ${serviceName.toLowerCase()}s near you</p>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showBookingModal('${serviceName}')">
          <span>Book ${serviceName}</span>
        </button>
        <button class="btn btn-secondary" onclick="showToast('Filter feature coming soon!', 'info')">
          <span>Filters</span>
        </button>
      </div>
    </div>
    
    <div class="workers-grid">
      ${workers.map(worker => `
        <div class="worker-card">
          <div class="worker-header">
            <div class="worker-avatar">${icon}</div>
            <div class="worker-info">
              <h3>${worker.name}</h3>
              <div class="worker-rating">
                <span>⭐ ${worker.rating}</span>
                <span>(${worker.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <div class="worker-details">
            <div class="worker-detail-item">
              <span>📍</span>
              <span>${worker.location} • ${worker.distance}</span>
            </div>
            <div class="worker-detail-item">
              <span>💼</span>
              <span>${worker.experience} experience</span>
            </div>
            <div class="worker-detail-item">
              <span>💰</span>
              <span>₹${worker.rate}/hour</span>
            </div>
            <div class="worker-detail-item">
              <span>✓</span>
              <span>${worker.jobsCompleted} jobs completed</span>
            </div>
          </div>
          
          <div class="worker-actions">
            <button class="btn btn-primary" onclick="bookWorker('${worker.id}', '${worker.name}')">Book Now</button>
            <button class="btn btn-secondary" onclick="viewWorkerProfile('${worker.id}')">View Profile</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Generate mock workers
function generateMockWorkers(service) {
    const names = ['Rajesh Kumar', 'Amit Singh', 'Suresh Patel', 'Vijay Sharma', 'Ramesh Gupta', 'Prakash Yadav'];
    const locations = ['Andheri', 'Bandra', 'Powai', 'Thane', 'Navi Mumbai', 'Borivali'];

    return Array.from({ length: 6 }, (_, i) => ({
        id: generateId(),
        name: names[i],
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(Math.random() * 100) + 20,
        location: locations[i],
        distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
        experience: `${Math.floor(Math.random() * 8) + 2} years`,
        rate: Math.floor(Math.random() * 200) + 150,
        jobsCompleted: Math.floor(Math.random() * 200) + 50
    }));
}

// Home Appliances page
function getHomeAppliancesPage() {
    return `
    <div class="page-header">
      <h1 class="page-title">🏠 Home Appliances Services</h1>
      <p class="page-subtitle">AC, Washing Machine, TV, Refrigerator repairs</p>
    </div>
    
    <div class="services-grid">
      ${['AC Repair', 'Washing Machine', 'TV Repair', 'Refrigerator'].map(service => `
        <div class="service-card" onclick="showToast('${service} service coming soon!', 'info')">
          <h3>${service}</h3>
          <p>Professional ${service.toLowerCase()} services</p>
          <button class="btn btn-primary btn-sm">View Services</button>
        </div>
      `).join('')}
    </div>
  `;
}

// Radar page
function getRadarPage() {
    return `
    <div class="page-header">
      <h1 class="page-title">📍 Nearby Workers</h1>
      <p class="page-subtitle">Find workers near your location</p>
    </div>
    
    <div class="map-container">
      <div class="map-placeholder">
        <p>🗺️ Map View</p>
        <p>Interactive map showing nearby workers would appear here</p>
        <button class="btn btn-primary" onclick="showToast('Map integration coming soon!', 'info')">Enable Location</button>
      </div>
    </div>
  `;
}

// My Bookings page
function getMyBookingsPage() {
    return `
    <div class="page-header">
      <h1 class="page-title">📋 My Bookings</h1>
      <p class="page-subtitle">Track your service bookings</p>
    </div>
    
    <div class="jobs-container">
      <div class="empty-state">
        <h3>No bookings yet</h3>
        <p>Start by booking a service</p>
        <button class="btn btn-primary" onclick="loadPage('mechanic')">Book a Service</button>
      </div>
    </div>
  `;
}

// Favorites page
function getFavoritesPage() {
    return `
    <div class="page-header">
      <h1 class="page-title">⭐ Favorite Workers</h1>
      <p class="page-subtitle">Your saved workers for quick access</p>
    </div>
    
    <div class="favorites-container">
      <div class="empty-state">
        <h3>No favorites yet</h3>
        <p>Save workers to quickly book them later</p>
        <button class="btn btn-primary" onclick="loadPage('mechanic')">Browse Workers</button>
      </div>
    </div>
  `;
}

// Wallet page
function getWalletPage() {
    return `
    <div class="page-header">
      <h1 class="page-title">💰 Wallet</h1>
      <p class="page-subtitle">Manage your payments and transactions</p>
    </div>
    
    <div class="wallet-container">
      <div class="card">
        <h2>Balance: ₹0</h2>
        <button class="btn btn-primary" onclick="showToast('Add money feature coming soon!', 'info')">Add Money</button>
      </div>
    </div>
  `;
}

// Support page
function getSupportPage() {
    return `
    <div class="page-header">
      <h1 class="page-title">🆘 Help & Support</h1>
      <p class="page-subtitle">We're here to help</p>
    </div>
    
    <div class="support-container">
      <div class="card">
        <h3>Emergency Support</h3>
        <button class="btn btn-error btn-lg">🚨 Report Issue</button>
        <p>24/7 Helpline: 1800-123-4567</p>
      </div>
    </div>
  `;
}

// Settings page
function getSettingsPage() {
    return `
    <div class="page-header">
      <h1 class="page-title">⚙️ Settings</h1>
      <p class="page-subtitle">Manage your preferences</p>
    </div>
    
    <div class="settings-container">
      <div class="card">
        <h3>Account Settings</h3>
        <button class="btn btn-secondary" onclick="showToast('Feature coming soon!', 'info')">Change Password</button>
        <button class="btn btn-secondary" onclick="showToast('Feature coming soon!', 'info')">Notification Preferences</button>
      </div>
    </div>
  `;
}

// Initialize page-specific functionality
function initializePage(pageName) {
    console.log(`Initialized page: ${pageName}`);

    // Re-attach event listeners for quick service items
    const serviceQuickItems = document.querySelectorAll('.service-quick-item');
    serviceQuickItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) {
                loadPage(page);
                navLinks.forEach(l => l.classList.remove('active'));
                const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// Booking modal
function showBookingModal(service) {
    showToast(`Booking ${service} - Feature coming soon!`, 'info');
}

// Book worker
function bookWorker(workerId, workerName) {
    showConfirm(`Book ${workerName}?`, () => {
        showToast('Booking confirmed!', 'success');
    });
}

// View worker profile
function viewWorkerProfile(workerId) {
    showToast('Worker profile - Feature coming soon!', 'info');
}

// Initialize - Load home page
document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');

    // Animate stat values
    setTimeout(() => {
        const activeBookingsEl = document.getElementById('activeBookings');
        const completedJobsEl = document.getElementById('completedJobs');
        const walletBalanceEl = document.getElementById('walletBalance');
        const favoriteCountEl = document.getElementById('favoriteCount');

        if (activeBookingsEl) animateCounter(activeBookingsEl, 0, 2, 1000);
        if (completedJobsEl) animateCounter(completedJobsEl, 0, 8, 1200);
        if (walletBalanceEl) animateCounter(walletBalanceEl, 0, 1250, 1500);
        if (favoriteCountEl) animateCounter(favoriteCountEl, 0, 5, 1000);
    }, 500);
});

// Counter animation helper
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (range * easeOutQuart));

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    }

    requestAnimationFrame(update);
}

console.log('Customer Dashboard initialized');

// ============================================
// WORKER DASHBOARD - COMPLETE IMPLEMENTATION
// ============================================

// ============================================
// AUTHENTICATION & INITIALIZATION
// ============================================

const userData = Storage.get('karyasetu_user');
const userProfile = Storage.get('karyasetu_user_profile');
const userRole = localStorage.getItem('karyasetu_user_role');

if (!userData || !userData.loggedIn) {
    window.location.href = '../auth/login.html';
}

if (userRole !== 'worker') {
    window.location.href = '../dashboard/customer-dashboard.html';
}

if (!userProfile) {
    window.location.href = '../onboarding/worker-about.html';
}

// Update user info
document.getElementById('userName').textContent = userData.name || 'Worker';
document.getElementById('userRole').textContent = 'Service Provider';

// ============================================
// DATA MANAGEMENT
// ============================================

// Initialize worker data in localStorage
function initializeWorkerData() {
    if (!Storage.get('worker_jobs')) {
        Storage.set('worker_jobs', generateMockJobs());
    }
    if (!Storage.get('worker_earnings')) {
        Storage.set('worker_earnings', generateMockEarnings());
    }
    if (!Storage.get('worker_reviews')) {
        Storage.set('worker_reviews', generateMockReviews());
    }
    if (!Storage.get('worker_availability')) {
        Storage.set('worker_availability', {
            isOnline: true,
            workingHours: {
                monday: { start: '09:00', end: '18:00', enabled: true },
                tuesday: { start: '09:00', end: '18:00', enabled: true },
                wednesday: { start: '09:00', end: '18:00', enabled: true },
                thursday: { start: '09:00', end: '18:00', enabled: true },
                friday: { start: '09:00', end: '18:00', enabled: true },
                saturday: { start: '10:00', end: '16:00', enabled: true },
                sunday: { start: '00:00', end: '00:00', enabled: false }
            }
        });
    }
}

// Generate mock job data
function generateMockJobs() {
    return {
        pending: [
            {
                id: 'job_001',
                title: 'Plumbing Repair',
                description: 'Kitchen sink is leaking, needs urgent repair',
                customer: { name: 'Priya Sharma', phone: '9876543210', location: 'Andheri West' },
                location: 'Andheri West, Mumbai',
                distance: '2.3 km',
                budget: { min: 500, max: 800 },
                scheduledDate: new Date(Date.now() + 86400000).toISOString(),
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                status: 'pending',
                urgency: 'high'
            },
            {
                id: 'job_002',
                title: 'Pipe Installation',
                description: 'New bathroom pipe installation required',
                customer: { name: 'Rahul Verma', phone: '9123456789', location: 'Bandra East' },
                location: 'Bandra East, Mumbai',
                distance: '3.5 km',
                budget: { min: 1000, max: 1500 },
                scheduledDate: new Date(Date.now() + 172800000).toISOString(),
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                status: 'pending',
                urgency: 'medium'
            },
            {
                id: 'job_003',
                title: 'Electrical Wiring',
                description: 'Complete house rewiring needed',
                customer: { name: 'Anjali Patel', phone: '9988776655', location: 'Powai' },
                location: 'Powai, Mumbai',
                distance: '5.1 km',
                budget: { min: 2000, max: 3000 },
                scheduledDate: new Date(Date.now() + 259200000).toISOString(),
                createdAt: new Date(Date.now() - 10800000).toISOString(),
                status: 'pending',
                urgency: 'low'
            }
        ],
        active: [
            {
                id: 'job_004',
                title: 'Kitchen Sink Repair',
                description: 'Fixing leaking kitchen sink',
                customer: { name: 'Suresh Kumar', phone: '9876501234', location: 'Thane' },
                location: 'Thane, Mumbai',
                distance: '4.2 km',
                payment: 600,
                startedAt: new Date(Date.now() - 7200000).toISOString(),
                estimatedCompletion: new Date(Date.now() + 3600000).toISOString(),
                status: 'in_progress',
                progress: 60
            }
        ],
        completed: [
            {
                id: 'job_005',
                title: 'Bathroom Plumbing',
                description: 'Fixed bathroom drainage issue',
                customer: { name: 'Meera Singh', phone: '9123450987', location: 'Borivali' },
                location: 'Borivali, Mumbai',
                payment: 850,
                completedAt: new Date(Date.now() - 86400000).toISOString(),
                rating: 5,
                review: 'Excellent work! Very professional and quick.',
                status: 'completed'
            },
            {
                id: 'job_006',
                title: 'Tap Replacement',
                description: 'Replaced old kitchen tap',
                customer: { name: 'Vikram Joshi', phone: '9876123456', location: 'Andheri' },
                location: 'Andheri, Mumbai',
                payment: 400,
                completedAt: new Date(Date.now() - 172800000).toISOString(),
                rating: 4,
                review: 'Good service, arrived on time.',
                status: 'completed'
            },
            {
                id: 'job_007',
                title: 'Water Heater Installation',
                description: 'Installed new geyser',
                customer: { name: 'Pooja Reddy', phone: '9988112233', location: 'Navi Mumbai' },
                location: 'Navi Mumbai',
                payment: 1200,
                completedAt: new Date(Date.now() - 259200000).toISOString(),
                rating: 5,
                review: 'Great work! Highly recommended.',
                status: 'completed'
            }
        ]
    };
}

// Generate mock earnings data
function generateMockEarnings() {
    return {
        today: 850,
        week: 4200,
        month: 18500,
        total: 125000,
        pending: 2500,
        history: [
            { date: new Date().toISOString(), amount: 850, job: 'Bathroom Plumbing', status: 'completed' },
            { date: new Date(Date.now() - 86400000).toISOString(), amount: 600, job: 'Tap Repair', status: 'completed' },
            { date: new Date(Date.now() - 172800000).toISOString(), amount: 1200, job: 'Geyser Installation', status: 'completed' },
            { date: new Date(Date.now() - 259200000).toISOString(), amount: 450, job: 'Pipe Fixing', status: 'completed' },
            { date: new Date(Date.now() - 345600000).toISOString(), amount: 1100, job: 'Drainage Cleaning', status: 'completed' }
        ],
        weeklyBreakdown: [
            { day: 'Mon', amount: 850 },
            { day: 'Tue', amount: 1200 },
            { day: 'Wed', amount: 600 },
            { day: 'Thu', amount: 950 },
            { day: 'Fri', amount: 400 },
            { day: 'Sat', amount: 200 },
            { day: 'Sun', amount: 0 }
        ]
    };
}

// Generate mock reviews
function generateMockReviews() {
    return [
        {
            id: 'rev_001',
            customer: 'Meera Singh',
            rating: 5,
            comment: 'Excellent work! Very professional and quick. Fixed the issue perfectly.',
            date: new Date(Date.now() - 86400000).toISOString(),
            job: 'Bathroom Plumbing'
        },
        {
            id: 'rev_002',
            customer: 'Vikram Joshi',
            rating: 4,
            comment: 'Good service, arrived on time. Would recommend.',
            date: new Date(Date.now() - 172800000).toISOString(),
            job: 'Tap Replacement'
        },
        {
            id: 'rev_003',
            customer: 'Pooja Reddy',
            rating: 5,
            comment: 'Great work! Highly recommended. Very skilled and friendly.',
            date: new Date(Date.now() - 259200000).toISOString(),
            job: 'Water Heater Installation'
        },
        {
            id: 'rev_004',
            customer: 'Amit Desai',
            rating: 5,
            comment: 'Perfect job! Will definitely hire again.',
            date: new Date(Date.now() - 345600000).toISOString(),
            job: 'Pipe Repair'
        },
        {
            id: 'rev_005',
            customer: 'Sneha Kapoor',
            rating: 4,
            comment: 'Good work, but took a bit longer than expected.',
            date: new Date(Date.now() - 432000000).toISOString(),
            job: 'Drainage Fix'
        }
    ];
}

// Initialize data
initializeWorkerData();

// ============================================
// AVAILABILITY MANAGEMENT
// ============================================

let availabilityData = Storage.get('worker_availability');
let isAvailable = availabilityData.isOnline;

const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const toggleAvailabilityBtn = document.getElementById('toggleAvailability');

function updateAvailabilityStatus() {
    if (isAvailable) {
        statusDot.className = 'status-dot status-online';
        statusText.textContent = 'Available';
        toggleAvailabilityBtn.textContent = 'Go Offline';
        toggleAvailabilityBtn.className = 'btn btn-sm btn-secondary';
        showToast('You are now available for jobs', 'success');
    } else {
        statusDot.className = 'status-dot status-offline';
        statusText.textContent = 'Offline';
        toggleAvailabilityBtn.textContent = 'Go Online';
        toggleAvailabilityBtn.className = 'btn btn-sm btn-primary';
        showToast('You are now offline', 'info');
    }

    // Save to localStorage
    availabilityData.isOnline = isAvailable;
    Storage.set('worker_availability', availabilityData);
}

toggleAvailabilityBtn?.addEventListener('click', () => {
    isAvailable = !isAvailable;
    updateAvailabilityStatus();
});

// ============================================
// SIDEBAR & NAVIGATION
// ============================================

const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarToggle = document.getElementById('sidebarToggle');

mobileMenuBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

const navLinks = document.querySelectorAll('.nav-link[data-page]');
const contentArea = document.getElementById('contentArea');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        loadPage(page);

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

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

// ============================================
// PAGE LOADER
// ============================================

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

// ============================================
// PAGE CONTENT GENERATOR
// ============================================

function getPageContent(pageName) {
    const pages = {
        'profile': getProfilePage(),
        'job-requests': getJobRequestsPage(),
        'active-jobs': getActiveJobsPage(),
        'job-history': getJobHistoryPage(),
        'availability': getAvailabilityPage(),
        'earnings': getEarningsPage(),
        'wallet': getWalletPage(),
        'ratings': getRatingsPage(),
        'support': getSupportPage(),
        'settings': getSettingsPage()
    };

    return pages[pageName] || getWorkerHomePage();
}

// ============================================
// HOME PAGE
// ============================================

function getWorkerHomePage() {
    const jobs = Storage.get('worker_jobs');
    const earnings = Storage.get('worker_earnings');
    const profile = userProfile || {};

    return `
    <div class="dashboard-home">
      <!-- Welcome Header -->
      <div class="dashboard-welcome">
        <div class="welcome-content">
          <h1>Welcome back, <span id="dashboardUserName">${userData.name || 'Worker'}</span>! 👷</h1>
          <p>Manage your jobs and grow your business</p>
        </div>
        <div class="welcome-actions">
          <button class="btn ${isAvailable ? 'btn-secondary' : 'btn-primary'}" onclick="toggleAvailabilityBtn.click()">
            <span>${isAvailable ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card stat-primary" onclick="loadPage('job-requests')">
          <div class="stat-icon">📬</div>
          <div class="stat-content">
            <div class="stat-label">New Requests</div>
            <div class="stat-value" id="newRequests">${jobs.pending.length}</div>
            <div class="stat-change positive">Pending review</div>
          </div>
        </div>

        <div class="stat-card stat-warning" onclick="loadPage('active-jobs')">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <div class="stat-label">Active Jobs</div>
            <div class="stat-value" id="activeJobs">${jobs.active.length}</div>
            <div class="stat-change positive">In progress</div>
          </div>
        </div>

        <div class="stat-card stat-success" onclick="loadPage('earnings')">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-label">This Month</div>
            <div class="stat-value">₹<span id="monthlyEarnings">${earnings.month.toLocaleString()}</span></div>
            <div class="stat-change positive">+15% from last month</div>
          </div>
        </div>

        <div class="stat-card stat-info" onclick="loadPage('ratings')">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-label">Your Rating</div>
            <div class="stat-value" id="workerRating">4.8</div>
            <div class="stat-change positive">Top 10% workers</div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Job Requests -->
        <div class="dashboard-card job-requests-card">
          <div class="card-header">
            <h2>📬 New Job Requests</h2>
            <button class="btn-text" onclick="loadPage('job-requests')">View All</button>
          </div>
          <div class="job-requests-list" id="jobRequestsList">
            ${jobs.pending.slice(0, 2).map(job => `
              <div class="job-request-item">
                <div class="job-request-header">
                  <h4>${job.title}</h4>
                  <span class="badge badge-${job.urgency === 'high' ? 'error' : job.urgency === 'medium' ? 'warning' : 'info'}">${job.urgency}</span>
                </div>
                <p class="job-request-desc">${job.description}</p>
                <p class="job-request-location">📍 ${job.location} • ${job.distance}</p>
                <p class="job-request-price">💰 ₹${job.budget.min} - ₹${job.budget.max}</p>
                <p class="job-request-time">🕒 ${getRelativeTime(job.createdAt)}</p>
                <div class="job-request-actions">
                  <button class="btn btn-sm btn-primary" onclick="acceptJob('${job.id}')">Accept</button>
                  <button class="btn btn-sm btn-secondary" onclick="viewJobDetails('${job.id}')">Details</button>
                  <button class="btn btn-sm btn-ghost" onclick="declineJob('${job.id}')">Decline</button>
                </div>
              </div>
            `).join('')}
            ${jobs.pending.length === 0 ? '<div class="empty-state-small">No new requests</div>' : ''}
          </div>
        </div>

        <!-- Active Jobs -->
        <div class="dashboard-card active-jobs-card">
          <div class="card-header">
            <h2>⚡ Active Jobs</h2>
            <button class="btn-text" onclick="loadPage('active-jobs')">View All</button>
          </div>
          <div class="active-jobs-list" id="activeJobsList">
            ${jobs.active.map(job => `
              <div class="active-job-item">
                <div class="active-job-header">
                  <h4>${job.title}</h4>
                  <span class="badge badge-success">In Progress</span>
                </div>
                <p class="active-job-desc">${job.description}</p>
                <p class="active-job-customer">👤 ${job.customer.name}</p>
                <p class="active-job-time">⏰ Started ${getRelativeTime(job.startedAt)}</p>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${job.progress}%"></div>
                </div>
                <p class="progress-text">${job.progress}% Complete</p>
                <div class="active-job-actions">
                  <button class="btn btn-sm btn-success" onclick="completeJob('${job.id}')">Mark Complete</button>
                  <button class="btn btn-sm btn-secondary" onclick="contactCustomer('${job.customer.phone}')">Contact</button>
                </div>
              </div>
            `).join('')}
            ${jobs.active.length === 0 ? '<div class="empty-state-small">No active jobs</div>' : ''}
          </div>
        </div>

        <!-- Earnings Overview -->
        <div class="dashboard-card earnings-card">
          <div class="card-header">
            <h2>💰 Earnings Overview</h2>
            <button class="btn-text" onclick="loadPage('earnings')">View Details</button>
          </div>
          <div class="earnings-summary">
            <div class="earnings-item">
              <span class="earnings-label">Today</span>
              <span class="earnings-value">₹${earnings.today}</span>
            </div>
            <div class="earnings-item">
              <span class="earnings-label">This Week</span>
              <span class="earnings-value">₹${earnings.week.toLocaleString()}</span>
            </div>
            <div class="earnings-item">
              <span class="earnings-label">This Month</span>
              <span class="earnings-value">₹${earnings.month.toLocaleString()}</span>
            </div>
            <div class="earnings-item">
              <span class="earnings-label">Total Earned</span>
              <span class="earnings-value">₹${earnings.total.toLocaleString()}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block" onclick="loadPage('wallet')">Withdraw Earnings</button>
        </div>

        <!-- Recent Reviews -->
        <div class="dashboard-card reviews-card">
          <div class="card-header">
            <h2>⭐ Recent Reviews</h2>
            <button class="btn-text" onclick="loadPage('ratings')">View All</button>
          </div>
          <div class="reviews-list">
            ${Storage.get('worker_reviews').slice(0, 2).map(review => `
              <div class="review-item">
                <div class="review-header">
                  <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                  <span class="review-date">${getRelativeTime(review.date)}</span>
                </div>
                <p class="review-text">"${review.comment}"</p>
                <p class="review-customer">- ${review.customer}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Performance Chart -->
        <div class="dashboard-card performance-card">
          <div class="card-header">
            <h2>📊 Weekly Performance</h2>
            <select class="period-select" onchange="updatePerformanceChart(this.value)">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div class="performance-chart">
            <div class="chart-bars">
              ${earnings.weeklyBreakdown.map(day => `
                <div class="chart-bar" style="height: ${(day.amount / 1500) * 100}%">
                  <div class="bar-fill"></div>
                  <div class="bar-value">₹${day.amount}</div>
                  <div class="bar-label">${day.day}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="dashboard-card quick-stats-card">
          <div class="card-header">
            <h2>📈 Quick Stats</h2>
          </div>
          <div class="quick-stats-list">
            <div class="quick-stat-item">
              <span class="quick-stat-icon">✅</span>
              <div class="quick-stat-info">
                <span class="quick-stat-value">${jobs.completed.length}</span>
                <span class="quick-stat-label">Jobs Completed</span>
              </div>
            </div>
            <div class="quick-stat-item">
              <span class="quick-stat-icon">👥</span>
              <div class="quick-stat-info">
                <span class="quick-stat-value">${jobs.completed.length}</span>
                <span class="quick-stat-label">Happy Customers</span>
              </div>
            </div>
            <div class="quick-stat-item">
              <span class="quick-stat-icon">🎯</span>
              <div class="quick-stat-info">
                <span class="quick-stat-value">96%</span>
                <span class="quick-stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// PROFILE PAGE
// ============================================

function getProfilePage() {
    const profile = userProfile || {};
    const user = userData || {};
    const jobs = Storage.get('worker_jobs');
    const earnings = Storage.get('worker_earnings');

    return `
    <div class="page-header">
      <h1 class="page-title">My Profile</h1>
      <p class="page-subtitle">Manage your worker profile</p>
    </div>
    
    <div class="profile-container">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Personal Information</h2>
          <button class="btn btn-secondary" onclick="showToast('Edit feature coming soon!', 'info')">Edit Profile</button>
        </div>
        <div class="profile-grid">
          <div class="profile-section">
            <h3>Basic Details</h3>
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
              <label>Location</label>
              <p>${profile.location || 'Not set'}</p>
            </div>
          </div>

          <div class="profile-section">
            <h3>Professional Details</h3>
            <div class="info-item">
              <label>Skills</label>
              <div class="skills-tags">
                ${(profile.skills || []).map(skill => `
                  <span class="badge badge-primary">${skill}</span>
                `).join('')}
              </div>
            </div>
            <div class="info-item">
              <label>Experience</label>
              <p style="text-transform: capitalize;">${profile.experience || 'Not set'}</p>
            </div>
            <div class="info-item">
              <label>Hourly Rate</label>
              <p>₹${profile.hourlyRate || '0'}/hour</p>
            </div>
            <div class="info-item">
              <label>Verification Status</label>
              <p><span class="badge ${profile.verified ? 'badge-success' : 'badge-warning'}">${profile.verified ? 'Verified' : 'Pending'}</span></p>
            </div>
          </div>

          <div class="profile-section">
            <h3>Performance Stats</h3>
            <div class="info-item">
              <label>Jobs Completed</label>
              <p>${jobs.completed.length}</p>
            </div>
            <div class="info-item">
              <label>Total Earnings</label>
              <p>₹${earnings.total.toLocaleString()}</p>
            </div>
            <div class="info-item">
              <label>Average Rating</label>
              <p>⭐ 4.8 / 5.0</p>
            </div>
            <div class="info-item">
              <label>Success Rate</label>
              <p>96%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// JOB REQUESTS PAGE
// ============================================

function getJobRequestsPage() {
    const jobs = Storage.get('worker_jobs');

    return `
    <div class="page-header">
      <h1 class="page-title">📬 Job Requests</h1>
      <p class="page-subtitle">Review and accept job requests from customers</p>
      <div class="page-stats">
        <span class="stat-badge">
          <span class="stat-badge-value">${jobs.pending.length}</span>
          <span class="stat-badge-label">Pending Requests</span>
        </span>
      </div>
    </div>
    
    <div class="jobs-grid">
      ${jobs.pending.map(job => `
        <div class="job-card">
          <div class="job-card-header">
            <div>
              <h3>${job.title}</h3>
              <span class="badge badge-${job.urgency === 'high' ? 'error' : job.urgency === 'medium' ? 'warning' : 'info'}">${job.urgency} priority</span>
            </div>
            <span class="job-time">${getRelativeTime(job.createdAt)}</span>
          </div>
          
          <p class="job-description">${job.description}</p>
          
          <div class="job-details">
            <div class="job-detail-row">
              <span class="detail-icon">👤</span>
              <span class="detail-text">${job.customer.name}</span>
            </div>
            <div class="job-detail-row">
              <span class="detail-icon">📍</span>
              <span class="detail-text">${job.location} • ${job.distance}</span>
            </div>
            <div class="job-detail-row">
              <span class="detail-icon">💰</span>
              <span class="detail-text">₹${job.budget.min} - ₹${job.budget.max}</span>
            </div>
            <div class="job-detail-row">
              <span class="detail-icon">📅</span>
              <span class="detail-text">${formatDate(job.scheduledDate)}</span>
            </div>
          </div>
          
          <div class="job-actions">
            <button class="btn btn-primary" onclick="acceptJob('${job.id}')">
              <span>Accept Job</span>
            </button>
            <button class="btn btn-secondary" onclick="viewJobDetails('${job.id}')">
              <span>View Details</span>
            </button>
            <button class="btn btn-ghost" onclick="declineJob('${job.id}')">
              <span>Decline</span>
            </button>
          </div>
        </div>
      `).join('')}
      
      ${jobs.pending.length === 0 ? `
        <div class="empty-state">
          <h3>No pending requests</h3>
          <p>New job requests will appear here</p>
          <button class="btn btn-primary" onclick="loadPage('home')">Go to Dashboard</button>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================
// ACTIVE JOBS PAGE
// ============================================

function getActiveJobsPage() {
    const jobs = Storage.get('worker_jobs');

    return `
    <div class="page-header">
      <h1 class="page-title">⚡ Active Jobs</h1>
      <p class="page-subtitle">Jobs currently in progress</p>
      <div class="page-stats">
        <span class="stat-badge">
          <span class="stat-badge-value">${jobs.active.length}</span>
          <span class="stat-badge-label">Active Jobs</span>
        </span>
      </div>
    </div>
    
    <div class="jobs-grid">
      ${jobs.active.map(job => `
        <div class="job-card active-job-card">
          <div class="job-card-header">
            <div>
              <h3>${job.title}</h3>
              <span class="badge badge-success">In Progress</span>
            </div>
            <span class="job-time">Started ${getRelativeTime(job.startedAt)}</span>
          </div>
          
          <p class="job-description">${job.description}</p>
          
          <div class="job-details">
            <div class="job-detail-row">
              <span class="detail-icon">👤</span>
              <span class="detail-text">${job.customer.name}</span>
              <button class="btn btn-sm btn-ghost" onclick="contactCustomer('${job.customer.phone}')">
                📞 Call
              </button>
            </div>
            <div class="job-detail-row">
              <span class="detail-icon">📍</span>
              <span class="detail-text">${job.location}</span>
            </div>
            <div class="job-detail-row">
              <span class="detail-icon">💰</span>
              <span class="detail-text">₹${job.payment}</span>
            </div>
            <div class="job-detail-row">
              <span class="detail-icon">⏰</span>
              <span class="detail-text">Est. completion: ${formatDateTime(job.estimatedCompletion)}</span>
            </div>
          </div>
          
          <div class="job-progress">
            <div class="progress-header">
              <span>Progress</span>
              <span>${job.progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${job.progress}%"></div>
            </div>
          </div>
          
          <div class="job-actions">
            <button class="btn btn-success" onclick="completeJob('${job.id}')">
              <span>Mark as Complete</span>
            </button>
            <button class="btn btn-secondary" onclick="updateProgress('${job.id}')">
              <span>Update Progress</span>
            </button>
            <button class="btn btn-ghost" onclick="reportIssue('${job.id}')">
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      `).join('')}
      
      ${jobs.active.length === 0 ? `
        <div class="empty-state">
          <h3>No active jobs</h3>
          <p>Accept job requests to get started</p>
          <button class="btn btn-primary" onclick="loadPage('job-requests')">View Requests</button>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================
// JOB HISTORY PAGE
// ============================================

function getJobHistoryPage() {
    const jobs = Storage.get('worker_jobs');

    return `
    <div class="page-header">
      <h1 class="page-title">📋 Job History</h1>
      <p class="page-subtitle">Your completed jobs and earnings</p>
      <div class="page-stats">
        <span class="stat-badge">
          <span class="stat-badge-value">${jobs.completed.length}</span>
          <span class="stat-badge-label">Completed Jobs</span>
        </span>
        <span class="stat-badge">
          <span class="stat-badge-value">₹${jobs.completed.reduce((sum, job) => sum + job.payment, 0).toLocaleString()}</span>
          <span class="stat-badge-label">Total Earned</span>
        </span>
      </div>
    </div>
    
    <div class="jobs-list">
      ${jobs.completed.map(job => `
        <div class="job-history-item">
          <div class="job-history-header">
            <div>
              <h3>${job.title}</h3>
              <p class="job-history-customer">Customer: ${job.customer.name}</p>
            </div>
            <div class="job-history-meta">
              <span class="job-history-date">${formatDate(job.completedAt)}</span>
              <span class="job-history-payment">₹${job.payment}</span>
            </div>
          </div>
          
          <p class="job-history-desc">${job.description}</p>
          
          <div class="job-history-footer">
            <div class="job-rating">
              <span class="rating-stars">${'⭐'.repeat(job.rating)}</span>
              <span class="rating-value">${job.rating}/5</span>
            </div>
            ${job.review ? `
              <p class="job-review">"${job.review}"</p>
            ` : ''}
          </div>
        </div>
      `).join('')}
      
      ${jobs.completed.length === 0 ? `
        <div class="empty-state">
          <h3>No completed jobs yet</h3>
          <p>Complete jobs to build your history</p>
          <button class="btn btn-primary" onclick="loadPage('job-requests')">View Job Requests</button>
        </div>
      ` : ''}
    </div>
  `;
}

// Continue in next message due to length...
console.log('Worker Dashboard - Part 1 Loaded');

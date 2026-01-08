// ============================================
// WORKER DASHBOARD - PART 2
// Additional Pages and Functionality
// ============================================

// This file continues from worker-dashboard.js
// Append this to the main file or include separately

// ============================================
// AVAILABILITY PAGE
// ============================================

function getAvailabilityPage() {
    const availability = Storage.get('worker_availability');

    return `
    <div class="page-header">
      <h1 class="page-title">📅 Availability Settings</h1>
      <p class="page-subtitle">Manage your working hours and availability</p>
    </div>
    
    <div class="availability-container">
      <div class="card">
        <div class="card-header">
          <h2>Current Status</h2>
          <div class="status-toggle">
            <span class="status-dot status-${availability.isOnline ? 'online' : 'offline'}"></span>
            <span>${availability.isOnline ? 'Available' : 'Offline'}</span>
            <button class="btn ${availability.isOnline ? 'btn-secondary' : 'btn-primary'}" onclick="toggleAvailabilityBtn.click()">
              ${availability.isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>
        
        <div class="availability-schedule">
          <h3>Weekly Schedule</h3>
          <div class="schedule-grid">
            ${Object.entries(availability.workingHours).map(([day, hours]) => `
              <div class="schedule-day">
                <div class="schedule-day-header">
                  <label class="checkbox-label">
                    <input type="checkbox" ${hours.enabled ? 'checked' : ''} onchange="toggleDay('${day}', this.checked)">
                    <span class="day-name">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
                  </label>
                </div>
                ${hours.enabled ? `
                  <div class="schedule-time">
                    <input type="time" value="${hours.start}" onchange="updateTime('${day}', 'start', this.value)" class="time-input">
                    <span>to</span>
                    <input type="time" value="${hours.end}" onchange="updateTime('${day}', 'end', this.value)" class="time-input">
                  </div>
                ` : `
                  <div class="schedule-time-disabled">Not available</div>
                `}
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="card-footer">
          <button class="btn btn-primary" onclick="saveAvailability()">Save Changes</button>
          <button class="btn btn-secondary" onclick="loadPage('availability')">Reset</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// EARNINGS PAGE
// ============================================

function getEarningsPage() {
    const earnings = Storage.get('worker_earnings');

    return `
    <div class="page-header">
      <h1 class="page-title">💰 My Earnings</h1>
      <p class="page-subtitle">Track your income and financial performance</p>
    </div>
    
    <div class="earnings-dashboard">
      <!-- Summary Cards -->
      <div class="earnings-summary-grid">
        <div class="earnings-summary-card">
          <div class="summary-icon">📅</div>
          <div class="summary-content">
            <span class="summary-label">Today</span>
            <span class="summary-value">₹${earnings.today}</span>
          </div>
        </div>
        
        <div class="earnings-summary-card">
          <div class="summary-icon">📊</div>
          <div class="summary-content">
            <span class="summary-label">This Week</span>
            <span class="summary-value">₹${earnings.week.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="earnings-summary-card">
          <div class="summary-icon">📈</div>
          <div class="summary-content">
            <span class="summary-label">This Month</span>
            <span class="summary-value">₹${earnings.month.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="earnings-summary-card">
          <div class="summary-icon">💎</div>
          <div class="summary-content">
            <span class="summary-label">Total Earned</span>
            <span class="summary-value">₹${earnings.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <!-- Weekly Chart -->
      <div class="card">
        <div class="card-header">
          <h2>Weekly Earnings</h2>
          <select class="period-select">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        <div class="earnings-chart">
          <div class="chart-bars">
            ${earnings.weeklyBreakdown.map(day => {
        const maxEarning = Math.max(...earnings.weeklyBreakdown.map(d => d.amount));
        const height = maxEarning > 0 ? (day.amount / maxEarning) * 100 : 0;
        return `
                <div class="chart-bar" style="height: ${height}%">
                  <div class="bar-fill"></div>
                  <div class="bar-value">₹${day.amount}</div>
                  <div class="bar-label">${day.day}</div>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      </div>
      
      <!-- Earnings History -->
      <div class="card">
        <div class="card-header">
          <h2>Recent Transactions</h2>
          <button class="btn-text" onclick="loadPage('wallet')">View All</button>
        </div>
        <div class="earnings-history">
          ${earnings.history.map(transaction => `
            <div class="earning-item">
              <div class="earning-info">
                <h4>${transaction.job}</h4>
                <span class="earning-date">${formatDate(transaction.date)}</span>
              </div>
              <div class="earning-amount">
                <span class="amount-value">+₹${transaction.amount}</span>
                <span class="badge badge-success">${transaction.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Pending Earnings -->
      ${earnings.pending > 0 ? `
        <div class="card pending-earnings-card">
          <div class="card-header">
            <h2>⏳ Pending Earnings</h2>
          </div>
          <div class="pending-earnings-content">
            <div class="pending-amount">₹${earnings.pending.toLocaleString()}</div>
            <p>Will be available for withdrawal after job completion verification</p>
            <button class="btn btn-secondary" onclick="showToast('Pending earnings will be released within 24 hours', 'info')">Learn More</button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================
// WALLET PAGE
// ============================================

function getWalletPage() {
    const earnings = Storage.get('worker_earnings');

    return `
    <div class="page-header">
      <h1 class="page-title">💳 Wallet</h1>
      <p class="page-subtitle">Manage your earnings and withdrawals</p>
    </div>
    
    <div class="wallet-container">
      <!-- Balance Card -->
      <div class="card wallet-balance-card">
        <div class="balance-header">
          <h2>Available Balance</h2>
          <span class="balance-amount">₹${earnings.month.toLocaleString()}</span>
        </div>
        <div class="balance-actions">
          <button class="btn btn-primary btn-lg" onclick="initiateWithdrawal()">
            <span>Withdraw Money</span>
          </button>
          <button class="btn btn-secondary btn-lg" onclick="showToast('Transaction history feature coming soon!', 'info')">
            <span>View History</span>
          </button>
        </div>
      </div>
      
      <!-- Withdrawal Methods -->
      <div class="card">
        <div class="card-header">
          <h2>Withdrawal Methods</h2>
          <button class="btn-text" onclick="addPaymentMethod()">+ Add New</button>
        </div>
        <div class="payment-methods">
          <div class="payment-method-item">
            <div class="payment-method-icon">🏦</div>
            <div class="payment-method-info">
              <h4>Bank Account</h4>
              <p>HDFC Bank •••• 4567</p>
            </div>
            <span class="badge badge-primary">Primary</span>
          </div>
          <div class="payment-method-item">
            <div class="payment-method-icon">📱</div>
            <div class="payment-method-info">
              <h4>UPI</h4>
              <p>9876543210@paytm</p>
            </div>
            <button class="btn btn-sm btn-ghost">Set as Primary</button>
          </div>
        </div>
      </div>
      
      <!-- Recent Withdrawals -->
      <div class="card">
        <div class="card-header">
          <h2>Recent Withdrawals</h2>
        </div>
        <div class="withdrawals-list">
          <div class="withdrawal-item">
            <div class="withdrawal-info">
              <h4>Withdrawal to Bank</h4>
              <span class="withdrawal-date">${formatDate(new Date(Date.now() - 172800000))}</span>
            </div>
            <div class="withdrawal-amount">
              <span class="amount-value">-₹5,000</span>
              <span class="badge badge-success">Completed</span>
            </div>
          </div>
          <div class="withdrawal-item">
            <div class="withdrawal-info">
              <h4>Withdrawal to UPI</h4>
              <span class="withdrawal-date">${formatDate(new Date(Date.now() - 604800000))}</span>
            </div>
            <div class="withdrawal-amount">
              <span class="amount-value">-₹3,500</span>
              <span class="badge badge-success">Completed</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Withdrawal Info -->
      <div class="card info-card">
        <h3>💡 Withdrawal Information</h3>
        <ul class="info-list">
          <li>Minimum withdrawal amount: ₹500</li>
          <li>Processing time: 1-2 business days</li>
          <li>No withdrawal fees for bank transfers</li>
          <li>Instant withdrawals available for UPI (₹10 fee)</li>
        </ul>
      </div>
    </div>
  `;
}

// ============================================
// RATINGS & REVIEWS PAGE
// ============================================

function getRatingsPage() {
    const reviews = Storage.get('worker_reviews');
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
    };

    return `
    <div class="page-header">
      <h1 class="page-title">⭐ Ratings & Reviews</h1>
      <p class="page-subtitle">See what customers say about your work</p>
    </div>
    
    <div class="ratings-container">
      <!-- Rating Summary -->
      <div class="card rating-summary-card">
        <div class="rating-summary">
          <div class="rating-score">
            <div class="score-value">${avgRating.toFixed(1)}</div>
            <div class="score-stars">${'⭐'.repeat(Math.round(avgRating))}</div>
            <div class="score-count">${reviews.length} reviews</div>
          </div>
          
          <div class="rating-distribution">
            ${[5, 4, 3, 2, 1].map(star => {
        const count = ratingDistribution[star];
        const percentage = (count / reviews.length) * 100;
        return `
                <div class="rating-bar">
                  <span class="rating-label">${star} ⭐</span>
                  <div class="rating-progress">
                    <div class="rating-progress-fill" style="width: ${percentage}%"></div>
                  </div>
                  <span class="rating-count">${count}</span>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      </div>
      
      <!-- Reviews List -->
      <div class="card">
        <div class="card-header">
          <h2>Customer Reviews</h2>
          <select class="filter-select">
            <option>All Reviews</option>
            <option>5 Stars</option>
            <option>4 Stars</option>
            <option>3 Stars</option>
            <option>Recent</option>
          </select>
        </div>
        <div class="reviews-list">
          ${reviews.map(review => `
            <div class="review-card">
              <div class="review-header">
                <div class="review-customer">
                  <div class="customer-avatar">${review.customer.charAt(0)}</div>
                  <div class="customer-info">
                    <h4>${review.customer}</h4>
                    <span class="review-date">${getRelativeTime(review.date)}</span>
                  </div>
                </div>
                <div class="review-rating">
                  <span class="rating-stars">${'⭐'.repeat(review.rating)}</span>
                  <span class="rating-value">${review.rating}/5</span>
                </div>
              </div>
              <p class="review-comment">"${review.comment}"</p>
              <div class="review-footer">
                <span class="review-job">Job: ${review.job}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Performance Insights -->
      <div class="card">
        <div class="card-header">
          <h2>📊 Performance Insights</h2>
        </div>
        <div class="insights-grid">
          <div class="insight-item">
            <span class="insight-icon">🎯</span>
            <div class="insight-content">
              <span class="insight-value">96%</span>
              <span class="insight-label">Customer Satisfaction</span>
            </div>
          </div>
          <div class="insight-item">
            <span class="insight-icon">⚡</span>
            <div class="insight-content">
              <span class="insight-value">98%</span>
              <span class="insight-label">On-Time Completion</span>
            </div>
          </div>
          <div class="insight-item">
            <span class="insight-icon">💬</span>
            <div class="insight-content">
              <span class="insight-value">95%</span>
              <span class="insight-label">Response Rate</span>
            </div>
          </div>
          <div class="insight-item">
            <span class="insight-icon">🔄</span>
            <div class="insight-content">
              <span class="insight-value">85%</span>
              <span class="insight-label">Repeat Customers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// SUPPORT PAGE
// ============================================

function getSupportPage() {
    return `
    <div class="page-header">
      <h1 class="page-title">🆘 Help & Support</h1>
      <p class="page-subtitle">We're here to help you succeed</p>
    </div>
    
    <div class="support-container">
      <!-- Emergency Support -->
      <div class="card emergency-card">
        <div class="emergency-header">
          <h2>🚨 Emergency Support</h2>
          <p>Need immediate assistance? We're available 24/7</p>
        </div>
        <div class="emergency-actions">
          <button class="btn btn-error btn-lg" onclick="callSupport()">
            📞 Call Support: 1800-123-4567
          </button>
          <button class="btn btn-secondary btn-lg" onclick="chatSupport()">
            💬 Live Chat
          </button>
        </div>
      </div>
      
      <!-- Quick Help -->
      <div class="card">
        <div class="card-header">
          <h2>Quick Help Topics</h2>
        </div>
        <div class="help-topics">
          <div class="help-topic" onclick="showHelpArticle('payment')">
            <span class="topic-icon">💰</span>
            <div class="topic-content">
              <h4>Payment Issues</h4>
              <p>Withdrawal, earnings, and payment methods</p>
            </div>
            <span class="topic-arrow">→</span>
          </div>
          <div class="help-topic" onclick="showHelpArticle('jobs')">
            <span class="topic-icon">📋</span>
            <div class="topic-content">
              <h4>Job Management</h4>
              <p>Accepting, completing, and tracking jobs</p>
            </div>
            <span class="topic-arrow">→</span>
          </div>
          <div class="help-topic" onclick="showHelpArticle('account')">
            <span class="topic-icon">👤</span>
            <div class="topic-content">
              <h4>Account Settings</h4>
              <p>Profile, verification, and preferences</p>
            </div>
            <span class="topic-arrow">→</span>
          </div>
          <div class="help-topic" onclick="showHelpArticle('safety')">
            <span class="topic-icon">🛡️</span>
            <div class="topic-content">
              <h4>Safety & Security</h4>
              <p>Guidelines and best practices</p>
            </div>
            <span class="topic-arrow">→</span>
          </div>
        </div>
      </div>
      
      <!-- Contact Form -->
      <div class="card">
        <div class="card-header">
          <h2>Send us a Message</h2>
        </div>
        <form class="support-form" onsubmit="submitSupportTicket(event)">
          <div class="input-group">
            <label class="input-label">Subject</label>
            <select class="input-field" required>
              <option value="">Select a topic</option>
              <option>Payment Issue</option>
              <option>Job Dispute</option>
              <option>Account Problem</option>
              <option>Technical Issue</option>
              <option>Other</option>
            </select>
          </div>
          
          <div class="input-group">
            <label class="input-label">Description</label>
            <textarea class="input-field" rows="5" placeholder="Describe your issue in detail..." required></textarea>
          </div>
          
          <div class="input-group">
            <label class="input-label">Attach Screenshot (Optional)</label>
            <input type="file" class="input-field" accept="image/*">
          </div>
          
          <button type="submit" class="btn btn-primary">Submit Ticket</button>
        </form>
      </div>
      
      <!-- FAQ -->
      <div class="card">
        <div class="card-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div class="faq-list">
          <details class="faq-item">
            <summary>How do I withdraw my earnings?</summary>
            <p>Go to Wallet → Click "Withdraw Money" → Select payment method → Enter amount → Confirm. Withdrawals are processed within 1-2 business days.</p>
          </details>
          <details class="faq-item">
            <summary>What happens if I can't complete a job?</summary>
            <p>Contact the customer immediately and report the issue through the app. Our support team will help resolve the situation.</p>
          </details>
          <details class="faq-item">
            <summary>How can I improve my rating?</summary>
            <p>Arrive on time, communicate clearly, complete jobs professionally, and follow up with customers. Quality work leads to better ratings!</p>
          </details>
          <details class="faq-item">
            <summary>Can I change my service categories?</summary>
            <p>Yes! Go to Profile → Edit → Update your skills. Changes will be reflected immediately.</p>
          </details>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// SETTINGS PAGE
// ============================================

function getSettingsPage() {
    return `
    <div class="page-header">
      <h1 class="page-title">⚙️ Settings</h1>
      <p class="page-subtitle">Manage your account preferences</p>
    </div>
    
    <div class="settings-container">
      <!-- Account Settings -->
      <div class="card">
        <div class="card-header">
          <h2>Account Settings</h2>
        </div>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Change Password</h4>
              <p>Update your account password</p>
            </div>
            <button class="btn btn-secondary" onclick="changePassword()">Change</button>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Phone Number</h4>
              <p>${userData.phone}</p>
            </div>
            <button class="btn btn-secondary" onclick="showToast('Phone verification required', 'info')">Update</button>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Email Address</h4>
              <p>${userData.email || 'Not set'}</p>
            </div>
            <button class="btn btn-secondary" onclick="showToast('Email update feature coming soon', 'info')">Update</button>
          </div>
        </div>
      </div>
      
      <!-- Notification Settings -->
      <div class="card">
        <div class="card-header">
          <h2>Notifications</h2>
        </div>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Job Requests</h4>
              <p>Get notified about new job opportunities</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked onchange="toggleNotification('jobs', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Payment Updates</h4>
              <p>Notifications about earnings and withdrawals</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked onchange="toggleNotification('payments', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Customer Messages</h4>
              <p>Get notified when customers contact you</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" checked onchange="toggleNotification('messages', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Promotional Offers</h4>
              <p>Receive updates about special offers</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" onchange="toggleNotification('promos', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Privacy Settings -->
      <div class="card">
        <div class="card-header">
          <h2>Privacy & Security</h2>
        </div>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Profile Visibility</h4>
              <p>Control who can see your profile</p>
            </div>
            <select class="setting-select">
              <option>Public</option>
              <option>Verified Customers Only</option>
              <option>Private</option>
            </select>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security</p>
            </div>
            <button class="btn btn-secondary" onclick="setup2FA()">Enable</button>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Data & Privacy</h4>
              <p>Manage your data and privacy settings</p>
            </div>
            <button class="btn btn-ghost" onclick="showPrivacySettings()">Manage</button>
          </div>
        </div>
      </div>
      
      <!-- Danger Zone -->
      <div class="card danger-card">
        <div class="card-header">
          <h2>Danger Zone</h2>
        </div>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Deactivate Account</h4>
              <p>Temporarily disable your account</p>
            </div>
            <button class="btn btn-ghost" onclick="deactivateAccount()">Deactivate</button>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and data</p>
            </div>
            <button class="btn btn-error" onclick="deleteAccount()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// HELPER FUNCTIONS & EVENT HANDLERS
// ============================================

// Job Actions
function acceptJob(jobId) {
    showConfirm('Accept this job request?', () => {
        const jobs = Storage.get('worker_jobs');
        const jobIndex = jobs.pending.findIndex(j => j.id === jobId);

        if (jobIndex !== -1) {
            const job = jobs.pending[jobIndex];
            jobs.pending.splice(jobIndex, 1);

            // Move to active jobs
            jobs.active.push({
                ...job,
                status: 'in_progress',
                startedAt: new Date().toISOString(),
                estimatedCompletion: new Date(Date.now() + 14400000).toISOString(),
                progress: 0,
                payment: (job.budget.min + job.budget.max) / 2
            });

            Storage.set('worker_jobs', jobs);
            showToast('Job accepted! Customer will be notified.', 'success');
            loadPage('active-jobs');
        }
    });
}

function declineJob(jobId) {
    showConfirm('Decline this job request?', () => {
        const jobs = Storage.get('worker_jobs');
        jobs.pending = jobs.pending.filter(j => j.id !== jobId);
        Storage.set('worker_jobs', jobs);
        showToast('Job request declined', 'info');
        loadPage('job-requests');
    });
}

function viewJobDetails(jobId) {
    const jobs = Storage.get('worker_jobs');
    const job = jobs.pending.find(j => j.id === jobId) || jobs.active.find(j => j.id === jobId);

    if (job) {
        showToast(`Viewing details for: ${job.title}`, 'info');
        // In a real app, this would open a modal with full job details
    }
}

function completeJob(jobId) {
    showConfirm('Mark this job as complete?', () => {
        const jobs = Storage.get('worker_jobs');
        const jobIndex = jobs.active.findIndex(j => j.id === jobId);

        if (jobIndex !== -1) {
            const job = jobs.active[jobIndex];
            jobs.active.splice(jobIndex, 1);

            // Move to completed jobs
            jobs.completed.unshift({
                ...job,
                status: 'completed',
                completedAt: new Date().toISOString(),
                rating: 0,
                review: null
            });

            // Update earnings
            const earnings = Storage.get('worker_earnings');
            earnings.today += job.payment;
            earnings.week += job.payment;
            earnings.month += job.payment;
            earnings.total += job.payment;
            earnings.history.unshift({
                date: new Date().toISOString(),
                amount: job.payment,
                job: job.title,
                status: 'completed'
            });

            Storage.set('worker_jobs', jobs);
            Storage.set('worker_earnings', earnings);

            showToast('Job marked as complete! Payment will be processed.', 'success');
            loadPage('job-history');
        }
    });
}

function updateProgress(jobId) {
    const newProgress = prompt('Enter progress percentage (0-100):');
    if (newProgress && !isNaN(newProgress)) {
        const progress = Math.min(100, Math.max(0, parseInt(newProgress)));
        const jobs = Storage.get('worker_jobs');
        const job = jobs.active.find(j => j.id === jobId);

        if (job) {
            job.progress = progress;
            Storage.set('worker_jobs', jobs);
            showToast(`Progress updated to ${progress}%`, 'success');
            loadPage('active-jobs');
        }
    }
}

function contactCustomer(phone) {
    showToast(`Calling ${phone}...`, 'info');
    // In a real app, this would initiate a call
}

function reportIssue(jobId) {
    showToast('Issue reporting feature coming soon!', 'info');
}

// Availability Functions
function toggleDay(day, enabled) {
    const availability = Storage.get('worker_availability');
    availability.workingHours[day].enabled = enabled;
    Storage.set('worker_availability', availability);
    loadPage('availability');
}

function updateTime(day, type, value) {
    const availability = Storage.get('worker_availability');
    availability.workingHours[day][type] = value;
    Storage.set('worker_availability', availability);
}

function saveAvailability() {
    showToast('Availability settings saved!', 'success');
}

// Wallet Functions
function initiateWithdrawal() {
    const amount = prompt('Enter withdrawal amount (₹):');
    if (amount && !isNaN(amount) && parseInt(amount) >= 500) {
        showConfirm(`Withdraw ₹${amount} to your bank account?`, () => {
            showToast('Withdrawal request submitted! Processing within 1-2 business days.', 'success');
        });
    } else if (amount) {
        showToast('Minimum withdrawal amount is ₹500', 'error');
    }
}

function addPaymentMethod() {
    showToast('Add payment method feature coming soon!', 'info');
}

// Support Functions
function callSupport() {
    showToast('Calling support: 1800-123-4567', 'info');
}

function chatSupport() {
    showToast('Live chat feature coming soon!', 'info');
}

function showHelpArticle(topic) {
    showToast(`Opening help article: ${topic}`, 'info');
}

function submitSupportTicket(e) {
    e.preventDefault();
    showToast('Support ticket submitted! We\'ll respond within 24 hours.', 'success');
    e.target.reset();
}

// Settings Functions
function changePassword() {
    showToast('Password change feature coming soon!', 'info');
}

function toggleNotification(type, enabled) {
    showToast(`${type} notifications ${enabled ? 'enabled' : 'disabled'}`, 'success');
}

function setup2FA() {
    showToast('2FA setup feature coming soon!', 'info');
}

function showPrivacySettings() {
    showToast('Privacy settings feature coming soon!', 'info');
}

function deactivateAccount() {
    showConfirm('Are you sure you want to deactivate your account?', () => {
        showToast('Account deactivation feature coming soon!', 'info');
    });
}

function deleteAccount() {
    showConfirm('⚠️ This action cannot be undone! Delete your account permanently?', () => {
        showToast('Account deletion feature coming soon!', 'info');
    });
}

// Chart Update
function updatePerformanceChart(period) {
    showToast(`Updating chart for: ${period}`, 'info');
}

// ============================================
// PAGE INITIALIZATION
// ============================================

function initializePage(pageName) {
    console.log(`Initialized page: ${pageName}`);

    // Add any page-specific initialization here
    if (pageName === 'availability') {
        // Initialize time pickers
    } else if (pageName === 'earnings') {
        // Initialize charts
    }
}

// ============================================
// INITIAL LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');

    // Update request count badge
    const jobs = Storage.get('worker_jobs');
    const requestCountBadge = document.getElementById('requestCount');
    if (requestCountBadge) {
        requestCountBadge.textContent = jobs.pending.length;
    }
});

console.log('Worker Dashboard - Complete Implementation Loaded');

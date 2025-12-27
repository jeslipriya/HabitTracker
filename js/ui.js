class UIManager {
    constructor(goalManager, analyticsManager) {
        this.goalManager = goalManager;
        this.analyticsManager = analyticsManager;
        this.currentFilter = 'all';
    }

    // Initialize UI
    initialize() {
        this.setupEventListeners();
        this.updateYear();
        this.renderDashboard();
        this.updateUserInfo();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Navigation
        const navDashboard = document.getElementById('navDashboard');
        if (navDashboard) navDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('dashboard');
        });

        const navAnalytics = document.getElementById('navAnalytics');
        if (navAnalytics) navAnalytics.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('analytics');
        });

        const navSettings = document.getElementById('navSettings');
        if (navSettings) navSettings.addEventListener('click', (e) => {
            e.preventDefault();
            this.openSettings();
        });

        // Goal form
        const goalForm = document.getElementById('goalForm');
        if (goalForm) goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createGoal();
        });

        const createGoalBtn = document.getElementById('createGoalBtn');
        if (createGoalBtn) createGoalBtn.addEventListener('click', () => {
            this.scrollToGoalForm();
        });

        const createFirstGoal = document.getElementById('createFirstGoal');
        if (createFirstGoal) createFirstGoal.addEventListener('click', () => {
            this.scrollToGoalForm();
        });

        // Filter
        const goalFilter = document.getElementById('goalFilter');
        if (goalFilter) goalFilter.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderGoals();
        });

        // Analytics time range
        const timeRange = document.getElementById('timeRange');
        if (timeRange) timeRange.addEventListener('change', (e) => {
            const days = parseInt(e.target.value);
            this.analyticsManager.updateCharts(days);
        });

        // Export
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) exportDataBtn.addEventListener('click', () => {
            this.exportData();
        });

        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) generateReportBtn.addEventListener('click', () => {
            this.generateReport();
        });

        // Settings
        const settingsClose = document.getElementById('settingsClose');
        if (settingsClose) settingsClose.addEventListener('click', () => {
            this.closeSettings();
        });

        const exportBackupBtn = document.getElementById('exportBackupBtn');
        if (exportBackupBtn) exportBackupBtn.addEventListener('click', () => {
            this.exportBackup();
        });

        // Modals
        const modalClose = document.getElementById('modalClose');
        if (modalClose) modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        const confirmCancel = document.getElementById('confirmCancel');
        if (confirmCancel) confirmCancel.addEventListener('click', () => {
            this.closeConfirmModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.scrollToGoalForm();
            }
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeConfirmModal();
                this.closeSettings();
            }
        });
    }

    // Switch between views
    switchView(view) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const navId = `nav${view.charAt(0).toUpperCase() + view.slice(1)}`;
        const navEl = document.getElementById(navId);
        if (navEl) navEl.classList.add('active');

        // Show/hide sections
        if (view === 'analytics') {
            const analyticsSection = document.getElementById('analyticsSection');
            if (analyticsSection) analyticsSection.scrollIntoView({ behavior: 'smooth' });
            if (this.analyticsManager) this.analyticsManager.updateCharts();
        }
    }

    // Update year display
    updateYear() {
        const year = new Date().getFullYear();
        document.getElementById('currentYear').textContent = year;
        document.getElementById('footerYear').textContent = year;
    }

    // Update user info
    updateUserInfo() {
        const data = this.goalManager && this.goalManager.storage ? this.goalManager.storage.load() : null;
        const user = data ? data.user : null;
        const nameEl = document.getElementById('navUserName');
        const avatarEl = document.getElementById('navUserAvatar');
        if (user) {
            if (nameEl) nameEl.textContent = user.name || '';
            if (avatarEl) avatarEl.textContent = user.avatar || '';
        }
    }

    // Render dashboard
    renderDashboard() {
        this.renderStats();
        this.renderGoals();
        this.renderAchievements();
        this.renderUpcomingDeadlines();
        this.analyticsManager.initialize();
    }

    // Render statistics
    renderStats() {
        const stats = this.goalManager.getStats();
        const container = document.getElementById('statsContainer');
        
        const statCards = [
            {
                id: 'totalResolutions',
                value: stats.totalGoals,
                label: 'Total Goals',
                change: '+0'
            },
            {
                id: 'completionRate',
                value: `${stats.completionRate}%`,
                label: 'Completion Rate',
                change: stats.completionRate > 50 ? '+5%' : '-5%',
                changeClass: stats.completionRate > 50 ? 'positive' : 'negative'
            },
            {
                id: 'currentStreak',
                value: stats.longestStreak,
                label: 'Current Streak',
                change: '+0'
            },
            {
                id: 'totalDays',
                value: stats.totalCompletedDays,
                label: 'Days Completed',
                change: '+0'
            }
        ];

        // Update header stats
        const activeGoalsCountEl = document.getElementById('activeGoalsCount');
        const totalStreakEl = document.getElementById('totalStreak');
        const overallCompletionEl = document.getElementById('overallCompletion');
        if (activeGoalsCountEl) activeGoalsCountEl.textContent = stats.activeGoals;
        if (totalStreakEl) totalStreakEl.textContent = stats.longestStreak;
        if (overallCompletionEl) overallCompletionEl.textContent = `${stats.completionRate}%`;

        // Render stat cards
        container.innerHTML = statCards.map(stat => `
            <div class="stat-card">
                <div class="stat-value" id="${stat.id}">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
                <div class="stat-change ${stat.changeClass || 'positive'}">${stat.change}</div>
            </div>
        `).join('');
    }

    // Render goals
    renderGoals() {
        const goals = this.goalManager.getGoals(this.currentFilter);
        const container = document.getElementById('goalsContainer');
        
        if (goals.length === 0) {
            container.innerHTML = document.getElementById('emptyState').outerHTML;
            return;
        }

        container.innerHTML = goals.map(goal => this.createGoalCard(goal)).join('');
        this.attachGoalEventListeners();
    }

    // Create goal card HTML
    createGoalCard(goal) {
        const completion = this.goalManager.calculateCompletion(goal);
        const weekDays = this.goalManager.getWeekDays(goal);
        const categoryLabel = this.goalManager.categories[goal.category] || goal.category;
        
        return `
            <div class="goal-item" data-goal-id="${goal.id}">
                <div class="goal-priority ${goal.priority}"></div>
                
                <div class="goal-header">
                    <div>
                        <h3 class="goal-title">${this.escapeHtml(goal.name)}</h3>
                        <span class="goal-category">${categoryLabel}</span>
                    </div>
                    <div class="goal-actions">
                        <button class="btn btn-sm btn-secondary" onclick="app.ui.toggleGoalStatus(${goal.id})">
                            <i class="fas fa-${goal.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="btn btn-sm" onclick="app.ui.editGoal(${goal.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.ui.deleteGoal(${goal.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                ${goal.description ? `<p class="goal-description">${this.escapeHtml(goal.description)}</p>` : ''}
                
                <div class="goal-streak">
                    <i class="fas fa-fire"></i>
                    <span class="streak-count">${goal.streak} day streak</span>
                </div>
                
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${completion}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>Progress</span>
                        <span>${completion}%</span>
                    </div>
                </div>
                
                <div class="goal-days">
                    ${weekDays.map(day => `
                        <button class="day ${day.completed ? 'completed' : ''} ${day.today ? 'today' : ''} ${day.future ? 'future' : ''}"
                                data-date="${day.date}"
                                data-goal-id="${goal.id}"
                                ${day.future ? 'disabled' : ''}
                                aria-label="${day.day}, ${day.date}">
                            ${day.day}
                        </button>
                    `).join('')}
                </div>
                
                ${goal.milestones && goal.milestones.length > 0 ? `
                    <div class="goal-milestones">
                        <h4><i class="fas fa-trophy"></i> Milestones</h4>
                        <div class="milestones-list">
                            ${goal.milestones.map(milestone => `
                                <div class="milestone ${milestone.achieved ? 'achieved' : ''}">
                                    <i class="fas fa-${milestone.achieved ? 'check-circle' : 'circle'}"></i>
                                    <span>${this.escapeHtml(milestone.name)}</span>
                                    ${milestone.achievedDate ? `<span class="milestone-date">${milestone.achievedDate}</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Attach event listeners to goal cards
    attachGoalEventListeners() {
        document.querySelectorAll('.day:not(.future)').forEach(dayBtn => {
            dayBtn.addEventListener('click', (e) => {
                const goalId = parseInt(e.target.dataset.goalId);
                const date = e.target.dataset.date;
                this.toggleDayCompletion(goalId, date);
            });
        });
    }

    // Create a new goal
    createGoal() {
        const form = document.getElementById('goalForm');
        const name = document.getElementById('goalName').value.trim();
        const category = document.getElementById('goalCategory').value;
        const target = document.getElementById('goalTarget').value;
        const priority = document.getElementById('goalPriority').value;
        const description = document.getElementById('goalDescription').value.trim();

        if (!name || !category || !target) {
            this.showNotification('Please fill in all required fields', 'warning');
            return;
        }

        const goal = this.goalManager.createGoal({
            name,
            category,
            target,
            priority,
            description
        });

        form.reset();
        this.renderDashboard();
        this.showNotification(`Goal "${name}" created successfully!`, 'success');
        
        // Scroll to the new goal
        setTimeout(() => {
            const newGoal = document.querySelector(`[data-goal-id="${goal.id}"]`);
            if (newGoal) {
                newGoal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    }

    // Toggle day completion
    toggleDayCompletion(goalId, date) {
        const result = this.goalManager.toggleDayCompletion(goalId, date);
        if (result) {
            this.renderGoals();
            this.renderStats();
            this.showNotification(
                `${result.completed ? 'Completed' : 'Removed'} "${result.goal.name}" for ${date}`,
                result.completed ? 'success' : 'warning'
            );
        }
    }

    // Toggle goal status (active/paused)
    toggleGoalStatus(goalId) {
        const goal = this.goalManager.goals.find(g => g.id === goalId);
        if (!goal) return;

        goal.status = goal.status === 'active' ? 'paused' : 'active';
        this.goalManager.save();
        this.renderGoals();
        this.showNotification(
            `${goal.status === 'active' ? 'Resumed' : 'Paused'} goal "${goal.name}"`,
            'info'
        );
    }

    // Edit goal
    editGoal(goalId) {
        const goal = this.goalManager.goals.find(g => g.id === goalId);
        if (!goal) return;

        const modalContent = document.getElementById('goalModalContent');
        modalContent.innerHTML = `
            <form id="editGoalForm">
                <div class="form-group">
                    <label for="editGoalName">Goal Name</label>
                    <input type="text" id="editGoalName" value="${this.escapeHtml(goal.name)}" required>
                </div>
                <div class="form-group">
                    <label for="editGoalDescription">Description</label>
                    <textarea id="editGoalDescription">${this.escapeHtml(goal.description)}</textarea>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="editGoalCategory">Category</label>
                        <select id="editGoalCategory">
                            ${Object.entries(this.goalManager.categories).map(([key, label]) => `
                                <option value="${key}" ${goal.category === key ? 'selected' : ''}>${label}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editGoalTarget">Target Days/Week</label>
                        <select id="editGoalTarget">
                            ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                <option value="${num}" ${goal.goal.target === num ? 'selected' : ''}>
                                    ${num === 7 ? 'Daily' : num + ' days'}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-success">Save Changes</button>
                </div>
            </form>
        `;

        document.getElementById('editGoalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGoalEdit(goalId);
        });

        this.openModal('goalModal');
    }

    // Save goal edit
    saveGoalEdit(goalId) {
        const name = document.getElementById('editGoalName').value.trim();
        const description = document.getElementById('editGoalDescription').value.trim();
        const category = document.getElementById('editGoalCategory').value;
        const target = document.getElementById('editGoalTarget').value;

        const updatedGoal = this.goalManager.updateGoal(goalId, {
            name,
            description,
            category,
            goal: { target: parseInt(target) }
        });

        if (updatedGoal) {
            this.closeModal();
            this.renderDashboard();
            this.showNotification(`Goal "${name}" updated successfully!`, 'success');
        }
    }

    // Delete goal with confirmation
    deleteGoal(goalId) {
        const goal = this.goalManager.goals.find(g => g.id === goalId);
        if (!goal) return;

        this.openConfirmModal(
            'Delete Goal',
            `Are you sure you want to delete "${goal.name}"? This action cannot be undone.`,
            () => {
                this.goalManager.deleteGoal(goalId);
                this.renderDashboard();
                this.showNotification(`Deleted goal "${goal.name}"`, 'warning');
            }
        );
    }

    // Render achievements
    renderAchievements() {
        const filter = document.getElementById('achievementFilter').value;
        const achievements = this.goalManager.getAchievements(filter);
        const container = document.getElementById('achievementList');
        
        if (achievements.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: var(--gray-400); padding: 20px;">No achievements yet</p>';
            return;
        }

        container.innerHTML = achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon" style="background: ${achievement.color === 'gold' ? 'linear-gradient(135deg, var(--gold-color), #f59e0b)' : 'linear-gradient(135deg, var(--accent-color), #dc2626)'}">
                    <i class="fas fa-${achievement.icon}"></i>
                </div>
                <div class="achievement-content">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            </div>
        `).join('');
    }

    // Render upcoming deadlines
    renderUpcomingDeadlines() {
        const container = document.getElementById('upcomingDeadlines');
        const today = new Date();
        const upcomingDays = [];
        
        // Generate next 7 days
        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            upcomingDays.push(this.goalManager.formatDate(date));
        }
        
        // Check for goals with upcoming milestones
        const deadlines = [];
        this.goalManager.goals.forEach(goal => {
            goal.milestones.forEach(milestone => {
                if (!milestone.achieved && milestone.target) {
                    const daysToTarget = milestone.target - goal.history.length;
                    if (daysToTarget > 0 && daysToTarget <= 7) {
                        deadlines.push({
                            name: goal.name,
                            milestone: milestone.name,
                            daysToTarget,
                            priority: daysToTarget <= 2 ? 'high' : daysToTarget <= 4 ? 'medium' : 'low'
                        });
                    }
                }
            });
        });
        
        if (deadlines.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: var(--gray-400); padding: 20px;">No upcoming deadlines</p>';
            return;
        }
        
        container.innerHTML = deadlines.sort((a, b) => a.daysToTarget - b.daysToTarget).map(deadline => `
            <div class="deadline-item">
                <div class="deadline-header">
                    <div class="deadline-name">${deadline.milestone}</div>
                    <span class="deadline-priority ${deadline.priority}">${deadline.daysToTarget} day${deadline.daysToTarget === 1 ? '' : 's'}</span>
                </div>
                <div class="deadline-date">
                    <i class="far fa-calendar"></i> ${deadline.name}
                </div>
            </div>
        `).join('');
    }

    // Export data
    exportData() {
        this.goalManager.storage.exportData();
        this.showNotification('Data exported successfully!', 'success');
    }

    // Generate report
    generateReport() {
        const report = this.analyticsManager.generateReport();
        
        // Display report in console for now
        console.log('GoalTracker Pro Report', report);
        
        // Create a downloadable report
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `goal_report_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Report generated and downloaded!', 'success');
    }

    // Export backup
    exportBackup() {
        this.goalManager.storage.exportData();
        this.showNotification('Backup exported successfully!', 'success');
    }

    // Open settings modal
    openSettings() {
        const settings = this.goalManager.storage.load().settings;
        
        // Populate settings form
        document.getElementById('themeSetting').value = settings.theme;
        document.getElementById('weekStart').value = settings.weekStartsOn;
        document.getElementById('enableNotifications').checked = settings.notifications;
        document.getElementById('notificationTime').value = settings.notificationTime || '09:00';
        document.getElementById('autoSave').checked = settings.autoSave;
        document.getElementById('backupFrequency').value = settings.backupFrequency || 'weekly';
        
        document.getElementById('settingsModal').classList.add('open');
    }

    // Close settings modal
    closeSettings() {
        document.getElementById('settingsModal').classList.remove('open');
    }

    // Save settings
    saveSettings() {
        const settings = {
            theme: document.getElementById('themeSetting').value,
            weekStartsOn: document.getElementById('weekStart').value,
            notifications: document.getElementById('enableNotifications').checked,
            notificationTime: document.getElementById('notificationTime').value,
            autoSave: document.getElementById('autoSave').checked,
            backupFrequency: document.getElementById('backupFrequency').value
        };
        
        const data = this.goalManager.storage.load();
        data.settings = { ...data.settings, ...settings };
        this.goalManager.storage.save(data);
        
        // Apply theme via app helper if available
        if (window && window.app && typeof window.app.applyTheme === 'function') {
            window.app.applyTheme(settings.theme);
        } else {
            if (settings.theme === 'dark') {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
            } else if (settings.theme === 'light') {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.remove('light-mode');
            }
        }
        
        this.closeSettings();
        this.showNotification('Settings saved successfully!', 'success');
    }

    // Open modal
    openModal(modalId) {
        document.getElementById(modalId).classList.add('open');
    }

    // Close modal
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('open');
        });
    }

    // Open confirmation modal
    openConfirmModal(title, message, action) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmAction').onclick = action;
        document.getElementById('confirmModal').classList.add('open');
    }

    // Close confirmation modal
    closeConfirmModal() {
        document.getElementById('confirmModal').classList.remove('open');
    }

    // Scroll to goal form
    scrollToGoalForm() {
        document.getElementById('goalName').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('goalName').focus();
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle',
            error: 'times-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="notification-message">${this.escapeHtml(message)}</div>
                <div class="notification-time">Just now</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        document.getElementById('notificationCenter').prepend(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Escape HTML to prevent XSS
    escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Open user profile modal
    openProfile() {
        const data = this.goalManager.storage.load();
        const user = data.user || {};
        const stats = this.goalManager.getStats();
        
        // Fill in profile form with current data
        document.getElementById('profileName').value = user.name || '';
        document.getElementById('profileEmail').value = user.email || '';
        document.getElementById('profileRole').value = user.role || '';
        document.getElementById('profileBio').value = user.bio || '';
        document.getElementById('profileLocation').value = user.location || '';
        document.getElementById('profilePhone').value = user.phone || '';
        document.getElementById('profileTimezone').value = user.timezone || '';
        
        // Update profile avatar with initials
        const initials = this.getInitials(user.name || 'PU');
        document.getElementById('profileAvatar').textContent = initials;
        document.getElementById('navUserAvatar').textContent = initials;
        
        // Update profile statistics
        document.getElementById('profileTotalGoals').textContent = stats.totalGoals;
        document.getElementById('profileCompletionRate').textContent = stats.completionRate + '%';
        
        // Calculate days active
        const created = new Date(data.created);
        const now = new Date();
        const daysActive = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        document.getElementById('profileDaysActive').textContent = daysActive;
        
        this.openModal('profileModal');
    }

    // Save user profile
    saveProfile() {
        const name = document.getElementById('profileName').value.trim();
        const email = document.getElementById('profileEmail').value.trim();
        const role = document.getElementById('profileRole').value.trim();
        const bio = document.getElementById('profileBio').value.trim();
        const location = document.getElementById('profileLocation').value.trim();
        const phone = document.getElementById('profilePhone').value.trim();
        const timezone = document.getElementById('profileTimezone').value.trim();
        
        // Validate required fields
        if (!name || !email) {
            this.showNotification('Please fill in required fields (Name and Email)', 'warning');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'warning');
            return;
        }
        
        // Update user data in storage
        const data = this.goalManager.storage.load();
        data.user = {
            name,
            email,
            role,
            bio,
            location,
            phone,
            timezone,
            avatar: this.getInitials(name),
            updatedAt: new Date().toISOString()
        };
        
        this.goalManager.storage.save(data);
        
        // Update UI
        this.updateUserInfo();
        
        this.showNotification('Profile saved successfully!', 'success');
        this.closeModal();
    }

    // Change avatar (show initials customization)
    changeAvatar() {
        const name = document.getElementById('profileName').value.trim();
        if (!name) {
            this.showNotification('Please enter your name first', 'warning');
            return;
        }
        
        const initials = this.getInitials(name);
        document.getElementById('profileAvatar').textContent = initials;
        this.showNotification(`Avatar updated to "${initials}"`, 'info');
    }

    // Get initials from name
    getInitials(name) {
        if (!name) return 'PU';
        const parts = name.trim().split(' ');
        
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else {
            return name.substring(0, 2).toUpperCase();
        }
    }

    // Close profile modal
    closeProfile() {
        this.closeModal();
    }

}
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

        const goalCancelBtn = document.getElementById('goalCancelBtn');
        if (goalCancelBtn) goalCancelBtn.addEventListener('click', () => {
            this.closeModal();
        });

        const confirmCancelBtn = document.getElementById('confirmCancel');
        if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', () => {
            this.closeConfirmModal();
        });

        const navUserAvatar = document.getElementById('navUserAvatar');
        if (navUserAvatar) navUserAvatar.addEventListener('click', () => {
            this.openProfile();
        });

        // Settings save button
        // Settings are saved via the `settingsForm` submit handler in `app.js`.
        // Keep explicit button binding out to avoid duplicate handlers when element IDs differ.

        // Profile form submit is handled by the form's submit event (see app.js)

        // Change avatar button
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        if (changeAvatarBtn) changeAvatarBtn.addEventListener('click', () => {
            this.changeAvatar();
        });

        // Close profile button (ID in markup: 'profileClose')
        const closeProfileBtn = document.getElementById('profileClose');
        if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => {
            this.closeProfile();
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

        // Goal action buttons (event delegation)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.goal-action-btn');
            if (!btn) return;

            const goalId = parseInt(btn.dataset.goalId);
            const action = btn.dataset.action;

            try {
                switch (action) {
                    case 'toggle':
                        this.toggleGoalStatus(goalId);
                        break;
                    case 'edit':
                        this.editGoal(goalId);
                        break;
                    case 'delete':
                        this.deleteGoal(goalId);
                        break;
                }
            } catch (error) {
                console.error(`Error performing action '${action}' on goal ${goalId}:`, error);
                this.showNotification('Error performing action', 'error');
            }
        });

        // Add event listener for day completion toggling
        document.addEventListener('click', (e) => {
            const dayBtn = e.target.closest('.day:not(.future)');
            if (!dayBtn) return;

            const goalId = parseInt(dayBtn.dataset.goalId);
            const date = dayBtn.dataset.date;
            this.toggleDayCompletion(goalId, date);
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
        } else if (view === 'dashboard') {
            const dashboardSection = document.querySelector('.container') || document.body;
            if (dashboardSection) dashboardSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Update year display
    updateYear() {
        const year = new Date().getFullYear();
        const currentYearEl = document.getElementById('currentYear');
        const footerYearEl = document.getElementById('footerYear');
        if (currentYearEl) currentYearEl.textContent = year;
        if (footerYearEl) footerYearEl.textContent = year;
    }

    // Update user info
    updateUserInfo() {
        const data = this.goalManager && this.goalManager.storage ? this.goalManager.storage.load() : null;
        const user = data ? data.user : null;
        const nameEl = document.getElementById('navUserName');
        const avatarEl = document.getElementById('navUserAvatar');
        if (user) {
            if (nameEl) nameEl.textContent = user.name || '';
            if (avatarEl) avatarEl.textContent = this.getInitials(user.name || '');
        }
    }

    // Render dashboard
    renderDashboard() {
        this.renderStats();
        this.renderGoals();
        this.renderUpcomingDeadlines();
        if (this.analyticsManager && this.analyticsManager.initialize) {
            this.analyticsManager.initialize();
        }
    }

    // Render statistics
    renderStats() {
        const stats = this.goalManager.getStats ? this.goalManager.getStats() : {
            totalGoals: 0,
            completionRate: 0,
            longestStreak: 0,
            totalCompletedDays: 0,
            activeGoals: 0
        };
        const container = document.getElementById('statsContainer');
        if (!container) return;
        
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
        const goals = this.goalManager.getGoals ? this.goalManager.getGoals(this.currentFilter) : [];
        const container = document.getElementById('goalsContainer');
        if (!container) return;
        
        const emptyState = document.getElementById('emptyState');
        if (goals.length === 0) {
            if (emptyState) {
                container.innerHTML = emptyState.outerHTML;
            } else {
                container.innerHTML = '<div class="empty-state">No goals found. Create your first goal!</div>';
            }
            return;
        }

        container.innerHTML = goals.map(goal => this.createGoalCard(goal)).join('');
    }

    // Create goal card HTML
    createGoalCard(goal) {
        const completion = this.goalManager.calculateCompletion ? this.goalManager.calculateCompletion(goal) : 0;
        const weekDays = this.goalManager.getWeekDays ? this.goalManager.getWeekDays(goal) : [];
        const categories = this.goalManager.categories || {};
        const categoryLabel = categories[goal.category] || goal.category;
        
        return `
            <div class="goal-item" data-goal-id="${goal.id}">
                <div class="goal-priority ${goal.priority || 'medium'}"></div>
                
                <div class="goal-header">
                    <div>
                        <h3 class="goal-title">${this.escapeHtml(goal.name)}</h3>
                        <span class="goal-category">${categoryLabel}</span>
                    </div>
                    <div class="goal-actions">
                        <button class="btn btn-sm btn-secondary goal-action-btn" data-action="toggle" data-goal-id="${goal.id}" title="Toggle goal status" aria-label="Toggle ${goal.name} status">
                            <i class="fas fa-${goal.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="btn btn-sm goal-action-btn" data-action="edit" data-goal-id="${goal.id}" title="Edit goal" aria-label="Edit ${goal.name}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger goal-action-btn" data-action="delete" data-goal-id="${goal.id}" title="Delete goal" aria-label="Delete ${goal.name}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                ${goal.description ? `<p class="goal-description">${this.escapeHtml(goal.description)}</p>` : ''}
                
                <div class="goal-streak">
                    <i class="fas fa-fire"></i>
                    <span class="streak-count">${goal.streak || 0} day streak</span>
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

        if (!this.goalManager || !this.goalManager.createGoal) {
            this.showNotification('Goal manager not properly initialized', 'error');
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
        if (!this.goalManager || !this.goalManager.toggleDayCompletion) {
            this.showNotification('Goal manager not properly initialized', 'error');
            return;
        }

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
        try {
            if (!this.goalManager || !this.goalManager.goals) {
                this.showNotification('Goal manager not properly initialized', 'error');
                return;
            }

            const goal = this.goalManager.goals.find(g => g.id === goalId);
            if (!goal) {
                console.error('Goal not found:', goalId);
                this.showNotification('Goal not found', 'error');
                return;
            }

            goal.status = goal.status === 'active' ? 'paused' : 'active';
            this.goalManager.save();
            this.renderGoals();
            this.showNotification(
                `${goal.status === 'active' ? 'Resumed' : 'Paused'} goal "${goal.name}"`,
                'info'
            );
        } catch (error) {
            console.error('Error toggling goal status:', error);
            this.showNotification('Error toggling goal status', 'error');
        }
    }

    // Edit goal
    editGoal(goalId) {
        if (!this.goalManager || !this.goalManager.goals) {
            this.showNotification('Goal manager not properly initialized', 'error');
            return;
        }

        const goal = this.goalManager.goals.find(g => g.id === goalId);
        if (!goal) return;

        const modalContent = document.getElementById('goalModalContent');
        if (!modalContent) return;

        modalContent.innerHTML = `
            <form id="editGoalForm">
                <div class="form-group">
                    <label for="editGoalName">Goal Name</label>
                    <input type="text" id="editGoalName" value="${this.escapeHtml(goal.name)}" required>
                </div>
                <div class="form-group">
                    <label for="editGoalDescription">Description</label>
                    <textarea id="editGoalDescription">${this.escapeHtml(goal.description || '')}</textarea>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="editGoalCategory">Category</label>
                        <select id="editGoalCategory">
                            ${Object.entries(this.goalManager.categories || {}).map(([key, label]) => `
                                <option value="${key}" ${goal.category === key ? 'selected' : ''}>${label}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editGoalTarget">Target Days/Week</label>
                        <select id="editGoalTarget">
                            ${[1, 2, 3, 4, 5, 6, 7].map(num => `
                                    <option value="${num}" ${goal.goal && goal.goal.target === num ? 'selected' : ''}>
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

        const editGoalForm = document.getElementById('editGoalForm');
        if (editGoalForm) {
            editGoalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveGoalEdit(goalId);
            });
        }

        this.openModal('goalModal');
    }

    // Save goal edit
    saveGoalEdit(goalId) {
        const name = document.getElementById('editGoalName').value.trim();
        const description = document.getElementById('editGoalDescription').value.trim();
        const category = document.getElementById('editGoalCategory').value;
        const target = document.getElementById('editGoalTarget').value;

        if (!this.goalManager || !this.goalManager.updateGoal) {
            this.showNotification('Goal manager not properly initialized', 'error');
            return;
        }

        const existingGoal = this.goalManager.goals.find(g => g.id === goalId) || {};
        const updatedGoal = this.goalManager.updateGoal(goalId, {
            name,
            description,
            category,
            goal: {
                ...(existingGoal.goal || {}),
                target: parseInt(target)
            }
        });

        if (updatedGoal) {
            this.closeModal();
            this.renderDashboard();
            this.showNotification(`Goal "${name}" updated successfully!`, 'success');
        }
    }

    // Delete goal with confirmation
    deleteGoal(goalId) {
        if (!this.goalManager || !this.goalManager.goals) {
            this.showNotification('Goal manager not properly initialized', 'error');
            return;
        }

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
        if (!this.goalManager || !this.goalManager.getAchievements) return;

        const filter = document.getElementById('achievementFilter');
        if (!filter) return;

        const achievements = this.goalManager.getAchievements(filter.value);
        const container = document.getElementById('achievementList');
        if (!container) return;
        
        if (achievements.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: var(--gray-400); padding: 20px;">No achievements yet</p>';
            return;
        }

        container.innerHTML = achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon" style="background: ${achievement.color === 'gold' ? 'linear-gradient(135deg, var(--gold-color), #f59e0b)' : 'linear-gradient(135deg, var(--accent-color), #dc2626)'}">
                    <i class="fas fa-${achievement.icon || 'trophy'}"></i>
                </div>
                <div class="achievement-content">
                    <div class="achievement-title">${achievement.title || ''}</div>
                    <div class="achievement-description">${achievement.description || ''}</div>
                </div>
            </div>
        `).join('');
    }

    // Render upcoming deadlines
    renderUpcomingDeadlines() {
        const container = document.getElementById('upcomingDeadlines');
        if (!container) return;

        if (!this.goalManager || !this.goalManager.goals) {
            container.innerHTML = '<p class="text-center" style="color: var(--gray-400); padding: 20px;">No upcoming deadlines</p>';
            return;
        }

        const today = new Date();
        const deadlines = [];
        
        // Check for goals with upcoming milestones
        this.goalManager.goals.forEach(goal => {
            if (goal.milestones) {
                goal.milestones.forEach(milestone => {
                    if (!milestone.achieved && milestone.target) {
                        const daysToTarget = milestone.target - (goal.history ? goal.history.length : 0);
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
            }
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
        if (!this.goalManager || !this.goalManager.storage || !this.goalManager.storage.exportData) {
            this.showNotification('Export functionality not available', 'error');
            return;
        }

        this.goalManager.storage.exportData();
        this.showNotification('Data exported successfully!', 'success');
    }

    // Generate report
    generateReport() {
        if (!this.analyticsManager || !this.analyticsManager.generateReport) {
            this.showNotification('Report generation not available', 'error');
            return;
        }

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
        if (!this.goalManager || !this.goalManager.storage || !this.goalManager.storage.exportData) {
            this.showNotification('Backup functionality not available', 'error');
            return;
        }

        this.goalManager.storage.exportData();
        this.showNotification('Backup exported successfully!', 'success');
    }

    // Open settings modal
    openSettings() {
        if (!this.goalManager || !this.goalManager.storage) {
            this.showNotification('Settings not available', 'error');
            return;
        }

        const data = this.goalManager.storage.load();
        const settings = data.settings || {};
        
        // Populate settings form
        const themeSetting = document.getElementById('themeSetting');
        const weekStart = document.getElementById('weekStart');
        const enableNotifications = document.getElementById('enableNotifications');
        const notificationTime = document.getElementById('notificationTime');
        const autoSave = document.getElementById('autoSave');
        const backupFrequency = document.getElementById('backupFrequency');
        
        if (themeSetting) themeSetting.value = settings.theme || 'auto';
        if (weekStart) weekStart.value = settings.weekStartsOn || 'monday';
        if (enableNotifications) enableNotifications.checked = settings.notifications || false;
        if (notificationTime) notificationTime.value = settings.notificationTime || '09:00';
        if (autoSave) autoSave.checked = settings.autoSave !== false;
        if (backupFrequency) backupFrequency.value = settings.backupFrequency || 'weekly';
        
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
        
        if (!this.goalManager || !this.goalManager.storage) {
            this.showNotification('Settings not available', 'error');
            return;
        }

        const data = this.goalManager.storage.load();
        data.settings = { ...data.settings, ...settings };
        this.goalManager.storage.save(data);
        
        // Apply theme
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else if (settings.theme === 'light') {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        } else {
            // Auto mode - check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
            } else {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
            }
        }
        
        this.closeSettings();
        this.showNotification('Settings saved successfully!', 'success');
    }

    // Open modal
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('open');
    }

    // Close modal
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('open');
        });
    }

    // Open confirmation modal
    openConfirmModal(title, message, action) {
        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmAction = document.getElementById('confirmAction');
        const confirmModal = document.getElementById('confirmModal');
        
        if (confirmTitle && confirmMessage && confirmAction && confirmModal) {
            confirmTitle.textContent = title;
            confirmMessage.textContent = message;
            // Wrap action so the modal closes after the action runs and errors are handled
            confirmAction.onclick = () => {
                try {
                    if (typeof action === 'function') action();
                } catch (err) {
                    console.error('Confirm action error:', err);
                }
                this.closeConfirmModal();
            };
            confirmModal.classList.add('open');
        }
    }

    // Close confirmation modal
    closeConfirmModal() {
        const confirmModal = document.getElementById('confirmModal');
        if (confirmModal) confirmModal.classList.remove('open');
    }

    // Scroll to goal form
    scrollToGoalForm() {
        const goalNameInput = document.getElementById('goalName');
        if (goalNameInput) {
            goalNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            goalNameInput.focus();
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notificationCenter = document.getElementById('notificationCenter');
        if (!notificationCenter) return;
        
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
        
        notificationCenter.prepend(notification);
        
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
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Open user profile modal
    openProfile() {
        if (!this.goalManager || !this.goalManager.storage) {
            this.showNotification('Profile not available', 'error');
            return;
        }

        const data = this.goalManager.storage.load();
        const user = data.user || {};
        const stats = this.goalManager.getStats ? this.goalManager.getStats() : { totalGoals: 0, completionRate: 0 };
        
        // Fill in profile form with current data
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileRole = document.getElementById('profileRole');
        const profileBio = document.getElementById('profileBio');
        const profileLocation = document.getElementById('profileLocation');
        const profilePhone = document.getElementById('profilePhone');
        const profileTimezone = document.getElementById('profileTimezone');
        const profileAvatar = document.getElementById('profileAvatar');
        const profileTotalGoals = document.getElementById('profileTotalGoals');
        const profileCompletionRate = document.getElementById('profileCompletionRate');
        const profileDaysActive = document.getElementById('profileDaysActive');
        
        if (profileName) profileName.value = user.name || '';
        if (profileEmail) profileEmail.value = user.email || '';
        if (profileRole) profileRole.value = user.role || '';
        if (profileBio) profileBio.value = user.bio || '';
        if (profileLocation) profileLocation.value = user.location || '';
        if (profilePhone) profilePhone.value = user.phone || '';
        if (profileTimezone) profileTimezone.value = user.timezone || '';
        
        // Update profile avatar with initials
        const initials = this.getInitials(user.name || 'PU');
        if (profileAvatar) profileAvatar.textContent = initials;
        
        // Update profile statistics
        if (profileTotalGoals) profileTotalGoals.textContent = stats.totalGoals;
        if (profileCompletionRate) profileCompletionRate.textContent = stats.completionRate + '%';
        
        // Calculate days active
        if (profileDaysActive) {
            const created = data.created ? new Date(data.created) : new Date();
            const now = new Date();
            const daysActive = Math.floor((now - created) / (1000 * 60 * 60 * 24));
            profileDaysActive.textContent = daysActive;
        }
        
        this.openModal('profileModal');
    }

    // Save user profile
    saveProfile() {
        try {
            const nameEl = document.getElementById('profileName');
            const emailEl = document.getElementById('profileEmail');
            
            if (!nameEl || !emailEl) {
                this.showNotification('Profile form elements missing', 'error');
                return;
            }
            
            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const roleEl = document.getElementById('profileRole');
            const bioEl = document.getElementById('profileBio');
            const locationEl = document.getElementById('profileLocation');
            const phoneEl = document.getElementById('profilePhone');
            const timezoneEl = document.getElementById('profileTimezone');
            
            const role = roleEl ? roleEl.value.trim() : '';
            const bio = bioEl ? bioEl.value.trim() : '';
            const location = locationEl ? locationEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const timezone = timezoneEl ? timezoneEl.value.trim() : '';
            
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
            if (!data.user) data.user = {};
            
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
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showNotification('Error saving profile. Please try again.', 'error');
        }
    }

    // Change avatar (show initials customization)
    changeAvatar() {
        const nameEl = document.getElementById('profileName');
        const avatarEl = document.getElementById('profileAvatar');
        
        if (!nameEl || !avatarEl) {
            this.showNotification('Avatar elements not found', 'error');
            return;
        }
        
        const name = nameEl.value.trim();
        if (!name) {
            this.showNotification('Please enter your name first', 'warning');
            return;
        }
        
        const initials = this.getInitials(name);
        avatarEl.textContent = initials;
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
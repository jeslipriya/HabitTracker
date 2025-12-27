// Main application controller
class GoalTrackerApp {
    constructor() {
        this.storage = new StorageManager();
        this.goalManager = new GoalManager(this.storage);
        this.analyticsManager = new AnalyticsManager(this.goalManager);
        this.ui = new UIManager(this.goalManager, this.analyticsManager);
    }

    // Initialize the application
    initialize() {
        // Initialize managers
        this.goalManager.initialize();
        this.ui.initialize();

        // Apply saved theme preference (dark/light/auto)
        try {
            const data = this.storage.load();
            const theme = data && data.settings && data.settings.theme ? data.settings.theme : 'auto';
            this.applyTheme(theme);
        } catch (err) {
            console.warn('Failed to apply theme on startup', err);
        }
        
        // Check for auto-backup
        this.checkAutoBackup();
        
        // Show welcome message
        this.showWelcomeMessage();
        
        // Make app available globally
        window.app = this;
    }

    // Check if auto-backup is needed
    checkAutoBackup() {
        if (this.storage.shouldBackup()) {
            this.storage.createBackup();
            console.log('Auto-backup created');
        }
    }

    // Show welcome message
    showWelcomeMessage() {
        const data = this.storage.load();
        const lastVisit = data.lastVisit ? new Date(data.lastVisit) : null;
        
        if (!lastVisit || (new Date() - lastVisit) > 24 * 60 * 60 * 1000) {
            this.ui.showNotification('Welcome to GoalTracker Pro! Start by creating your first goal.', 'info');
        }
        
        // Update last visit
        data.lastVisit = new Date().toISOString();
        this.storage.save(data);
    }

    // Get app version
    getVersion() {
        return this.storage.version;
    }

    // Apply theme: 'dark', 'light', or 'auto'
    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else if (theme === 'light') {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        } else {
            // 'auto' - remove explicit classes so prefers-color-scheme rules apply
            document.body.classList.remove('dark-mode');
            document.body.classList.remove('light-mode');
        }
    }

    // Get app statistics
    getAppStats() {
        const goalStats = this.goalManager.getStats();
        const storageUsage = this.storage.getStorageUsage();
        
        return {
            ...goalStats,
            storageUsage,
            version: this.getVersion(),
            lastUpdated: new Date().toISOString()
        };
    }

    // Reset application data (with confirmation)
    resetAppData() {
        this.ui.openConfirmModal(
            'Reset All Data',
            'Are you sure you want to reset all data? This will delete all goals and settings.',
            () => {
                this.storage.clear();
                window.location.reload();
            }
        );
    }

    // Import data from file
    importAppData(file) {
        this.storage.importData(file)
            .then(() => {
                // Reload the application
                window.location.reload();
            })
            .catch(error => {
                this.ui.showNotification(`Import failed: ${error.message}`, 'error');
            });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new GoalTrackerApp();
    app.initialize();
    
    // Add settings form submit handler
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        app.ui.saveSettings();
    });

    // Add profile modal handlers
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                app.ui.saveProfile();
            } catch (error) {
                console.error('Profile form submit error:', error);
                app.ui.showNotification('Error saving profile', 'error');
            }
        });
    }
    
    const profileClose = document.getElementById('profileClose');
    if (profileClose) {
        profileClose.addEventListener('click', () => {
            try {
                app.ui.closeProfile();
            } catch (error) {
                console.error('Error closing profile:', error);
            }
        });
    }
    
    const profileCancel = document.getElementById('profileCancel');
    if (profileCancel) {
        profileCancel.addEventListener('click', () => {
            try {
                app.ui.closeProfile();
            } catch (error) {
                console.error('Error canceling profile:', error);
            }
        });
    }
    
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => {
            try {
                app.ui.changeAvatar();
            } catch (error) {
                console.error('Error changing avatar:', error);
                app.ui.showNotification('Error changing avatar', 'error');
            }
        });
    }
    
    // Open profile when clicking user avatar in navigation
    const navUserAvatar = document.getElementById('navUserAvatar');
    if (navUserAvatar) {
        navUserAvatar.addEventListener('click', () => {
            try {
                app.ui.openProfile();
            } catch (error) {
                console.error('Error opening profile:', error);
                app.ui.showNotification('Error opening profile', 'error');
            }
        });
        navUserAvatar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                try {
                    app.ui.openProfile();
                } catch (error) {
                    console.error('Error opening profile via keyboard:', error);
                }
            }
        });
    }
    
    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            try {
                app.ui.openConfirmModal(
                    'Reset Settings',
                    'Are you sure you want to reset all settings to defaults?',
                    () => {
                        try {
                            const data = app.storage.load();
                            data.settings = app.storage.getDefaultData().settings;
                            app.storage.save(data);
                            window.location.reload();
                        } catch (error) {
                            console.error('Error resetting settings:', error);
                            app.ui.showNotification('Error resetting settings', 'error');
                        }
                    }
                );
            } catch (error) {
                console.error('Error opening reset dialog:', error);
            }
        });
    }
    
    // Add import backup handler
    const importBackupBtn = document.getElementById('importBackupBtn');
    if (importBackupBtn) {
        importBackupBtn.addEventListener('click', () => {
            try {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    try {
                        const file = e.target.files[0];
                        if (file) {
                            app.ui.openConfirmModal(
                                'Import Backup',
                                'This will replace all current data with the backup. Continue?',
                                () => {
                                    try {
                                        app.importAppData(file);
                                    } catch (error) {
                                        console.error('Error importing backup:', error);
                                        app.ui.showNotification('Error importing backup', 'error');
                                    }
                                }
                            );
                        }
                    } catch (error) {
                        console.error('Error handling file:', error);
                        app.ui.showNotification('Error handling file', 'error');
                    }
                };
                input.click();
            } catch (error) {
                console.error('Error opening file dialog:', error);
            }
        });
    }
    
    // Add theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'btn';
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.zIndex = '1000';
    themeToggle.title = 'Toggle Theme';
    themeToggle.addEventListener('click', () => {
        const data = app.storage.load();
        const currentTheme = data.settings.theme;
        let newTheme;
        
        if (currentTheme === 'auto') {
            newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
        } else {
            newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        }
        
        data.settings.theme = newTheme;
        app.storage.save(data);
        
        // Apply theme using centralized helper
        try {
            app.applyTheme(newTheme);
        } catch (err) {
            // Fallback
            if (newTheme === 'dark') {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
            } else if (newTheme === 'light') {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.remove('light-mode');
            }
        }

        app.ui.showNotification(`Switched to ${newTheme} theme`, 'info');
    });
    
    document.body.appendChild(themeToggle);
});
class StorageManager {
    constructor() {
        this.version = '3.0';
        this.storageKey = 'goaltracker_pro_data';
    }

    // Save all data
    save(data) {
        const saveData = {
            ...data,
            version: this.version,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(saveData));
        return true;
    }

    // Load all data
    load() {
        const data = localStorage.getItem(this.storageKey);
        if (!data) return this.getDefaultData();

        try {
            const parsed = JSON.parse(data);
            
            // Migrate data if version is different
            if (parsed.version !== this.version) {
                return this.migrateData(parsed);
            }
            
            return parsed;
        } catch (error) {
            console.error('Failed to load data:', error);
            return this.getDefaultData();
        }
    }

    // Get default data structure
    getDefaultData() {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        return {
            version: this.version,
            user: {
                name: 'Professional User',
                email: 'user@example.com',
                role: 'premium',
                avatar: 'PU'
            },
            settings: {
                theme: 'auto',
                weekStartsOn: 'monday',
                notifications: true,
                autoSave: true,
                defaultView: 'dashboard',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                notificationTime: '09:00',
                backupFrequency: 'weekly'
            },
            goals: [],
            analytics: {
                history: [],
                achievements: [],
                streaks: []
            },
            created: new Date().toISOString()
        };
    }

    // Migrate data from older versions
    migrateData(oldData) {
        console.log('Migrating data from version', oldData.version, 'to', this.version);
        
        const migratedData = this.getDefaultData();
        
        // Migrate goals
        if (oldData.goals) {
            migratedData.goals = oldData.goals.map(goal => ({
                ...goal,
                status: goal.status || 'active',
                streak: goal.streak || 0,
                createdAt: goal.createdAt || new Date().toISOString().split('T')[0]
            }));
        }
        
        // Migrate user settings
        if (oldData.user) {
            migratedData.user = { ...migratedData.user, ...oldData.user };
        }
        
        if (oldData.settings) {
            migratedData.settings = { ...migratedData.settings, ...oldData.settings };
        }
        
        return migratedData;
    }

    // Export data as JSON file
    exportData() {
        const data = this.load();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `goaltracker_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
    }

    // Import data from JSON file
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (!data.goals || !Array.isArray(data.goals)) {
                        throw new Error('Invalid data format');
                    }
                    
                    // Save imported data
                    this.save(data);
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Clear all data
    clear() {
        localStorage.removeItem(this.storageKey);
        return true;
    }

    // Get storage usage
    getStorageUsage() {
        const data = localStorage.getItem(this.storageKey);
        const size = data ? new Blob([data]).size : 0;
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        return {
            used: size,
            max: maxSize,
            percentage: (size / maxSize) * 100
        };
    }

    // Auto-backup check
    shouldBackup() {
        const data = this.load();
        const lastBackup = data.lastBackup ? new Date(data.lastBackup) : null;
        
        if (!lastBackup) return true;
        
        const now = new Date();
        const daysSinceBackup = Math.floor((now - lastBackup) / (1000 * 60 * 60 * 24));
        
        const frequencyMap = {
            daily: 1,
            weekly: 7,
            monthly: 30
        };
        
        const frequency = frequencyMap[data.settings.backupFrequency] || 7;
        return daysSinceBackup >= frequency;
    }

    // Create backup
    createBackup() {
        const data = this.load();
        data.lastBackup = new Date().toISOString();
        this.save(data);
        
        // Store backup in separate key
        localStorage.setItem(
            `goaltracker_backup_${new Date().toISOString().split('T')[0]}`,
            JSON.stringify(data)
        );
        
        return true;
    }
}
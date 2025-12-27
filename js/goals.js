class GoalManager {
    constructor(storage) {
        this.storage = storage;
        this.goals = [];
        this.categories = {
            health: 'Health & Fitness',
            learning: 'Learning & Growth',
            productivity: 'Productivity',
            mindfulness: 'Mindfulness',
            finance: 'Financial',
            career: 'Career'
        };
    }

    // Initialize goals from storage
    initialize() {
        const data = this.storage.load();
        this.goals = data.goals || [];
        this.updateGoalsStatus();
    }

    // Create a new goal
    createGoal(goalData) {
        const goal = {
            id: Date.now(),
            name: goalData.name.trim(),
            description: goalData.description || '',
            category: goalData.category,
            priority: goalData.priority || 'medium',
            goal: {
                frequency: 'weekly',
                target: parseInt(goalData.target) || 3,
                unit: 'days'
            },
            history: [],
            milestones: this.generateMilestones(goalData),
            reminders: {
                enabled: true,
                time: '09:00'
            },
            createdAt: this.formatDate(new Date()),
            status: 'active',
            streak: 0,
            lastUpdated: new Date().toISOString()
        };

        this.goals.unshift(goal);
        this.save();
        return goal;
    }

    // Update an existing goal
    updateGoal(id, updates) {
        const index = this.goals.findIndex(goal => goal.id === id);
        if (index === -1) return null;

        const goal = { ...this.goals[index], ...updates, lastUpdated: new Date().toISOString() };
        this.goals[index] = goal;
        this.save();
        return goal;
    }

    // Delete a goal
    deleteGoal(id) {
        const index = this.goals.findIndex(goal => goal.id === id);
        if (index === -1) return false;

        this.goals.splice(index, 1);
        this.save();
        return true;
    }

    // Toggle goal completion for a specific date
    toggleDayCompletion(goalId, date) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return false;

        const index = goal.history.indexOf(date);
        let completed = false;

        if (index === -1) {
            goal.history.push(date);
            completed = true;
        } else {
            goal.history.splice(index, 1);
            completed = false;
        }

        // Update streak
        goal.streak = this.calculateStreak(goal.history);
        
        // Check milestones
        this.checkMilestones(goal);

        goal.lastUpdated = new Date().toISOString();
        this.save();
        
        return { completed, goal };
    }

    // Calculate streak based on history
    calculateStreak(history) {
        if (!history || history.length === 0) return 0;
        
        // Sort dates and remove duplicates
        const uniqueDates = [...new Set(history.map(d => d.split('T')[0]))]
            .sort()
            .reverse();
        
        if (uniqueDates.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date(uniqueDates[0]); // Start from most recent completion, not today
        
        for (let i = 0; i < uniqueDates.length; i++) {
            const expectedDate = new Date(currentDate);
            expectedDate.setDate(expectedDate.getDate() - i);
            const expectedDateStr = expectedDate.toISOString().split('T')[0];
            
            if (uniqueDates[i] === expectedDateStr) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    // Calculate goal completion percentage
    calculateCompletion(goal) {
        const target = goal.goal.target;
        const completed = goal.history.length;
        return Math.min(100, Math.round((completed / target) * 100));
    }

    // Get goals by filter
    getGoals(filter = 'all') {
        switch (filter) {
            case 'active':
                return this.goals.filter(goal => goal.status === 'active');
            case 'completed':
                return this.goals.filter(goal => goal.status === 'completed');
            case 'archived':
                return this.goals.filter(goal => goal.status === 'archived');
            default:
                return this.goals;
        }
    }

    // Generate milestones for a goal
    generateMilestones(goalData) {
        const target = parseInt(goalData.target) || 3;
        const milestones = [];
        
        if (target >= 7) {
            milestones.push(
                { name: "3-day streak", target: 3, achieved: false },
                { name: "7-day streak", target: 7, achieved: false },
                { name: "30-day streak", target: 30, achieved: false }
            );
        } else if (target >= 3) {
            milestones.push(
                { name: "First week", target: target, achieved: false },
                { name: "Two weeks", target: target * 2, achieved: false }
            );
        } else {
            milestones.push(
                { name: "First completion", target: target, achieved: false }
            );
        }
        
        return milestones;
    }

    // Check and update milestones
    checkMilestones(goal) {
        const completedDays = goal.history.length;
        
        goal.milestones = goal.milestones.map(milestone => ({
            ...milestone,
            achieved: milestone.achieved || completedDays >= milestone.target
        }));
        
        return goal.milestones.filter(m => m.achieved && !m.achievedDate).map(m => {
            m.achievedDate = new Date().toISOString().split('T')[0];
            return m;
        });
    }

    // Update goals status (active/completed/archived)
    updateGoalsStatus() {
        this.goals.forEach(goal => {
            const completion = this.calculateCompletion(goal);
            if (completion >= 100 && goal.status === 'active') {
                goal.status = 'completed';
            }
        });
        this.save();
    }

    // Get statistics
    getStats() {
        const totalGoals = this.goals.length;
        const activeGoals = this.goals.filter(g => g.status === 'active').length;
        const completedGoals = this.goals.filter(g => g.status === 'completed').length;
        
        const totalCompletedDays = this.goals.reduce((sum, goal) => sum + goal.history.length, 0);
        const totalTargetDays = this.goals.reduce((sum, goal) => sum + goal.goal.target, 0);
        
        const completionRate = totalTargetDays > 0 
            ? Math.round((totalCompletedDays / totalTargetDays) * 100) 
            : 0;
        
        const longestStreak = Math.max(...this.goals.map(g => g.streak || 0), 0);
        const averageCompletion = totalGoals > 0 
            ? Math.round(this.goals.reduce((sum, goal) => sum + this.calculateCompletion(goal), 0) / totalGoals)
            : 0;

        return {
            totalGoals,
            activeGoals,
            completedGoals,
            completionRate,
            totalCompletedDays,
            longestStreak,
            averageCompletion
        };
    }

    // Get category distribution
    getCategoryDistribution() {
        const distribution = {};
        
        this.goals.forEach(goal => {
            const category = this.categories[goal.category] || goal.category;
            distribution[category] = (distribution[category] || 0) + 1;
        });
        
        return distribution;
    }

    // Get completion history for time range
    getCompletionHistory(days = 30) {
        const history = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = this.formatDate(date);
            
            const completions = this.goals.reduce((count, goal) => {
                return count + (goal.history.includes(dateStr) ? 1 : 0);
            }, 0);
            
            history.push({
                date: dateStr,
                completions,
                day: date.toLocaleDateString('en-US', { weekday: 'short' })
            });
        }
        
        return history;
    }

    // Save goals to storage
    save() {
        const data = this.storage.load();
        data.goals = this.goals;
        this.storage.save(data);
    }

    // Helper function to format date as YYYY-MM-DD
    formatDate(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    // Get week days for a goal
    getWeekDays(goal) {
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const today = new Date();
        const weekStart = this.getWeekStart(today);
        
        return days.map((day, index) => {
            const date = this.dateForWeekIndex(weekStart, index);
            const isCompleted = goal.history.includes(date);
            const isToday = date === this.formatDate(today);
            const isFuture = new Date(date) > today;
            
            return {
                day,
                date,
                completed: isCompleted,
                today: isToday,
                future: isFuture
            };
        });
    }

    // Get week start date
    getWeekStart(date = new Date()) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = day === 0 ? 6 : day - 1; // Monday as start of week
        d.setDate(d.getDate() - diff);
        return this.formatDate(d);
    }

    // Get date for week index
    dateForWeekIndex(weekStart, index) {
        const base = new Date(weekStart);
        base.setDate(base.getDate() + index);
        return this.formatDate(base);
    }

    // Get achievements
    getAchievements(filter = 'week') {
        const achievements = [];
        const now = new Date();
        const timeFilter = filter === 'week' ? 7 : filter === 'month' ? 30 : Infinity;
        
        this.goals.forEach(goal => {
            // Check for new milestones
            goal.milestones.forEach(milestone => {
                if (milestone.achieved && milestone.achievedDate) {
                    const achievedDate = new Date(milestone.achievedDate);
                    const daysAgo = Math.floor((now - achievedDate) / (1000 * 60 * 60 * 24));
                    
                    if (daysAgo <= timeFilter) {
                        achievements.push({
                            type: 'milestone',
                            title: `Milestone Achieved: ${milestone.name}`,
                            description: goal.name,
                            date: milestone.achievedDate,
                            icon: 'trophy',
                            color: 'gold'
                        });
                    }
                }
            });
            
            // Check for streaks
            if (goal.streak >= 7 && goal.streak % 7 === 0) {
                achievements.push({
                    type: 'streak',
                    title: `${goal.streak}-Day Streak!`,
                    description: goal.name,
                    date: this.formatDate(now),
                    icon: 'fire',
                    color: 'orange'
                });
            }
        });
        
        // Sort by date (newest first)
        return achievements.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}
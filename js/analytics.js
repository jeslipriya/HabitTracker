class AnalyticsManager {
    constructor(goalManager) {
        this.goalManager = goalManager;
        this.charts = {};
    }

    // Initialize analytics charts
    initialize() {
        this.renderConsistencyChart();
        this.renderCategoryChart();
        this.renderCompletionChart();
    }

    // Render consistency trend chart
    renderConsistencyChart(days = 30) {
        const ctx = document.getElementById('consistencyChart');
        if (!ctx) return;

        const history = this.goalManager.getCompletionHistory(days);
        const labels = history.map(h => h.day);
        const data = history.map(h => h.completions);

        // Destroy existing chart if it exists
        if (this.charts.consistency) {
            this.charts.consistency.destroy();
        }

        this.charts.consistency = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Daily Completions',
                    data,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Completions'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    // Render category distribution chart
    renderCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        const distribution = this.goalManager.getCategoryDistribution();
        const categories = Object.keys(distribution);
        const counts = Object.values(distribution);

        // Color palette
        const colors = [
            '#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
        ];

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: counts,
                    backgroundColor: colors,
                    borderWidth: 1,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 15
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // Render completion rate chart
    renderCompletionChart() {
        const ctx = document.getElementById('completionChart');
        if (!ctx) return;

        const goals = this.goalManager.getGoals('active');
        const labels = goals.map(g => g.name.substring(0, 15) + (g.name.length > 15 ? '...' : ''));
        const completionRates = goals.map(g => this.goalManager.calculateCompletion(g));

        // Color based on completion rate
        const backgroundColors = completionRates.map(rate => {
            if (rate >= 75) return '#10b981';
            if (rate >= 50) return '#f59e0b';
            return '#ef4444';
        });

        if (this.charts.completion) {
            this.charts.completion.destroy();
        }

        this.charts.completion = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Completion %',
                    data: completionRates,
                    backgroundColor: backgroundColors,
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Completion %'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45
                        }
                    }
                }
            }
        });
    }

    // Update all charts
    updateCharts(timeRange = 30) {
        this.renderConsistencyChart(timeRange);
        this.renderCategoryChart();
        this.renderCompletionChart();
    }

    // Get overall analytics
    getOverallAnalytics() {
        const stats = this.goalManager.getStats();
        const distribution = this.goalManager.getCategoryDistribution();
        const history = this.goalManager.getCompletionHistory(7);
        
        // Calculate consistency score (based on last 7 days)
        const lastWeekCompletions = history.reduce((sum, day) => sum + day.completions, 0);
        const totalPossibleCompletions = this.goalManager.goals.length * 7;
        const consistencyScore = totalPossibleCompletions > 0 
            ? Math.round((lastWeekCompletions / totalPossibleCompletions) * 100)
            : 0;
        
        // Get most productive day
        const dayStats = {};
        history.forEach(day => {
            dayStats[day.day] = (dayStats[day.day] || 0) + day.completions;
        });
        
        const mostProductiveDay = Object.entries(dayStats).sort((a, b) => b[1] - a[1])[0];
        
        return {
            ...stats,
            consistencyScore,
            mostProductiveDay: mostProductiveDay ? {
                day: mostProductiveDay[0],
                completions: mostProductiveDay[1]
            } : null,
            categoryDistribution: distribution,
            weeklyTrend: history
        };
    }

    // Generate report
    generateReport() {
        const analytics = this.getOverallAnalytics();
        const reportDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const report = {
            generated: reportDate,
            summary: `You have ${analytics.totalGoals} goals with an overall completion rate of ${analytics.completionRate}%.`,
            performance: {
                consistency: `${analytics.consistencyScore}% consistency score`,
                streak: `${analytics.longestStreak} day longest streak`,
                averageCompletion: `${analytics.averageCompletion}% average completion`
            },
            recommendations: this.generateRecommendations(analytics),
            detailedStats: analytics
        };

        return report;
    }

    // Generate recommendations based on analytics
    generateRecommendations(analytics) {
        const recommendations = [];

        if (analytics.consistencyScore < 50) {
            recommendations.push('Try to be more consistent with your daily goals');
        }

        if (analytics.averageCompletion < 50) {
            recommendations.push('Consider adjusting goal targets if they feel too ambitious');
        }

        if (analytics.activeGoals === 0) {
            recommendations.push('Add some goals to get started!');
        } else if (analytics.activeGoals > 10) {
            recommendations.push('You might want to focus on fewer goals at once');
        }

        if (analytics.mostProductiveDay) {
            recommendations.push(`Your most productive day is ${analytics.mostProductiveDay.day}`);
        }

        return recommendations;
    }

    // Export analytics data
    exportAnalytics(format = 'json') {
        const data = this.getOverallAnalytics();
        
        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(data);
            default:
                return data;
        }
    }

    // Convert analytics to CSV
    convertToCSV(data) {
        const headers = ['Metric', 'Value'];
        const rows = [
            ['Total Goals', data.totalGoals],
            ['Active Goals', data.activeGoals],
            ['Completion Rate', `${data.completionRate}%`],
            ['Longest Streak', data.longestStreak],
            ['Consistency Score', `${data.consistencyScore}%`],
            ['Total Completed Days', data.totalCompletedDays]
        ];

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        return csv;
    }

    // Destroy all charts
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}
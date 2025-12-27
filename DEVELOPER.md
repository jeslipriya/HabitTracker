# GoalTracker Pro — Developer Documentation

Technical documentation for developers working with GoalTracker Pro codebase.

---

## 📁 Project Structure

```
HabitTracker/
├── index.html              # Main HTML file
├── README.md               # User guide
├── QUICKSTART.md           # Quick start guide
├── DEVELOPER.md            # This file
│
├── css/
│   ├── main.css            # Core styles & theme definitions
│   └── dashboard.css       # Dashboard-specific styles
│
└── js/
    ├── app.js              # Main application controller
    ├── storage.js          # LocalStorage manager
    ├── goals.js            # Goal management logic
    ├── ui.js               # UI rendering and event handling
    └── analytics.js        # Analytics and charts
```

---

## 🏗️ Architecture Overview

### MVC Pattern Implementation

```
View (UI)
  ↓
Controller (app.js)
  ↓
Models (goals.js, analytics.js, storage.js)
  ↓
Data (localStorage)
```

### Class Hierarchy

```
GoalTrackerApp (main controller)
├── StorageManager (data persistence)
├── GoalManager (goal CRUD & logic)
├── AnalyticsManager (charts & metrics)
└── UIManager (DOM & event handling)
```

---

## 🔑 Key Classes & APIs

### StorageManager (`js/storage.js`)

Handles all localStorage operations.

```javascript
// Constructor
const storage = new StorageManager()

// Methods
storage.save(data)              // Save data object to localStorage
storage.load()                  // Load data from localStorage
storage.getDefaultData()        // Get default data structure
storage.exportData()            // Export data as JSON file
storage.importData(file)        // Import data from JSON file
storage.clear()                 // Clear all data
storage.getStorageUsage()       // Get storage stats
storage.shouldBackup()          // Check if backup needed
storage.createBackup()          // Create automatic backup

// Properties
storage.version                 // Current version (3.0)
storage.storageKey              // localStorage key name
```

### GoalManager (`js/goals.js`)

Manages goal creation, updates, and analytics.

```javascript
// Constructor
const goalManager = new GoalManager(storage)

// Goal CRUD
goalManager.createGoal(goalData)      // Create new goal
goalManager.updateGoal(id, updates)   // Update goal
goalManager.deleteGoal(id)            // Delete goal
goalManager.getGoals(filter)          // Get filtered goals

// Goal Logic
goalManager.toggleDayCompletion(goalId, date)  // Mark day complete/incomplete
goalManager.calculateCompletion(goal)          // Get goal progress %
goalManager.calculateStreak(history)           // Calculate streak length
goalManager.checkMilestones(goal)              // Check milestone status

// Analytics
goalManager.getStats()                // Get overall statistics
goalManager.getCompletionHistory(days)        // Get daily completion data
goalManager.getCategoryDistribution()         // Get category breakdown
goalManager.getAchievements(filter)           // Get achievements
goalManager.getWeekDays(goal)                 // Get week day status

// Utility
goalManager.formatDate(date)          // Format date as YYYY-MM-DD
goalManager.getWeekStart(date)        // Get Monday of current week
```

### AnalyticsManager (`js/analytics.js`)

Generates charts and analytics insights.

```javascript
// Constructor
const analytics = new AnalyticsManager(goalManager)

// Initialization
analytics.initialize()                // Initialize all charts
analytics.updateCharts(timeRange)     // Update all charts

// Chart Rendering
analytics.renderConsistencyChart(days)      // Line chart (30 days)
analytics.renderCategoryChart()             // Doughnut chart
analytics.renderCompletionChart()           // Bar chart

// Analytics
analytics.getOverallAnalytics()       // Get comprehensive analytics
analytics.generateReport()            // Generate detailed report
analytics.generateRecommendations()   // Generate user recommendations
analytics.exportAnalytics(format)     // Export as JSON or CSV

// Cleanup
analytics.destroy()                   // Destroy all chart instances
```

### UIManager (`js/ui.js`)

Handles all UI rendering and user interactions.

```javascript
// Constructor
const ui = new UIManager(goalManager, analyticsManager)

// Initialization
ui.initialize()                       // Set up UI and event listeners
ui.setupEventListeners()              // Attach DOM event handlers
ui.renderDashboard()                  // Render all dashboard sections

// Rendering
ui.renderGoals()                      // Render goal cards
ui.renderStats()                      // Render stat cards
ui.renderAchievements()               // Render achievement list
ui.renderUpcomingDeadlines()          // Render deadline list
ui.createGoalCard(goal)               // Create goal card HTML

// User Actions
ui.createGoal()                       // Create new goal from form
ui.editGoal(goalId)                   // Open edit goal modal
ui.saveGoalEdit(goalId)               // Save goal changes
ui.deleteGoal(goalId)                 // Delete goal with confirmation
ui.toggleDayCompletion(goalId, date)  // Toggle day completion
ui.toggleGoalStatus(goalId)           // Pause/resume goal

// Settings
ui.openSettings()                     // Open settings modal
ui.saveSettings()                     // Save user settings
ui.openSettings()                     // Open settings modal

// Theme
ui.switchView(view)                   // Switch between views

// Modals
ui.openModal(modalId)                 // Open modal dialog
ui.closeModal()                       // Close current modal
ui.openConfirmModal(title, msg, fn)   // Open confirmation dialog
ui.closeConfirmModal()                // Close confirmation dialog

// Notifications
ui.showNotification(message, type)    // Show notification toast
ui.escapeHtml(str)                    // Escape HTML for security
```

### GoalTrackerApp (`js/app.js`)

Main application controller.

```javascript
// Constructor
const app = new GoalTrackerApp()

// Lifecycle
app.initialize()                      // Initialize all managers
app.applyTheme(theme)                 // Apply theme (dark/light/auto)

// Features
app.checkAutoBackup()                 // Check and create auto-backup
app.showWelcomeMessage()              // Show welcome notification
app.resetAppData()                    // Reset all data (with confirmation)
app.importAppData(file)               // Import data from file

// Utilities
app.getVersion()                      // Get app version
app.getAppStats()                     // Get comprehensive app stats
```

---

## 💾 Data Structure

### Complete Data Model

```javascript
{
  version: "3.0",
  lastUpdated: "2024-12-27T10:30:00Z",
  user: {
    name: "Professional User",
    email: "user@example.com",
    role: "premium",
    avatar: "PU"
  },
  settings: {
    theme: "auto",              // 'dark', 'light', 'auto'
    weekStartsOn: "monday",     // 'monday', 'sunday'
    notifications: true,
    autoSave: true,
    defaultView: "dashboard",
    timezone: "America/New_York",
    notificationTime: "09:00",
    backupFrequency: "weekly"
  },
  goals: [
    {
      id: 1703688000000,
      name: "Daily Meditation",
      description: "10 minutes mindfulness",
      category: "mindfulness",
      priority: "medium",              // 'high', 'medium', 'low'
      goal: {
        frequency: "weekly",
        target: 7,                      // days per week
        unit: "days"
      },
      history: ["2024-12-20", "2024-12-21", ...],  // Completed dates
      milestones: [
        {
          name: "7-day streak",
          target: 7,
          achieved: true,
          achievedDate: "2024-12-25"
        },
        ...
      ],
      reminders: {
        enabled: true,
        time: "09:00"
      },
      createdAt: "2024-12-20",
      status: "active",               // 'active', 'paused', 'completed'
      streak: 5,
      lastUpdated: "2024-12-27T10:30:00Z"
    }
  ],
  analytics: {
    history: [],
    achievements: [],
    streaks: []
  },
  created: "2024-12-20T09:00:00Z"
}
```

---

## 🎨 Styling System

### CSS Variables (main.css)

```css
:root {
  /* Colors */
  --primary-color: #2563eb;
  --secondary-color: #7c3aed;
  --accent-color: #ef4444;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --dark-color: #1e293b;
  
  /* Spacing */
  --radius: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* Shadows */
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* Animation */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Theme Classes

```css
/* Light mode (default) */
body { background: linear-gradient(...); }

/* Dark mode */
body.dark-mode { background: #0f172a; }

/* Explicit light mode */
body.light-mode { background: linear-gradient(...); }
```

---

## 🔄 Event Flow

### Goal Creation Flow
```
goalForm submit
  ↓ (event listener in ui.js)
ui.createGoal()
  ↓
goalManager.createGoal()
  ↓
goalManager.save()
  ↓
storage.save(data) → localStorage
  ↓
ui.renderDashboard()
  ↓
ui.showNotification("Success!")
```

### Theme Change Flow
```
themeToggle click
  ↓ (event listener in app.js)
app.storage.save(newTheme)
  ↓
app.applyTheme(newTheme)
  ↓
document.body.classList.add/remove('dark-mode', 'light-mode')
  ↓
CSS rules apply new styles
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Desktop: 1200px+ */
.dashboard-grid { grid-template-columns: 1fr 380px; }

/* Tablet: 992px-1199px */
.professional-nav { flex-wrap: wrap; }

/* Mobile: 768px-991px */
.stats-grid { grid-template-columns: repeat(2, 1fr); }

/* Small Mobile: <480px */
.stats-grid { grid-template-columns: 1fr; }
```

---

## 🧪 Testing Checklist

### Functionality Tests
- [ ] Create goal with all fields
- [ ] Mark days complete/incomplete
- [ ] Edit goal details
- [ ] Pause/resume goal
- [ ] Delete goal with confirmation
- [ ] Filter goals by status

### Analytics Tests
- [ ] Charts render correctly
- [ ] Time range selector updates charts
- [ ] Streak calculation is accurate
- [ ] Consistency score updates
- [ ] Report generation works
- [ ] CSV export format is correct

### Theme Tests
- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Auto mode follows system preference
- [ ] Theme persists after reload
- [ ] Toggle button cycles through themes

### Data Tests
- [ ] Data saves to localStorage
- [ ] Export creates valid JSON
- [ ] Import restores all data
- [ ] Backup/restore cycle works
- [ ] Clear data removes everything

### UI/UX Tests
- [ ] All buttons are clickable
- [ ] Forms validate input
- [ ] Modals open/close smoothly
- [ ] Notifications display correctly
- [ ] Mobile responsive layout works
- [ ] Keyboard shortcuts function

---

## 🚀 Performance Optimization

### Current Optimizations
- Chart.js with `aspectRatio: 2` for stable sizing
- Efficient DOM querying (cache selectors)
- Event delegation where applicable
- Minimal reflows (batch DOM updates)

### Potential Improvements
- Implement virtual scrolling for large goal lists
- Add service worker for offline support
- Optimize image loading
- Minify CSS/JS for production
- Implement lazy loading for charts

---

## 🔒 Security Considerations

### Current Security Measures
- HTML escaping to prevent XSS
- Input validation on forms
- No eval() or dynamic code execution
- LocalStorage is same-origin only

### Security Best Practices
- Always escape user input before rendering
- Validate all form data before processing
- Regular security audits
- Keep dependencies updated
- Inform users about data privacy

---

## 📊 Chart Configuration

### Chart.js Options (analytics.js)

```javascript
options: {
  responsive: true,              // Responsive sizing
  maintainAspectRatio: true,     // Force aspect ratio
  aspectRatio: 2,                // Width:height ratio
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index' }
  },
  scales: {
    y: { beginAtZero: true },
    x: { grid: { display: false } }
  }
}
```

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. No cloud sync (local storage only)
2. No sharing between devices
3. Limited to 5MB localStorage
4. No real-time notifications
5. No goal templates

### Known Workarounds
- Export/import to sync between devices
- Clear old data if reaching storage limit
- Use browser sync for cross-device experience

---

## 📝 Code Style Guide

### JavaScript
```javascript
// Use arrow functions
const result = items.map(item => item.value)

// Use const by default, let if reassignment needed
const app = new GoalTrackerApp()
let currentGoal = null

// Use descriptive names
function calculateGoalCompletion(goal) { }

// Add JSDoc comments for public methods
/**
 * Create a new goal
 * @param {Object} goalData - Goal data
 * @returns {Object} Created goal
 */
function createGoal(goalData) { }
```

### CSS
```css
/* Use BEM naming */
.goal-item { }
.goal-item__header { }
.goal-item--completed { }

/* Group related rules */
.element {
  /* Structure */
  display: flex;
  /* Appearance */
  background: white;
  /* Interaction */
  cursor: pointer;
}
```

---

## 🔗 Dependencies

### External Libraries
- **Chart.js** (v3+): Charting library
- **Font Awesome** (v6.4): Icon library
- **Google Fonts**: Montserrat, Playfair Display

### No Build Tools Required
- Pure vanilla JavaScript (no transpilation needed)
- Direct browser support for modern features
- Works offline without service workers

---

## 📚 Additional Resources

- [Chart.js Documentation](https://www.chartjs.org/)
- [MDN Web Docs - LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [JavaScript Promise Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

---

## 🤝 Contributing

### Before Making Changes
1. Read this documentation
2. Understand the current architecture
3. Check existing patterns and follow them
4. Test thoroughly before submitting

### Common Tasks

#### Adding a New Feature
1. Plan the feature in terms of data model
2. Update StorageManager if needed
3. Add logic to GoalManager or AnalyticsManager
4. Add UI rendering to UIManager
5. Add event handlers
6. Test all flows
7. Update documentation

#### Fixing a Bug
1. Identify which class/method has the bug
2. Write test case that reproduces it
3. Fix the issue
4. Verify fix doesn't break other features
5. Update relevant documentation

#### Improving Performance
1. Profile with browser DevTools
2. Identify bottleneck
3. Implement optimization
4. Measure improvement
5. Document the change

---

## 📞 Support

For technical questions or issues:
1. Check this documentation
2. Review relevant source code comments
3. Check browser console for errors (F12)
4. Test in different browsers
5. Check if issue is reproducible

---

**Last Updated**: December 27, 2025
**Version**: 3.0

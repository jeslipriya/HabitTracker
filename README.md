# GoalTracker Pro — Advanced Resolution Tracker

A powerful, web-based goal tracking application designed to help you transform your resolutions into measurable achievements with advanced analytics and real-time progress monitoring.

---

## 🎯 Features

### Dashboard
- **Quick Overview**: See your overall success rate, active goals count, and current streak at a glance
- **Real-time Stats**: Track completion rates, days completed, and longest streaks
- **Quick Actions**: Rapidly create goals or generate reports
- **Achievement System**: View milestones and recent accomplishments
- **Upcoming Deadlines**: Never miss important goal milestones

### Goal Management
- **Create Goals**: Set goals with categories, target frequency, priority levels, and descriptions
- **Track Progress**: Mark daily completions for each goal (current week view)
- **Edit Goals**: Modify goal names, descriptions, categories, and targets anytime
- **Pause/Resume**: Temporarily pause goals without deleting them
- **Delete**: Remove goals you no longer need
- **Milestones**: Automatic milestone tracking (e.g., 7-day streak, 30-day streak)

### Analytics & Insights
- **Consistency Trend**: Line chart showing daily completion patterns over 30 days
- **Category Distribution**: Doughnut chart showing goal distribution by category
- **Completion Rate**: Bar chart displaying progress on each active goal
- **Performance Metrics**: 
  - Consistency score (last 7 days)
  - Most productive day
  - Average completion percentage
  - Longest streak

### Settings & Customization
- **Theme**: Choose between Light, Dark, or Auto (system preference)
- **Notifications**: Enable/disable notifications and set preferred time
- **Week Start**: Configure whether your week starts on Monday or Sunday
- **Auto-Save**: Enable automatic saving of changes
- **Backup**: Set backup frequency (daily, weekly, monthly)

### Data Management
- **Export Backup**: Download all your data as a JSON file
- **Import Backup**: Restore data from a previously saved backup
- **Reports**: Generate detailed performance reports with recommendations

---

## 🚀 Getting Started

### Installation
1. Open the project folder in a web browser by opening `index.html`
2. The app uses browser's localStorage — no server required
3. Data is automatically saved locally on your device

### First Steps
1. **Create Your First Goal**:
   - Click the "Create Your First Goal" button or scroll to the form
   - Enter goal name (e.g., "Daily Meditation")
   - Select a category (Health, Learning, Productivity, etc.)
   - Set target frequency (1-7 days per week)
   - Choose priority level (Low, Medium, High)
   - Optionally add a description
   - Click "Create Goal"

2. **Track Progress**:
   - On each goal card, you'll see the current week (Mon-Sun)
   - Click a day button to mark it as completed
   - The progress bar updates instantly
   - Streaks are tracked automatically

3. **View Analytics**:
   - Scroll to "Advanced Analytics" section
   - See trends, distributions, and completion rates
   - Use time range selector to view different periods

---

## 📊 Goal Categories

Choose from these predefined categories:
- **Health & Fitness**: Exercise, nutrition, wellness goals
- **Learning & Growth**: Skills, education, personal development
- **Productivity**: Work, projects, efficiency goals
- **Mindfulness**: Meditation, reflection, mental health
- **Financial**: Saving, budgeting, investment goals
- **Career**: Professional development, networking, advancement

---

## 🎯 How to Use Each Feature

### Creating a Goal
```
1. Click "Create New Goal" button
2. Fill in required fields:
   - Goal Name (required)
   - Category (required)
   - Target Days/Week (required)
3. Optional: Add priority and description
4. Click "Create Goal"
```

### Tracking Daily Progress
```
1. Find your goal card
2. In the weekly grid (M T W T F S S):
   - Click a day to mark it complete (turns green)
   - Click again to undo
   - Future days are disabled (can't mark)
3. Progress bar updates automatically
4. Streak counter updates in real-time
```

### Editing a Goal
```
1. Click the edit (pencil) icon on a goal card
2. Update name, description, category, or target
3. Click "Save Changes"
4. Dashboard refreshes with updates
```

### Pausing a Goal
```
1. Click the pause/play icon on a goal card
2. Goal remains saved but is marked as paused
3. Paused goals don't affect completion stats
4. Click again to resume
```

### Deleting a Goal
```
1. Click the delete (trash) icon on a goal card
2. Confirm deletion in the popup dialog
3. Goal is permanently removed
```

### Viewing Analytics
```
1. Scroll to "Advanced Analytics" section
2. View three charts:
   - Consistency Trend: Your completion pattern
   - Category Distribution: Goals by category
   - Completion Rate: Progress on active goals
3. Change time range to see different periods
```

### Generating a Report
```
1. Click "Generate Report" button
2. A JSON report downloads automatically
3. Report includes:
   - Summary statistics
   - Performance metrics
   - Personalized recommendations
   - Detailed analytics data
```

### Exporting Data
```
1. Click "Export Data" button
2. Your complete data (goals, settings, history) downloads as JSON
3. Use this as a backup before making major changes
```

### Theme Toggle
```
1. Look for the moon icon button in bottom-right corner
2. Click to cycle through themes:
   - Dark Mode (dark background, light text)
   - Light Mode (light background, dark text)
   - Auto (follows your system preference)
3. Your choice is saved automatically
```

### Settings
```
1. Click "Settings" in the navigation
2. Configure:
   - Theme preference
   - Week start day
   - Notification settings
   - Backup frequency
3. Click "Save Settings"
4. Settings apply immediately
```

---

## 📈 Understanding Your Stats

### Success Rate
Percentage of completed days vs. total target days across all goals
- Calculated as: (Total Completed Days / Total Target Days) × 100

### Active Goals
Count of currently active (non-paused, non-archived) goals

### Days Streak
Your longest consecutive day streak across all goals

### Completion Rate (Per Goal)
Progress on individual goals
- Calculated as: (Completed Days / Target Days) × 100
- Capped at 100%

### Consistency Score
How consistently you're working toward goals (last 7 days)
- Higher = more consistent daily work
- Used to identify patterns and habits

---

## 💡 Tips & Best Practices

1. **Start Small**: Begin with 3-5 goals you're genuinely committed to
2. **Be Specific**: Use clear, measurable goal names ("Daily Meditation 10min" vs "Meditate")
3. **Set Realistic Targets**: Choose frequencies you can actually achieve
4. **Review Weekly**: Check your analytics every week to identify patterns
5. **Use Milestones**: Pay attention to milestone achievements for motivation
6. **Weekly Check-ins**: Review deadlines and upcoming milestones every Monday
7. **Backup Regularly**: Export backups at least monthly
8. **Categories**: Use categories consistently for better analytics insights
9. **Descriptions**: Add descriptions to remember *why* you set each goal
10. **Adjust as Needed**: Edit target frequency if goals feel too ambitious

---

## 🛠️ Data & Storage

### Where is My Data Stored?
- All data is stored in your browser's localStorage
- Nothing is sent to external servers
- Data persists across browser sessions
- Clearing browser cache will delete all data

### Backup Strategy
```
Local Storage → JSON Export → Safe Storage
```
Regularly:
1. Click "Export Data" to download your data
2. Save the JSON file in a secure location
3. Keep multiple backups from different dates

### Importing Data
```
1. Save a previously exported JSON file
2. Go to Settings
3. Click "Import Backup"
4. Select your JSON file
5. Confirm the import
6. All data is restored
```

---

## ⚙️ Settings Reference

| Setting | Options | Default | Effect |
|---------|---------|---------|--------|
| Theme | Light, Dark, Auto | Auto | Changes UI appearance |
| Week Start | Monday, Sunday | Monday | Changes when week begins |
| Notifications | On/Off | On | Enables/disables alerts |
| Notification Time | Any time | 09:00 | When daily reminders show |
| Auto-Save | On/Off | On | Automatic save on changes |
| Backup Frequency | Daily, Weekly, Monthly | Weekly | How often to suggest backups |

---

## 🎨 Color Scheme

### Light Mode
- Background: Light gradient (white-gray)
- Text: Dark blue-gray (#1e293b)
- Cards: White background
- Accents: Blue gradients

### Dark Mode
- Background: Dark blue-black (#0f172a)
- Text: Light gray (#e2e8f0)
- Cards: Dark gray (#1e293b)
- Accents: Blue gradients

---

## 🔒 Privacy & Security

- **No Cloud Storage**: All data stays on your device
- **No Tracking**: No analytics or data collection
- **No Accounts**: No need to log in anywhere
- **No Third-Party Access**: Complete control over your data
- **Secure Export**: Only you have access to exported data files

---

## 📱 Browser Compatibility

- **Chrome/Edge**: Full support (latest versions)
- **Firefox**: Full support (latest versions)
- **Safari**: Full support (latest versions)
- **Mobile**: Fully responsive on phones and tablets

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+N | Create new goal |
| Esc | Close modals and dialogs |

---

## 🆘 Troubleshooting

### Goals Not Saving
- Check if localStorage is enabled in browser settings
- Try exporting data to backup
- Clear old data and start fresh if needed

### Analytics Not Showing
- Ensure you have at least some completed days logged
- Refresh the page if charts don't appear
- Check browser console for errors (F12)

### Theme Not Changing
- Try clicking the theme button again
- Clear browser cache and reload
- Check if dark mode is forced by OS settings

### Data Lost After Browser Clear
- This is why regular backups are important!
- Restore from a previously exported JSON file
- Consider using browser sync features for persistence

---

## 🚀 Version Info

**GoalTracker Pro v3.0**

### Recent Updates
- ✅ Fixed chart resizing issues
- ✅ Improved theme toggle functionality
- ✅ Added explicit light/dark mode support
- ✅ Enhanced DOM error handling
- ✅ Improved analytics accuracy

---

## 📧 Support & Feedback

For issues, suggestions, or feature requests:
1. Check this README for solutions
2. Review your data backups
3. Test in a different browser if issues persist
4. Clear browser cache and reload the application

---

## 📄 License

GoalTracker Pro is provided as-is for personal use.

---

**Transform your resolutions into lifelong achievements! 🎯**

Start tracking today and build better habits with GoalTracker Pro.

# User Profile Management Guide

Learn how to manage your personal information and profile in GoalTracker Pro.

---

## 📋 Table of Contents

- [Accessing Your Profile](#accessing-your-profile)
- [Profile Information Fields](#profile-information-fields)
- [Profile Statistics](#profile-statistics)
- [Managing Your Avatar](#managing-your-avatar)
- [Timezone Settings](#timezone-settings)
- [Data Privacy](#data-privacy)
- [Profile Tips](#profile-tips)

---

## 🔑 Accessing Your Profile

### Method 1: Click the Avatar
1. Look at the top-right corner of the navigation bar
2. Click on your **avatar initials** (circular button with your initials)
3. The User Profile modal will open

### Method 2: From Navigation
1. Click the user avatar in the **navigation bar**
2. Profile modal appears automatically

### Closing the Profile
- Click the **X button** in the top-right of the modal
- Click the **Cancel** button
- Press **Escape** key

---

## 📝 Profile Information Fields

### Required Fields (Must Fill)
These fields are required to save your profile:

#### **Full Name** 👤
- Your complete name
- Used to generate your avatar initials
- Example: "John Smith" → Avatar shows "JS"
- Visible in the header navigation

#### **Email Address** 📧
- Your primary email address
- Should be a valid, working email
- Format: `yourname@example.com`
- Used for notifications and updates

### Optional Fields (Recommended)
Additional information to personalize your profile:

#### **Role/Title** 💼
- Your profession or current role
- Examples: Software Developer, Student, Project Manager, Entrepreneur
- Helps provide context for goal recommendations

#### **Bio** 📄
- Tell us about yourself
- Share your goals, interests, or motivation
- Up to several paragraphs
- Private - only visible to you

#### **Location** 📍
- Your city and country
- Example: "San Francisco, USA"
- Helps provide location-based suggestions

#### **Phone Number** 📱
- Your contact number (optional)
- Stored securely in your browser
- Never shared with third parties

#### **Timezone** 🌍
Available timezones:
- **North America**: Eastern (ET), Central (CT), Mountain (MT), Pacific (PT)
- **Europe**: London (GMT), Central European Time (CET)
- **Middle East**: Dubai (GST)
- **Asia**: India (IST), China (CST), Japan (JST)
- **Oceania**: Australia Eastern (AEDT)
- **Auto-detect**: Automatic based on your device

Select your timezone for accurate notification times and schedule management.

---

## 📊 Profile Statistics

Your profile displays important achievement metrics:

### Total Goals 🎯
- **Definition**: Total number of goals you've created
- **Updated**: Whenever you create or delete a goal
- **Insight**: Shows your goal-setting activity

### Completion Rate 📈
- **Definition**: Percentage of goal targets achieved
- **Calculation**: (Days Completed / Days Targeted) × 100
- **Range**: 0% to 100%+
- **Insight**: Overall performance across all goals

### Days Active ⏳
- **Definition**: Number of days since account creation
- **Calculation**: Today - Account creation date
- **Updated**: Daily
- **Insight**: How long you've been using GoalTracker Pro

---

## 🎨 Managing Your Avatar

### Default Avatar
- Shows your initials (first 2 letters of your name)
- Updates automatically when you change your name
- Color: Blue-to-purple gradient

### Updating Your Avatar
1. Go to your **User Profile**
2. Enter or edit your **Full Name**
3. Click **"Change Avatar"** button
4. Your initials will update instantly

### Avatar Examples
| Name | Avatar |
|------|--------|
| John Smith | JS |
| Alice Johnson | AJ |
| Michael Brown | MB |
| Sarah | SA |

---

## 🌍 Timezone Settings

### Why Timezone Matters
- **Notifications**: Notifications are sent at the correct local time
- **Scheduling**: Goal reminders display in your local timezone
- **Analytics**: Time-based analytics adjust to your timezone

### Setting Your Timezone
1. Open **User Profile**
2. Scroll to **Timezone dropdown**
3. Select your location
4. Click **Save Profile**

### Auto-Detect
- Select empty option for automatic detection
- System uses your browser's timezone
- Most accurate if device timezone is correct

---

## 🔒 Data Privacy

### What Data Is Stored
Your profile information is stored **locally in your browser** in localStorage:
- Name, email, role, bio, location, phone
- Timezone preference
- Update timestamp

### What Data Is NOT Stored
- No cloud sync (local only)
- No server copies (single device)
- No third-party sharing
- No analytics tracking

### Security Measures
- ✅ Data never leaves your device
- ✅ No external API calls with personal data
- ✅ HTML escaping prevents injection attacks
- ✅ Password: Not applicable (single user)

### Data Export/Backup
To backup your profile:
1. Go to **Settings**
2. Click **Export Backup**
3. Save the JSON file to your computer

To restore your profile:
1. Go to **Settings**
2. Click **Import Backup**
3. Select the previously saved JSON file

---

## 💡 Profile Tips

### Best Practices

#### 1. **Keep Information Updated**
```
✓ Update after major life changes
✓ Refresh role/title when you advance
✓ Add new details as goals evolve
```

#### 2. **Use Bio Effectively**
```
Example Bio:
"Software engineer passionate about personal development. 
Currently focusing on fitness goals and learning Spanish. 
I use GoalTracker to maintain consistency and track progress."
```

#### 3. **Choose Accurate Timezone**
```
✓ Ensures correct notification times
✓ Makes weekly reports align with your week
✓ Schedule reminders properly
```

#### 4. **Profile Visibility**
```
Remember: Only YOU see your profile details
- Goals are visible to you
- Stats are personalized
- Data stays private
```

### Advanced Tips

#### **Avatar Naming Convention**
- Use **two-word names** for single-letter initials
  - "John" → "JO" (first 2 letters)
  - "John Smith" → "JS" (first letters of first & last)

#### **Email Format**
- Use a reliable email for future features
- Example: yourname@domain.com
- Avoid: admin@website.com (generic accounts)

#### **Bio for Accountability**
Write your motivation in the bio:
```
"Aiming to exercise 3x per week and read 1 book per month.
Started: January 2024
Goal: Build sustainable habits by December 2024"
```

#### **Location Benefits**
Include for:
- Weather-aware fitness goals
- Time zone alignment
- Community connection (future feature)

---

## ❓ FAQ

### Q: Can I change my name?
**A:** Yes! Go to Profile → Edit Full Name → Save. Your avatar will update automatically.

### Q: Will changing timezone affect past data?
**A:** No. Historical data remains unchanged. Timezone only affects future notifications and analytics.

### Q: Is my email shared?
**A:** No. Your email is stored locally and never transmitted. Currently used only for display.

### Q: How are initials calculated?
**A:** 
- If first and last name: First initial + Last initial (e.g., "John Smith" = JS)
- If one word: First 2 letters (e.g., "Alice" = AL)
- Default: "PU" if no name set

### Q: Can I delete my profile?
**A:** You can reset all data via Settings → Reset Data, but not individual profile fields. All data is tied to your account.

### Q: What if I forget to save?
**A:** Click Cancel or the X button to discard changes without saving.

### Q: Are profile changes synced across devices?
**A:** No. Each device has its own local storage. Export and import backups to sync manually.

### Q: Can I have a custom avatar image?
**A:** Currently, avatars use name initials. Custom images are planned for future versions.

---

## 🚀 Coming Soon

Future enhancements to user profiles:
- [ ] Custom profile pictures
- [ ] Social sharing (optional)
- [ ] Profile badges for achievements
- [ ] Mutual goal sharing with friends
- [ ] Profile backup reminders
- [ ] Avatar color customization

---

## 📞 Support

### Profile Issues

**Problem**: Avatar not updating
- **Solution**: Refresh page and try again

**Problem**: Timezone not saving
- **Solution**: Check browser localStorage is enabled

**Problem**: Profile data lost after refresh
- **Solution**: Check if data is being saved (look at browser console)

**Problem**: Email validation failing
- **Solution**: Ensure format is `name@domain.com`

### Need Help?
- Check [README.md](README.md) for general help
- Review [DEVELOPER.md](DEVELOPER.md) if you're a developer
- Check browser console (F12) for error messages

---

## 📚 Related Guides

- [README.md](README.md) — Complete user guide
- [QUICKSTART.md](QUICKSTART.md) — Quick setup guide
- [DEVELOPER.md](DEVELOPER.md) — Technical documentation

---

**Last Updated**: December 27, 2025  
**Version**: 1.0  
**Status**: Full Profile Management Feature

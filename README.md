# GoalTracker Pro

Lightweight, client-side goal & habit tracker with analytics (vanilla JS).

## Overview

GoalTracker Pro is a single-page, client-side application for creating and tracking goals with progress, streaks, milestones, and basic analytics (charts via Chart.js). Data is stored in `localStorage` and can be exported/imported as JSON backups.

## Quick Start

Prerequisites: a modern web browser (Chrome, Edge, Firefox, Safari).

To run locally:

1. Clone or download the repository.
2. Open `index.html` in your browser (double-click or serve via a simple static server).

No build step is required — all assets are static.

## Files & Structure

- `index.html` — Main UI markup and modal templates.
- `css/main.css`, `css/dashboard.css` — Styles for layout and components.
- `js/storage.js` — `StorageManager` handles `localStorage`, import/export, migration.
- `js/goals.js` — `GoalManager` for CRUD, streaks, milestones, stats.
- `js/analytics.js` — `AnalyticsManager` for charts (Chart.js required).
- `js/ui.js` — `UIManager` wiring, rendering, modals, and event handling.
- `js/app.js` — Application bootstrap and orchestration.

## Notable Fixes (applied)

- Fixed DOM ID mismatches between `index.html` and `js/ui.js` (confirm cancel, profile close).
- Ensured confirm modal closes after the confirmed action and wrapped the action in a safe try/catch.
- Corrected editing flow to update nested `goal.target` (was incorrectly using top-level `goal.target`).
- Made dashboard view scrolling robust when a specific element ID is not present.

## Usage / Features

- Create / edit / delete goals with category, priority, and weekly target.
- Mark daily completions and track streaks.
- Automatic milestone detection and basic achievements.
- Analytics: consistency trend, category distribution, completion rate (requires Chart.js).
- Export / Import JSON backups.

## Development Notes

- Chart.js is included via CDN in `index.html`. If you want an offline copy, download Chart.js and update the script tag.
- The app is client-only and stores everything in `localStorage` under the key `goaltracker_pro_data`.

## Manual Smoke Tests (recommended)

1. Open `index.html` in browser.
2. Create a new goal via the 'Create New Goal' form.
3. Mark days as completed in the goal card; verify streak updates and progress bar.
4. Edit a goal (`Edit` button) and change target days — ensure progress and analytics reflect changes.
5. Use `Export Data` to download JSON, then `Import Backup` to restore it.
6. Open the user profile (top-right avatar), edit and save; verify nav avatar initials update.

If you spot console errors during these steps, report them with exact reproduction steps.

## Contributing

Open a PR with a focused change; include a short description and smoke-test steps.

## License

This project is provided as-is for educational / demo purposes.
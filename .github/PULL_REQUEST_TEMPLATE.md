<!--
Title format - <type>: <brief description>

| Type  | Use when                          |
|-------|-----------------------------------|
| feat  | Adding a new feature              |
| fix   | Fixing a bug                      |
| docs  | Documentation changes only        |
| test  | Adding or updating tests          |
| chore | Maintenance, CI, config, tooling  |

Examples:
feat: add chat export to PDF
fix: crash when uploading large files
docs: update setup instructions
-->

<!-- Thank you for taking the time to contribute! 🙌 -->

# Fixes Issue

<!-- Example: Closes #32 -->

Fixes #

# Description

This PR implements comprehensive privacy controls for chat conversations in PrivGPT Studio. Users can now:

- **Lock conversations** to prevent accidental access or modifications
- **Set auto-delete timers** (1 hour, 24 hours, 7 days, or 30 days) for automatic conversation cleanup
- **Visual indicators** showing lock status and remaining time for timed deletions
- **Privacy settings dialog** accessible from the conversation menu

The implementation includes both frontend UI components (React/Next.js) and backend API endpoints (Flask) with MongoDB integration for persistent storage of privacy settings.

# Type of change

- [x] 💡 New feature

# Checklist

<!-- Please delete the options that are not relevant to you. -->

- [ ] I am a ECWoc'26 contributor
- [ ] I am a DSCWoC'26 contributor
- [ ] My code follows the project's style guidelines
- [ ] I have added comments in areas that may be hard to understand
- [ ] I have NOT included `package.json` or `package-lock.json` in this PR

# Packages Added (if any)

None - This feature uses existing dependencies:

- Frontend: `@radix-ui/react-dialog` (already present)
- Backend: `Flask-PyMongo` (already present) for privacy settings storage

# Screenshots / Video (if applicable)

<!-- Include UI screenshots or GIFs to demonstrate the changes. -->

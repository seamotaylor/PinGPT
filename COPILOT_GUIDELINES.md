# PinGPT Coding Standards & Security Guidelines

## General Principles
- **Modularity:** Organize code into small, reusable functions and modules.
- **Separation of Concerns:** Keep manifest, background, content, sidebar UI, and utility scripts separate.
- **Documentation:** Use clear comments and JSDoc for functions, modules, and complex logic.

## Chrome Extension Best Practices
- **Manifest V3:** Use Manifest V3 for all extension code.
- **Minimal Permissions:** Request only essential permissions (e.g., `storage`, `sidePanel`, `activeTab`).
- **Secure Messaging:** Use `chrome.runtime.sendMessage` and `chrome.runtime.onMessage` with strict validation.
- **Async Operations:** Prefer `async/await` or Promises for all asynchronous code.

## Data Handling & Security
- **Storage:** Use `chrome.storage.local` for bookmarks. Validate and sanitize all data before storing.
- **Input Validation:** Sanitize all user input and stored data to prevent XSS/injection.
- **Error Handling:** Always handle errors gracefully and log them if debugging is enabled.
- **No Eval:** Never use `eval()` or similar unsafe functions.

## UI/UX
- **Accessibility:** Use semantic HTML, ARIA attributes, and keyboard navigation in sidebar UI.
- **Responsiveness:** Ensure sidebar UI works on all screen sizes.
- **Sanitization:** Escape all dynamic content before rendering in the UI.

## Debugging & Logging
- **Toggleable Logging:** Implement a debug mode that can be securely toggled.
- **Sensitive Data:** Never log sensitive user data.

## Code Style
- **Consistent Formatting:** Use 2 spaces for indentation, no trailing whitespace.
- **Naming:** Use descriptive, camelCase names for variables and functions.
- **Imports:** Prefer ES6 imports/exports for modularity.

## Review & Updates
- **Regular Audits:** Review code for security and best practices before release.
- **Dependencies:** Keep all dependencies up-to-date and vetted.

---

_This file is intended as a reference for all contributors and AI assistants
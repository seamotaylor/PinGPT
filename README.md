# PinGPT

PinGPT is a Chrome extension that allows users to bookmark their ChatGPT chats in a convenient sidebar panel. This project is built following best programming practices and adheres to Chrome Extension Manifest V3 standards.

## Features

- Bookmark ChatGPT conversations for easy access.
- Sidebar panel for viewing and managing bookmarks.
- Responsive and user-friendly interface.

## Project Structure

```
PinGPT
├── src
│   ├── background.js          # Background script for handling events and messaging
│   ├── content.js            # Content script for interacting with web pages
│   ├── sidebar
│   │   ├── sidebar.html      # HTML structure for the sidebar UI
│   │   ├── sidebar.js        # JavaScript for sidebar functionality
│   │   └── sidebar.css       # Styles for the sidebar UI
│   └── utils
│       └── storage.js        # Utility functions for Chrome storage API
├── manifest.json             # Configuration file for the Chrome extension
├── package.json              # npm configuration file
└── README.md                 # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd PinGPT
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `PinGPT` directory.
   
2. Open ChatGPT and click the extension icon to open the sidebar.
3. Use the sidebar to bookmark and manage your ChatGPT conversations.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
# PinGPT - ChatGPT Conversation Manager

PinGPT is a powerful Chrome extension that allows users to bookmark, organize, and manage their ChatGPT conversations with advanced content extraction capabilities. This extension provides a seamless way to save and retrieve important AI conversations for future reference.

## Features

- **Smart Conversation Extraction**: Automatically extracts ChatGPT conversation titles, content, and metadata
- **Advanced Bookmark Management**: Create, edit, delete, and search through your bookmarks
- **Intelligent Search**: Search across conversation titles, content, and URLs
- **One-Click Bookmarking**: Pin conversations with a single button click from ChatGPT pages
- **Cross-Device Sync**: Bookmarks sync across all your Chrome browsers via Chrome Sync
- **Modern UI**: Sleek, responsive sidebar with professional styling
- **Content Preview**: View conversation summaries and message counts
- **Keyboard Shortcuts**: Quick access with customizable keyboard shortcuts
- **Organized Display**: View bookmarks by date, with message counts and preview text
- **Real-time Updates**: Automatic bookmark saving and sidebar refreshing

## Project Structure

```
PinGPT/
├── src/
│   ├── background.js              # Extension background script with unified messaging
│   ├── content.js                 # ChatGPT page content extraction and injection
│   ├── sidebar/
│   │   ├── sidebar.html           # Modern sidepanel UI markup
│   │   ├── sidebar.js             # Sidebar functionality with bookmark management
│   │   └── sidebar.css            # Professional styling with responsive design
│   └── utils/
│       ├── storage.js             # Unified Chrome storage utilities
│       ├── storage.test.js        # Comprehensive unit tests
│       └── hello.test.js          # Basic test example
├── dist/                          # Compiled extension (generated)
├── node_modules/                  # Dependencies (generated)
├── webpack.config.js              # Build configuration
├── jest.config.js                 # Test configuration
├── jest.setup.js                  # Jest global setup
├── .eslintrc.js                   # Code linting configuration
├── manifest.json                  # Chrome extension manifest v3
├── package.json                   # Project configuration
├── *.png                          # Extension icons
├── create-icons.js                # Icon generation script
├── create-png-icons.js            # PNG icon creation utility
├── AI_GUIDELINES.md               # Development guidelines
├── LICENSE                        # MIT License
├── .gitignore                     # Git ignore patterns
└── README.md                      # This file
```

## Development Setup

### Prerequisites
- Node.js 16.0.0 or later
- npm or yarn package manager
- Chrome browser for testing

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PinGPT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```
   This starts webpack in watch mode for automatic rebuilding.

### Available Scripts

- `npm run build` - Production build with minification
- `npm run dev` - Development build with watch mode
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check code linting
- `npm run lint:fix` - Fix linting issues automatically
- `npm run package` - Build and package extension for distribution

### Testing

Run the comprehensive test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

### Building

For development (with source maps):
```bash
npm run dev
```

For production:
```bash
npm run build
```

Package the extension:
```bash
npm run package
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
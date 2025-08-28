// This file contains utility functions for interacting with the Chrome storage API.
// It includes functions for saving, retrieving, and validating bookmarks, as well as error handling.

const STORAGE_KEY = 'bookmarks';

// Save a bookmark to Chrome storage
export const saveBookmark = async (bookmark) => {
    try {
        if (!validateBookmark(bookmark)) {
            throw new Error('Invalid bookmark data');
        }

        const bookmarks = await getBookmarks();
        bookmarks.push({
            ...bookmark,
            id: generateBookmarkId(),
            timestamp: new Date().toISOString()
        });
        await chrome.storage.sync.set({ [STORAGE_KEY]: bookmarks });
        console.log('Bookmark saved successfully:', bookmark.title);
    } catch (error) {
        console.error('Error saving bookmark:', error);
        throw error; // Re-throw for caller to handle
    }
};

// Retrieve all bookmarks from Chrome storage
export const getBookmarks = async () => {
    try {
        const result = await chrome.storage.sync.get(STORAGE_KEY);
        return result[STORAGE_KEY] || [];
    } catch (error) {
        console.error('Error retrieving bookmarks:', error);
        return [];
    }
};

// Delete a bookmark by ID
export const deleteBookmark = async (bookmarkId) => {
    try {
        const bookmarks = await getBookmarks();
        const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
        await chrome.storage.sync.set({ [STORAGE_KEY]: filteredBookmarks });
        console.log('Bookmark deleted successfully:', bookmarkId);
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        throw error;
    }
};

// Update a bookmark by ID
export const updateBookmark = async (bookmarkId, updatedBookmark) => {
    try {
        if (!validateBookmark(updatedBookmark)) {
            throw new Error('Invalid bookmark data');
        }

        const bookmarks = await getBookmarks();
        const index = bookmarks.findIndex(bookmark => bookmark.id === bookmarkId);

        if (index === -1) {
            throw new Error('Bookmark not found');
        }

        bookmarks[index] = {
            ...bookmarks[index],
            ...updatedBookmark,
            updatedAt: new Date().toISOString()
        };

        await chrome.storage.sync.set({ [STORAGE_KEY]: bookmarks });
        console.log('Bookmark updated successfully:', bookmarkId);
    } catch (error) {
        console.error('Error updating bookmark:', error);
        throw error;
    }
};

// Search bookmarks by title or URL
export const searchBookmarks = async (query) => {
    try {
        const bookmarks = await getBookmarks();
        const lowerQuery = query.toLowerCase();

        return bookmarks.filter(bookmark =>
            bookmark.title.toLowerCase().includes(lowerQuery) ||
            bookmark.url.toLowerCase().includes(lowerQuery)
        );
    } catch (error) {
        console.error('Error searching bookmarks:', error);
        return [];
    }
};

// Generate unique ID for bookmark
const generateBookmarkId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate a bookmark object
export const validateBookmark = (bookmark) => {
    if (!bookmark) return false;

    const requiredFields = ['title', 'url'];
    const optionalFields = ['content', 'conversationId', 'timestamp'];

    // Check required fields
    for (const field of requiredFields) {
        if (!bookmark[field] || typeof bookmark[field] !== 'string' || bookmark[field].trim() === '') {
            console.warn(`Missing or invalid field: ${field}`);
            return false;
        }
    }

    // Validate URL format
    try {
        new URL(bookmark.url);
    } catch {
        console.warn('Invalid URL format');
        return false;
    }

    // Validate optional fields if present
    for (const field of optionalFields) {
        if (bookmark[field] !== undefined && typeof bookmark[field] !== 'string') {
            console.warn(`Invalid field type for: ${field}`);
            return false;
        }
    }

    return true;
};
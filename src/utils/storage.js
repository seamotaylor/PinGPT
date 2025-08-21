// This file contains utility functions for interacting with the Chrome storage API.
// It includes functions for saving, retrieving, and validating bookmarks, as well as error handling.

const STORAGE_KEY = 'chatgpt_bookmarks';

// Save a bookmark to Chrome storage
export const saveBookmark = async (bookmark) => {
    try {
        const bookmarks = await getBookmarks();
        bookmarks.push(bookmark);
        await chrome.storage.local.set({ [STORAGE_KEY]: bookmarks });
    } catch (error) {
        console.error('Error saving bookmark:', error);
    }
};

// Retrieve all bookmarks from Chrome storage
export const getBookmarks = async () => {
    try {
        const result = await chrome.storage.local.get(STORAGE_KEY);
        return result[STORAGE_KEY] || [];
    } catch (error) {
        console.error('Error retrieving bookmarks:', error);
        return [];
    }
};

// Validate a bookmark object
export const validateBookmark = (bookmark) => {
    return bookmark && typeof bookmark.title === 'string' && typeof bookmark.url === 'string';
};
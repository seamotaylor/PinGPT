// This file contains the background script for the Chrome extension. It handles events, manages messaging between content scripts and the sidebar, and uses unified storage utilities for consistency.

import { saveBookmark, getBookmarks, deleteBookmark, updateBookmark, searchBookmarks } from './utils/storage.js';

chrome.runtime.onInstalled.addListener(() => {
    console.log("PinGPT extension installed successfully.");
    console.log("Background script initialized with unified storage system.");
});

// Handle messages from content scripts and sidebar
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request, sender, sendResponse);
    return true; // Indicates that the response will be sent asynchronously
});

async function handleMessage(request, sender, sendResponse) {
    try {
        const { action, data } = request;

        switch (action) {
            case "saveBookmark":
                await saveBookmark(data);
                sendResponse({ status: "success", message: "Bookmark saved successfully" });
                break;

            case "getBookmarks":
                const bookmarks = await getBookmarks();
                sendResponse({ status: "success", data: bookmarks });
                break;

            case "deleteBookmark":
                await deleteBookmark(data.id);
                sendResponse({ status: "success", message: "Bookmark deleted successfully" });
                break;

            case "updateBookmark":
                await updateBookmark(data.id, data.bookmark);
                sendResponse({ status: "success", message: "Bookmark updated successfully" });
                break;

            case "searchBookmarks":
                const searchResults = await searchBookmarks(data.query);
                sendResponse({ status: "success", data: searchResults });
                break;

            case "extractChatGPTConversation":
                const conversationData = await extractChatGPTContent(sender.tab);
                sendResponse({ status: "success", data: conversationData });
                break;

            default:
                sendResponse({ status: "error", message: "Unknown action: " + action });
        }
    } catch (error) {
        console.error("Background script error:", error);
        sendResponse({ status: "error", message: error.message });
    }
}

// Extract ChatGPT conversation content from a tab
async function extractChatGPTContent(tab) {
    if (!tab.url || !tab.url.includes('chat.openai.com')) {
        throw new Error('Not a ChatGPT page');
    }

    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['src/content.js']
        });

        return results[0].result;
    } catch (error) {
        console.error('Error extracting ChatGPT content:', error);
        throw new Error('Failed to extract conversation content');
    }
}
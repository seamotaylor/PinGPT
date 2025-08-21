// This file contains the background script for the Chrome extension. It handles events, manages messaging between content scripts and the sidebar, and interacts with the Chrome storage API to save and retrieve bookmarks.

chrome.runtime.onInstalled.addListener(() => {
    console.log("PinGPT extension installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveBookmark") {
        saveBookmark(request.data).then(() => {
            sendResponse({ status: "success" });
        }).catch((error) => {
            sendResponse({ status: "error", message: error.message });
        });
        return true; // Indicates that the response will be sent asynchronously
    } else if (request.action === "getBookmarks") {
        getBookmarks().then((bookmarks) => {
            sendResponse({ status: "success", data: bookmarks });
        }).catch((error) => {
            sendResponse({ status: "error", message: error.message });
        });
        return true;
    }
});

async function saveBookmark(bookmark) {
    const bookmarks = await getBookmarks();
    bookmarks.push(bookmark);
    await chrome.storage.sync.set({ bookmarks });
}

async function getBookmarks() {
    const result = await chrome.storage.sync.get("bookmarks");
    return result.bookmarks || [];
}
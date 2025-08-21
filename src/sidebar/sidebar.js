// This file contains the JavaScript for the sidebar UI. It handles user interactions, updates the UI based on bookmarks, and communicates with the background script for data retrieval and storage.

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkList = document.getElementById('bookmark-list');
    const addBookmarkButton = document.getElementById('add-bookmark');
    const bookmarkInput = document.getElementById('bookmark-input');

    // Load bookmarks from storage
    chrome.runtime.sendMessage({ action: 'getBookmarks' }, (response) => {
        if (response && response.bookmarks) {
            response.bookmarks.forEach(bookmark => {
                addBookmarkToList(bookmark);
            });
        }
    });

    // Add bookmark event
    addBookmarkButton.addEventListener('click', () => {
        const bookmarkUrl = bookmarkInput.value.trim();
        if (bookmarkUrl) {
            chrome.runtime.sendMessage({ action: 'addBookmark', url: bookmarkUrl }, (response) => {
                if (response.success) {
                    addBookmarkToList(bookmarkUrl);
                    bookmarkInput.value = '';
                }
            });
        }
    });

    // Function to add a bookmark to the list
    function addBookmarkToList(url) {
        const listItem = document.createElement('li');
        listItem.textContent = url;
        bookmarkList.appendChild(listItem);
    }
});
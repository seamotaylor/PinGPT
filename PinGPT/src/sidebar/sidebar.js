// This file contains the JavaScript for the sidebar UI. It handles user interactions, bookmark management, and communicates with the background script.

let currentBookmarks = [];
let filteredBookmarks = [];

// Initialize sidebar when DOM is ready
document.addEventListener('DOMContentLoaded', initializeSidebar);

async function initializeSidebar() {
    console.log('Initializing PinGPT sidebar');

    setupEventListeners();
    await loadBookmarks();

    // Focus on search input for immediate interaction
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.focus();
    }
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');

    searchInput?.addEventListener('input', handleSearch);
    clearSearchBtn?.addEventListener('click', clearSearch);

    // Add bookmark manually (for development/testing)
    const addBookmarkBtn = document.getElementById('add-bookmark-btn');
    const bookmarkTitleInput = document.getElementById('bookmark-title');
    const bookmarkUrlInput = document.getElementById('bookmark-url');

    addBookmarkBtn?.addEventListener('click', () => {
        addManualBookmark(bookmarkTitleInput?.value, bookmarkUrlInput?.value);
    });

    // Refresh bookmarks button
    const refreshBtn = document.getElementById('refresh-bookmarks');
    refreshBtn?.addEventListener('click', () => loadBookmarks());
}

async function loadBookmarks() {
    try {
        showLoadingState();

        const response = await chrome.runtime.sendMessage({ action: 'getBookmarks' });

        if (response.status === 'success') {
            currentBookmarks = response.data || [];
            filteredBookmarks = [...currentBookmarks];
            renderBookmarks(filteredBookmarks);
            updateStats();
            console.log(`Loaded ${currentBookmarks.length} bookmarks`);
        } else {
            showError('Failed to load bookmarks: ' + response.message);
        }
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        showError('Error loading bookmarks');
    } finally {
        hideLoadingState();
    }
}

function renderBookmarks(bookmarks) {
    const bookmarkList = document.getElementById('bookmark-list');

    if (!bookmarkList) return;

    if (bookmarks.length === 0) {
        bookmarkList.innerHTML = '<div class="empty-state">No bookmarks found</div>';
        return;
    }

    const bookmarksHtml = bookmarks.map(bookmark => createBookmarkElement(bookmark)).join('');
    bookmarkList.innerHTML = bookmarksHtml;
}

function createBookmarkElement(bookmark) {
    const timestamp = bookmark.timestamp ? new Date(bookmark.timestamp).toLocaleDateString() : '';
    const messageCount = bookmark.messageCount || 0;
    const truncatedContent = truncateText(bookmark.content || bookmark.title, 100);

    return `
        <div class="bookmark-item" data-id="${bookmark.id}">
            <div class="bookmark-header">
                <h4 class="bookmark-title" title="${bookmark.title}">${bookmark.title}</h4>
                <div class="bookmark-actions">
                    <button class="action-btn edit-btn" title="Edit" onclick="editBookmark('${bookmark.id}')">✏️</button>
                    <button class="action-btn delete-btn" title="Delete" onclick="deleteBookmark('${bookmark.id}')">🗑️</button>
                </div>
            </div>
            <p class="bookmark-content" title="${truncatedContent}">${truncatedContent}</p>
            <div class="bookmark-meta">
                <span class="bookmark-date">${timestamp}</span>
                ${messageCount > 0 ? `<span class="message-count">${messageCount} messages</span>` : ''}
                <a href="${bookmark.url}" target="_blank" class="bookmark-link" title="Open conversation">🔗</a>
            </div>
        </div>
    `;
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();

    if (!query) {
        filteredBookmarks = [...currentBookmarks];
    } else {
        filteredBookmarks = currentBookmarks.filter(bookmark =>
            bookmark.title.toLowerCase().includes(query) ||
            (bookmark.content && bookmark.content.toLowerCase().includes(query)) ||
            bookmark.url.toLowerCase().includes(query)
        );
    }

    renderBookmarks(filteredBookmarks);
    updateSearchUI(query);
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        filteredBookmarks = [...currentBookmarks];
        renderBookmarks(filteredBookmarks);
        updateSearchUI('');
    }
}

function updateSearchUI(query) {
    const clearSearchBtn = document.getElementById('clear-search');
    if (clearSearchBtn) {
        clearSearchBtn.style.display = query ? 'block' : 'none';
    }
}

async function addManualBookmark(title, url) {
    if (!title || !url) {
        showError('Please enter both title and URL');
        return;
    }

    try {
        const bookmarkData = {
            title: title.trim(),
            url: url.trim(),
            content: 'Manually added bookmark'
        };

        const response = await chrome.runtime.sendMessage({
            action: 'saveBookmark',
            data: bookmarkData
        });

        if (response.status === 'success') {
            showSuccess('Bookmark added successfully');
            await loadBookmarks(); // Reload to show new bookmark

            // Clear form
            document.getElementById('bookmark-title')?.value = '';
            document.getElementById('bookmark-url')?.value = '';
        } else {
            showError('Failed to save bookmark: ' + response.message);
        }
    } catch (error) {
        console.error('Error adding bookmark:', error);
        showError('Error adding bookmark');
    }
}

async function editBookmark(bookmarkId) {
    const bookmark = currentBookmarks.find(b => b.id === bookmarkId);
    if (!bookmark) return;

    const newTitle = prompt('Edit bookmark title:', bookmark.title);
    if (!newTitle || newTitle.trim() === bookmark.title) return;

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'updateBookmark',
            data: {
                id: bookmarkId,
                bookmark: { ...bookmark, title: newTitle.trim() }
            }
        });

        if (response.status === 'success') {
            showSuccess('Bookmark updated successfully');
            await loadBookmarks();
        } else {
            showError('Failed to update bookmark: ' + response.message);
        }
    } catch (error) {
        console.error('Error updating bookmark:', error);
        showError('Error updating bookmark');
    }
}

async function deleteBookmark(bookmarkId) {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'deleteBookmark',
            data: { id: bookmarkId }
        });

        if (response.status === 'success') {
            showSuccess('Bookmark deleted successfully');
            await loadBookmarks();
        } else {
            showError('Failed to delete bookmark: ' + response.message);
        }
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        showError('Error deleting bookmark');
    }
}

function updateStats() {
    const statsDiv = document.getElementById('bookmark-stats');
    if (statsDiv) {
        statsDiv.textContent = `Total bookmarks: ${currentBookmarks.length}`;
    }
}

function showLoadingState() {
    const bookmarkList = document.getElementById('bookmark-list');
    if (bookmarkList) {
        bookmarkList.innerHTML = '<div class="loading-state">Loading bookmarks...</div>';
    }
}

function hideLoadingState() {
    const loadingElement = document.querySelector('.loading-state');
    if (loadingElement) {
        loadingElement.remove();
    }
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        ${type === 'error' ? 'background: #dc3545;' : 'background: #28a745;'}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Expose functions globally for onclick handlers
window.editBookmark = editBookmark;
window.deleteBookmark = deleteBookmark;
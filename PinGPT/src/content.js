// This file contains the content script that runs in ChatGPT pages to extract conversation content and handle user interactions.

let chatExtractionObserver = null;

// Initialize content script when DOM is ready
document.addEventListener('DOMContentLoaded', initializeContentScript);
document.addEventListener('load', initializeContentScript);

function initializeContentScript() {
    console.log('PinGPT content script initialized');

    // Inject bookmark button into ChatGPT interface
    injectBookmarkButton();

    // Set up message listener
    setupMessageListener();

    // Observe DOM changes for dynamic content
    observeChatChanges();
}

function setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const { action } = request;

        switch (action) {
            case 'extractConversation':
                extractConversation()
                    .then(data => sendResponse({ status: 'success', data }))
                    .catch(error => sendResponse({ status: 'error', message: error.message }));
                break;

            case 'injectBookmarkButton':
                injectBookmarkButton();
                sendResponse({ status: 'success' });
                break;

            default:
                sendResponse({ status: 'error', message: 'Unknown action: ' + action });
        }

        return true; // Keep message channel open for async response
    });
}

async function extractConversation() {
    try {
        console.log('Extracting ChatGPT conversation...');

        const title = extractConversationTitle();
        const messages = extractChatMessages();
        const url = window.location.href;
        const conversationId = extractConversationId();

        // Generate summary from first user message (if available)
        const summary = generateConversationSummary(messages);

        return {
            title: title || 'ChatGPT Conversation',
            url: url,
            conversationId: conversationId,
            content: summary,
            messages: messages,
            messageCount: messages.length,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error extracting conversation:', error);
        throw new Error('Failed to extract conversation content: ' + error.message);
    }
}

function extractConversationTitle() {
    // Try different selectors for the conversation title
    const selectors = [
        'h1[data-testid="conversation-title"]',
        '.conversation-title',
        'header h1',
        '[data-qa="chat-title"]',
        '.chat-title'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
            return element.textContent.trim();
        }
    }

    // Fallback: extract from page title
    return document.title.replace(' - ChatGPT', '').trim() || 'ChatGPT Conversation';
}

function extractChatMessages() {
    const messages = [];
    const messageSelectors = [
        '[data-testid^="conversation-turn"]',
        '.message',
        '[role="presentation"]',
        '.group'
    ];

    for (const selector of messageSelectors) {
        const messageElements = document.querySelectorAll(selector);

        if (messageElements.length > 1) { // Found actual messages
            messageElements.forEach(element => {
                const messageData = extractMessageData(element);
                if (messageData) {
                    messages.push(messageData);
                }
            });
            break;
        }
    }

    return messages;
}

function extractMessageData(element) {
    try {
        const userContent = element.querySelector('[data-message-author-role="user"]');
        const assistantContent = element.querySelector('[data-message-author-role="assistant"]');

        if (userContent) {
            return {
                role: 'user',
                content: userContent.textContent.trim(),
                timestamp: new Date().toISOString()
            };
        } else if (assistantContent) {
            return {
                role: 'assistant',
                content: assistantContent.textContent.trim(),
                timestamp: new Date().toISOString()
            };
        }
    } catch (error) {
        console.warn('Error extracting message data:', error);
    }

    return null;
}

function extractConversationId() {
    // Extract from URL
    const urlMatch = window.location.href.match(/\/c\/([a-zA-Z0-9-]+)/);
    if (urlMatch) {
        return urlMatch[1];
    }

    // Extract from page data or generate hash
    return generateSimpleId();
}

function generateConversationSummary(messages) {
    if (!messages || messages.length === 0) {
        return 'Empty conversation';
    }

    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage && firstUserMessage.content.length > 100) {
        return firstUserMessage.content.substring(0, 97) + '...';
    }

    return firstUserMessage ? firstUserMessage.content : 'ChatGPT conversation';
}

function injectBookmarkButton() {
    // Check if button already exists
    if (document.getElementById('pingpt-bookmark-btn')) {
        return;
    }

    const button = createBookmarkButton();
    insertButtonIntoPage(button);
}

function createBookmarkButton() {
    const button = document.createElement('button');
    button.id = 'pingpt-bookmark-btn';
    button.innerHTML = '📌 Pin Conversation';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 8px 16px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: all 0.2s ease;
    `;

    button.onmouseover = () => button.style.background = '#0056b3';
    button.onmouseout = () => button.style.background = '#007bff';

    button.onclick = async () => {
        try {
            button.innerHTML = '⏳ Saving...';
            button.disabled = true;

            const conversationData = await extractConversation();

            chrome.runtime.sendMessage({
                action: 'saveBookmark',
                data: conversationData
            }, (response) => {
                if (response.status === 'success') {
                    button.innerHTML = '✅ Saved!';
                    setTimeout(() => {
                        button.innerHTML = '📌 Pin Conversation';
                        button.disabled = false;
                    }, 2000);
                } else {
                    button.innerHTML = '❌ Error';
                    console.error('Failed to save bookmark:', response.message);
                    setTimeout(() => {
                        button.innerHTML = '📌 Pin Conversation';
                        button.disabled = false;
                    }, 2000);
                }
            });
        } catch (error) {
            console.error('Error saving bookmark:', error);
            button.innerHTML = '❌ Error';
            setTimeout(() => {
                button.innerHTML = '📌 Pin Conversation';
                button.disabled = false;
            }, 2000);
        }
    };

    return button;
}

function insertButtonIntoPage(button) {
    const selectors = [
        'main',
        '[role="main"]',
        '.chat-container',
        'body'
    ];

    for (const selector of selectors) {
        const target = document.querySelector(selector);
        if (target) {
            target.appendChild(button);
            return;
        }
    }

    // Fallback: append to body
    document.body.appendChild(button);
}

function observeChatChanges() {
    if (chatExtractionObserver) {
        return;
    }

    chatExtractionObserver = new MutationObserver(() => {
        // Ensure bookmark button is always present
        injectBookmarkButton();
    });

    chatExtractionObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function generateSimpleId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Handle page unload/cleanup
window.addEventListener('beforeunload', () => {
    if (chatExtractionObserver) {
        chatExtractionObserver.disconnect();
    }
});
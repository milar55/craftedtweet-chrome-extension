/**
 * Background service worker for the Article to Tweet Generator
 */

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Article to Tweet Generator installed');
    
    // Show a welcome message
    if (details.reason === 'install') {
        chrome.tabs.create({
            url: 'https://developer.x.com/en/docs/x-api'
        });
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveTwitterToken') {
        saveTwitterToken(request.token);
        sendResponse({ success: true });
    }
});

/**
 * Save Twitter Bearer Token to storage
 * @param {string} token - The Twitter Bearer Token
 */
function saveTwitterToken(token) {
    chrome.storage.local.set({ twitterBearerToken: token }, () => {
        console.log('Twitter token saved');
    });
}

/**
 * Get Twitter Bearer Token from storage
 * @returns {Promise<string>} The Twitter Bearer Token
 */
function getTwitterToken() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['twitterBearerToken'], (result) => {
            resolve(result.twitterBearerToken || null);
        });
    });
}

/**
 * Create context menu for extension
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "openSettings",
        title: "⚙️ Open Settings",
        contexts: ["browser_action"]
    });
});

/**
 * Handle context menu click
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openSettings") {
        chrome.runtime.openOptionsPage();
    }
});

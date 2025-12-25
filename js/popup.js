/**
 * Popup script for the Article to Tweet Generator (Crafted)
 */

// DOM elements
const generateBtn = document.getElementById('generateBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const copyBtn = document.getElementById('copyBtn');
const postBtn = document.getElementById('postBtn');
const tweetText = document.getElementById('tweetText');
const charCount = document.getElementById('charCount');
const charCountContainer = document.getElementById('charCountContainer');
const statusMessage = document.getElementById('status');
const autoPostCheckbox = document.getElementById('autoPost');
const openSettingsLink = document.getElementById('openSettings');
const autoUrlReplyCheckbox = document.getElementById('autoUrlReply');
const customPromptInput = document.getElementById('customPromptInput');
const userSearchInput = document.getElementById('userSearchInput');
const userSearchResults = document.getElementById('userSearchResults');

// State
let currentTweet = '';
let isGenerating = false;

const DEFAULT_PROMPT = 'You are a social media expert. Write a clever tweet (max 280 characters). Use 1-2 hashtags. No em dashes or colons.';

// Initialize
initialize();

function initialize() {
    chrome.storage.local.get(['autoPost', 'autoUrlReply', 'lastTweet'], (result) => {
        if (result.autoPost !== undefined) {
            autoPostCheckbox.checked = result.autoPost;
        }
        // Load Auto-URL Reply setting
        const autoUrlReplyCheckbox = document.getElementById('autoUrlReply');
        if (result.autoUrlReply !== undefined) {
            autoUrlReplyCheckbox.checked = result.autoUrlReply;
        }
        if (result.lastTweet) {
            displayTweet(result.lastTweet);
        } else {
            resetState();
        }
    });

    generateBtn.addEventListener('click', handleGenerateClick);
    postBtn.addEventListener('click', handlePostClick);

    // Allow Enter key to trigger generation in custom prompt input
    customPromptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleGenerateClick();
        }
    });

    autoPostCheckbox.addEventListener('change', () => chrome.storage.local.set({ autoPost: autoPostCheckbox.checked }));
    const autoUrlReplyCheckbox = document.getElementById('autoUrlReply');
    autoUrlReplyCheckbox.addEventListener('change', () => chrome.storage.local.set({ autoUrlReply: autoUrlReplyCheckbox.checked }));
    copyBtn.addEventListener('click', handleCopyClick);
    regenerateBtn.addEventListener('click', handleRegenerateClick);
    openSettingsLink.addEventListener('click', () => chrome.runtime.openOptionsPage());

    tweetText.addEventListener('input', () => {
        autoGrow();
        updateCharCount();
    });

    // User Search Listeners (UI removed but functionality kept)
    if (userSearchInput && userSearchResults) {
        userSearchInput.addEventListener('input', debounce(handleSearchInput, 500));
        document.addEventListener('click', (e) => {
            if (userSearchInput && userSearchResults && !userSearchInput.contains(e.target) && !userSearchResults.contains(e.target)) {
                userSearchResults.classList.remove('visible');
            }
        });
    }
}

function autoGrow() {
    tweetText.style.height = 'auto';
    tweetText.style.height = (tweetText.scrollHeight) + 'px';
}

async function handleGenerateClick() {
    if (isGenerating) return;

    isGenerating = true;
    updateStatus('Extracting content...', 'loading');
    generateBtn.disabled = true;
    postBtn.disabled = true;

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url || !tab.url.startsWith('http')) {
            updateStatus('Open an article first', 'error');
            resetState();
            return;
        }

        // Verify OpenAI API key before proceeding
        const settings = await chrome.storage.local.get(['openaiApiKey']);
        if (!settings.openaiApiKey) {
            updateStatus('Missing OpenAI API Key. Check Settings.', 'error');
            resetState();
            return;
        }

        updateStatus('Extracting content...', 'loading');
        // Attempt to send message; if fails, inject script manually
        let response;
        try {
            response = await chrome.tabs.sendMessage(tab.id, { action: "extractArticle" });
        } catch (msgError) {
            console.log('Message send failed, injecting script as fallback.', msgError);
            await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['js/content.js'] });
            response = await chrome.tabs.sendMessage(tab.id, { action: "extractArticle" });
        }
        const articleText = response?.articleText || '';

        if (!articleText || articleText.length < 50) {
            updateStatus('No article text found', 'error');
            resetState();
            return;
        }

        updateStatus('Generating...', 'loading');
        const customInstructions = customPromptInput.value.trim();
        const tweet = await generateTweetWithAI(articleText, customInstructions);

        if (!tweet) {
            updateStatus('Failed to generate', 'error');
            resetState();
            return;
        }

        displayTweet(tweet);
        chrome.storage.local.set({ lastTweet: tweet, lastArticleUrl: tab.url });

        if (autoPostCheckbox.checked) {
            updateStatus('Posting to X...', 'loading');
            try {
                const tweetId = await postTweet(tweet);
                // If auto URL reply is enabled, post the article URL as a reply
                if (autoUrlReplyCheckbox && autoUrlReplyCheckbox.checked) {
                    await postReply(tweetId, tab.url);
                }
            } catch (error) {
                updateStatus(`Post Failed: ${error.message}`, 'error');
            }
        } else {
            updateStatus('Ready!', 'success');
        }

    } catch (error) {
        console.error('Generate Error:', error);
        updateStatus(`Error: ${error.message}`, 'error');
    } finally {
        isGenerating = false;
        generateBtn.disabled = false;
    }
}

async function handlePostClick() {
    const tweetToPost = tweetText.value.trim();
    if (!tweetToPost) return;

    postBtn.disabled = true;
    updateStatus('Posting...', 'loading');

    try {
        const tweetId = await postTweet(tweetToPost);
        // Check for Auto-URL reply preference
        const autoUrlReplyCheckbox = document.getElementById('autoUrlReply');
        if (autoUrlReplyCheckbox && autoUrlReplyCheckbox.checked) {
            // Get the article URL from storage (to handle case where popup was closed)
            const data = await chrome.storage.local.get(['lastArticleUrl']);
            if (data.lastArticleUrl) {
                await postReply(tweetId, data.lastArticleUrl);
            }
        }
    } catch (error) {
        updateStatus(`Failed: ${error.message}`, 'error');
    } finally {
        postBtn.disabled = false;
    }
}

async function handleCopyClick() {
    const t = tweetText.value.trim();
    if (!t) return;
    try {
        await navigator.clipboard.writeText(t);
        updateStatus('✅ Copied!', 'success');
        setTimeout(() => updateStatus(''), 2000);
    } catch (e) {
        updateStatus('Copy failed', 'error');
    }
}

async function handleRegenerateClick() {
    if (isGenerating) return;
    handleGenerateClick();
}

async function generateTweetWithAI(articleText, customInstructions = '') {
    const s = await chrome.storage.local.get(['openaiApiKey', 'aiModel', 'maxArticleLength', 'systemPrompt']);
    const maxChars = parseInt(s.maxArticleLength) || 4000;
    const truncatedText = articleText.substring(0, maxChars);

    console.group('🔍 Article Extraction Debug');
    console.log('Original Text Length:', articleText.length);
    console.log('Truncated Text Length:', truncatedText.length);
    console.log('Use Custom Instructions:', customInstructions);
    console.groupEnd();

    // Inject custom instructions into the System Prompt for stronger adherence
    const systemPrompt = s.systemPrompt || DEFAULT_PROMPT;
    let finalSystemPrompt = systemPrompt;
    if (customInstructions) {
        finalSystemPrompt += `\n\nCRITICAL INSTRUCTION: You must strictly follow this rule: ${customInstructions}`;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${s.openaiApiKey}`
            },
            body: JSON.stringify({
                model: s.aiModel || 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: finalSystemPrompt },
                    {
                        role: 'user',
                        content: `Article Content:\n${truncatedText}`
                    }
                ],
                max_tokens: 280
            })
        });

        if (!response.ok) throw new Error(`API ${response.status}`);
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        throw error;
    }
}

async function postTweet(tweetText) {
    const s = await chrome.storage.local.get(['twitterApiKey', 'twitterApiSecret', 'twitterAccessToken', 'twitterAccessTokenSecret']);
    if (!s.twitterApiKey || !s.twitterApiSecret || !s.twitterAccessToken || !s.twitterAccessTokenSecret) {
        throw new Error('Credentials missing');
    }

    const url = 'https://api.twitter.com/2/tweets';
    const method = 'POST';
    const authHeader = await OAuthSigner.generateHeader(method, url, {}, {
        apiKey: s.twitterApiKey,
        apiSecret: s.twitterApiSecret,
        accessToken: s.twitterAccessToken,
        accessTokenSecret: s.twitterAccessTokenSecret
    });

    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: tweetText })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || err.errors?.[0]?.message || `Status ${response.status}`);
    }

    const data = await response.json();

    // Return the tweet ID for possible reply
    const tweetId = data.data?.id;
    updateStatus('✅ Posted!', 'success');
    setTimeout(() => updateStatus(''), 3000);
    return tweetId;
}

function displayTweet(tweet) {
    currentTweet = tweet;
    tweetText.value = tweet;
    autoGrow();
    updateCharCount();
    regenerateBtn.disabled = false;
    copyBtn.disabled = false;
    postBtn.disabled = false;
}

function updateStatus(message, type = '') {
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`;
}

function updateCharCount() {
    const len = tweetText.value.length;
    charCount.textContent = len; // FIXED: Just update the number
    charCountContainer.className = len > 280 ? 'char-count warning' : 'char-count';
}

function resetState() {
    isGenerating = false;
    generateBtn.disabled = false;
    regenerateBtn.disabled = true;
    copyBtn.disabled = true;
    postBtn.disabled = true;
    updateStatus('');
}
// Helper to post a reply containing the article URL
async function postReply(parentTweetId, articleUrl) {
    const s = await chrome.storage.local.get(['twitterApiKey', 'twitterApiSecret', 'twitterAccessToken', 'twitterAccessTokenSecret']);
    if (!s.twitterApiKey || !s.twitterApiSecret || !s.twitterAccessToken || !s.twitterAccessTokenSecret) {
        throw new Error('Credentials missing');
    }
    const url = 'https://api.twitter.com/2/tweets';
    const method = 'POST';
    const authHeader = await OAuthSigner.generateHeader(method, url, {}, {
        apiKey: s.twitterApiKey,
        apiSecret: s.twitterApiSecret,
        accessToken: s.twitterAccessToken,
        accessTokenSecret: s.twitterAccessTokenSecret
    });
    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: articleUrl,
            reply: { in_reply_to_tweet_id: parentTweetId }
        })
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || err.errors?.[0]?.message || `Status ${response.status}`);
    }
    updateStatus('✅ URL reply posted', 'success');
    setTimeout(() => updateStatus(''), 2000);
}

// --- User Search Functions ---

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function handleSearchInput(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        userSearchResults.classList.remove('visible');
        return;
    }

    try {
        const users = await searchTwitterUsers(query);
        displaySearchResults(users);
    } catch (error) {
        console.error('Search error:', error);
        userSearchResults.innerHTML = `<div class="search-error">
            <p>Search failed: ${error.message}</p>
            ${error.message.includes('Basic Tier') ? '<p style="font-size: 11px; margin-top: 4px; opacity: 0.8;">Note: Twitter v1.1 search requires a paid API tier.</p>' : ''}
        </div>`;
        userSearchResults.classList.add('visible');
    }
}

async function searchTwitterUsers(query) {
    const s = await chrome.storage.local.get(['twitterApiKey', 'twitterApiSecret', 'twitterAccessToken', 'twitterAccessTokenSecret']);
    if (!s.twitterApiKey) {
        throw new Error('Twitter Login Required (Settings)');
    }

    const url = 'https://api.twitter.com/1.1/users/search.json';
    const params = { q: query, count: 5 };

    const authHeader = await OAuthSigner.generateHeader('GET', url, params, {
        apiKey: s.twitterApiKey,
        apiSecret: s.twitterApiSecret,
        accessToken: s.twitterAccessToken,
        accessTokenSecret: s.twitterAccessTokenSecret
    });

    // Construct query string manually since OAuth header covers it but fetch needs the URL
    const queryString = new URLSearchParams(params).toString();
    const fetchUrl = `${url}?${queryString}`;

    const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
            'Authorization': authHeader
        }
    });

    if (!response.ok) {
        // Handle common errors
        if (response.status === 403) throw new Error('API Access Denied (Basic Tier Required)');
        if (response.status === 429) throw new Error('Rate Limit Exceeded');
        throw new Error(`API Error ${response.status}`);
    }

    return await response.json();
}

function displaySearchResults(users) {
    if (!users || users.length === 0) {
        userSearchResults.innerHTML = '<div class="search-error">No users found</div>';
        userSearchResults.classList.add('visible');
        return;
    }

    userSearchResults.innerHTML = '';
    users.forEach(user => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        // Use bigger image if available
        const avatarUrl = user.profile_image_url_https?.replace('_normal', '_bigger') || '';

        item.innerHTML = `
            <img src="${avatarUrl}" class="search-result-avatar" onerror="this.src='../icons/icon48.png'">
            <div class="search-result-info">
                <span class="search-result-name">${user.name}</span>
                <span class="search-result-handle">@${user.screen_name}</span>
            </div>
        `;

        item.addEventListener('click', () => {
            const mention = `@${user.screen_name} `;
            const currentVal = tweetText.value;
            // Append to end for now as cursor position can be tricky with focus
            tweetText.value = currentVal + (currentVal.length > 0 && !currentVal.endsWith(' ') ? ' ' : '') + mention;

            userSearchResults.classList.remove('visible');
            userSearchInput.value = ''; // Clear search
            autoGrow();
            updateCharCount();
        });

        userSearchResults.appendChild(item);
    });

    userSearchResults.classList.add('visible');
}

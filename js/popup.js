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
const status = document.getElementById('status');
const autoPostCheckbox = document.getElementById('autoPost');
const openSettingsLink = document.getElementById('openSettings');

// State
let currentTweet = '';
let isGenerating = false;

const DEFAULT_PROMPT = 'You are a social media expert. Write a clever tweet (max 280 characters). Use 1-2 hashtags. No em dashes or colons.';

// Initialize
initialize();

function initialize() {
    chrome.storage.local.get(['autoPost', 'lastTweet'], (result) => {
        if (result.autoPost !== undefined) {
            autoPostCheckbox.checked = result.autoPost;
        }
        if (result.lastTweet) {
            displayTweet(result.lastTweet);
        } else {
            resetState();
        }
    });

    generateBtn.addEventListener('click', handleGenerateClick);
    postBtn.addEventListener('click', handlePostClick);
    autoPostCheckbox.addEventListener('change', () => chrome.storage.local.set({ autoPost: autoPostCheckbox.checked }));
    copyBtn.addEventListener('click', handleCopyClick);
    regenerateBtn.addEventListener('click', handleRegenerateClick);
    openSettingsLink.addEventListener('click', () => chrome.runtime.openOptionsPage());

    tweetText.addEventListener('input', () => {
        autoGrow();
        updateCharCount();
    });
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
        if (!tab.url || !tab.url.startsWith('http')) {
            updateStatus('Open an article first', 'error');
            resetState();
            return;
        }

        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['js/content.js'] });

        const response = await chrome.tabs.sendMessage(tab.id, { action: "extractArticle" });
        const articleText = response?.articleText || '';

        if (!articleText || articleText.length < 100) {
            updateStatus('No article text found', 'error');
            resetState();
            return;
        }

        updateStatus('Generating...', 'loading');
        const tweet = await generateTweetWithAI(articleText);

        if (!tweet) {
            updateStatus('Failed to generate', 'error');
            resetState();
            return;
        }

        displayTweet(tweet);
        chrome.storage.local.set({ lastTweet: tweet });

        if (autoPostCheckbox.checked) {
            updateStatus('Posting to X...', 'loading');
            try {
                await postTweet(tweet);
            } catch (error) {
                updateStatus(`Failed: ${error.message}`, 'error');
            }
        } else {
            updateStatus('Ready!', 'success');
        }

    } catch (error) {
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
        await postTweet(tweetToPost);
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

async function generateTweetWithAI(articleText) {
    const s = await chrome.storage.local.get(['openaiApiKey', 'aiModel', 'maxArticleLength', 'systemPrompt']);
    const maxChars = parseInt(s.maxArticleLength) || 4000;
    const truncatedText = articleText.substring(0, maxChars);
    const systemPrompt = s.systemPrompt || DEFAULT_PROMPT;

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
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Article: ${truncatedText}` }
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

    updateStatus('✅ Posted!', 'success');
    setTimeout(() => updateStatus(''), 3000);
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
    status.textContent = message;
    status.className = `status ${type}`;
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

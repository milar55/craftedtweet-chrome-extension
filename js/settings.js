/**
 * Settings page for the Article to Tweet Generator
 */

// DOM elements
const openaiKeyInput = document.getElementById('openaiKey');
const systemPromptInput = document.getElementById('systemPrompt');
const twitterApiKeyInput = document.getElementById('twitterApiKey');
const twitterApiSecretInput = document.getElementById('twitterApiSecret');
const twitterAccessTokenInput = document.getElementById('twitterAccessToken');
const twitterAccessTokenSecretInput = document.getElementById('twitterAccessTokenSecret');

const maxArticleLengthInput = document.getElementById('maxArticleLength');
const aiModelSelect = document.getElementById('aiModel');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMessage = document.getElementById('status');

const DEFAULT_PROMPT = 'You are a social media expert who creates engaging tweets. Write a clever, concise tweet (max 280 characters) about the article. Include 1-2 relevant hashtags. Make it interesting and shareable. DO NOT use em dashes (—) or colons (:) in the tweet.';

// Load settings
loadSettings();

saveBtn.addEventListener('click', handleSave);
resetBtn.addEventListener('click', handleReset);

function maskKey(key) {
    if (!key) return '';
    if (key.length <= 10) return key;
    return key.substring(0, 5) + '...' + key.substring(key.length - 5);
}

function loadSettings() {
    chrome.storage.local.get(null, (result) => {
        if (result.openaiApiKey) {
            openaiKeyInput.dataset.stored = result.openaiApiKey;
            openaiKeyInput.value = maskKey(result.openaiApiKey);
        }

        systemPromptInput.value = result.systemPrompt || DEFAULT_PROMPT;
        maxArticleLengthInput.value = result.maxArticleLength || 4000;
        aiModelSelect.value = result.aiModel || 'gpt-4o-mini';
        // Load autoUrlReply setting
        const autoUrlReplyCheckbox = document.getElementById('autoUrlReply');
        if (result.autoUrlReply !== undefined) {
            autoUrlReplyCheckbox.checked = result.autoUrlReply;
        }

        const twitterKeys = [
            { el: twitterApiKeyInput, val: result.twitterApiKey },
            { el: twitterApiSecretInput, val: result.twitterApiSecret },
            { el: twitterAccessTokenInput, val: result.twitterAccessToken },
            { el: twitterAccessTokenSecretInput, val: result.twitterAccessTokenSecret }
        ];

        twitterKeys.forEach(item => {
            if (item.val) {
                item.el.dataset.stored = item.val;
                item.el.value = maskKey(item.val);
            }
        });
    });
}

async function handleSave() {
    saveBtn.disabled = true;
    showStatus('Saving...', 'loading');

    try {
        const getVal = (el) => {
            if (!el) return '';
            const val = el.value.trim();
            if (val === '' || val.includes('...')) {
                return el.dataset.stored || '';
            }
            return val;
        };

        const settings = {
            openaiApiKey: getVal(openaiKeyInput),
            systemPrompt: systemPromptInput.value.trim() || DEFAULT_PROMPT,
            twitterApiKey: getVal(twitterApiKeyInput),
            twitterApiSecret: getVal(twitterApiSecretInput),
            twitterAccessToken: getVal(twitterAccessTokenInput),
            twitterAccessTokenSecret: getVal(twitterAccessTokenSecretInput),
            maxArticleLength: parseInt(maxArticleLengthInput.value),
            aiModel: aiModelSelect.value
        };

        await chrome.storage.local.set(settings);
        // Also persist autoUrlReply checkbox state
        const autoUrlReplyCheckbox = document.getElementById('autoUrlReply');
        if (autoUrlReplyCheckbox) {
            await chrome.storage.local.set({ autoUrlReply: autoUrlReplyCheckbox.checked });
        }
        showStatus('Saved!', 'success');
        loadSettings();
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        saveBtn.disabled = false;
        setTimeout(() => {
            if (statusMessage.className.includes('success')) {
                statusMessage.textContent = '';
                statusMessage.className = 'status';
            }
        }, 3000);
    }
}

function handleReset() {
    if (confirm('Reset all defaults?')) {
        chrome.storage.local.clear(() => {
            loadSettings();
            showStatus('Reset done!', 'success');
        });
    }
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`;
}

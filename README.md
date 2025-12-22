_# Article to Tweet Generator Chrome Extension

This Chrome extension allows you to read an article from any webpage, generate a clever tweet about it using AI, and post it to your Twitter account.

_## Installation

1.  Download the `twitter-tweet-extension.zip` file.
2.  Unzip the downloaded file to a permanent location on your computer.
3.  Open Google Chrome and navigate to `chrome://extensions`.
4.  Enable "Developer mode" in the top right corner.
5.  Click on "Load unpacked" and select the unzipped `twitter-tweet-extension` folder.
6.  The extension icon will appear in your Chrome toolbar.

_## Configuration

Before using the extension, you need to configure it with your OpenAI and Twitter API keys using the settings page.

**1. Open the Settings Page:**

There are two ways to open the settings page:

*   **Method 1:** Right-click the extension icon in your Chrome toolbar and select "⚙️ Open Settings" from the context menu
*   **Method 2:** Click the extension icon, then click the "⚙️ Settings" link at the bottom of the popup

Both methods will open the settings page where you can enter your API keys

**2. Enter Your API Keys:**

*   **OpenAI API Key:** Enter your OpenAI API key (starts with `sk-...`)
*   **Twitter Bearer Token:** Enter your Twitter API Bearer Token from your developer account
*   Click "Save Settings"

**3. Additional Settings:**

*   **Auto-Post After Generation:** Toggle to automatically post tweets after they're generated
*   **Max Article Length:** Set the maximum characters to send to AI (default: 4000)
*   **AI Model:** Choose which AI model to use for tweet generation

**4. Save Your Settings:**

*   Click "Save Settings" to save your configuration
*   The settings are stored locally and will persist across browser sessions

_## How to Use

1.  Navigate to an article you want to tweet about.
2.  Click the extension icon in your Chrome toolbar.
3.  Click the "Generate Tweet" button.
4.  The extension will read the article, and the AI will generate a tweet.
5.  The generated tweet will appear in the popup.
6.  Click "Copy Tweet" to copy it to your clipboard, or "Post to Twitter" to publish it.
7.  If you have "Auto-post" enabled, the tweet will be posted automatically.
8.  Click "Regenerate" to get a different version of the tweet.

_## Chrome Web Store Publication

This extension is designed to be published on the Chrome Web Store. Here's what you need to know:

**Security:**
- API keys are stored locally in chrome.storage.local (encrypted by Chrome)
- No hardcoded API keys in the code
- Each user manages their own keys via the settings page
- Keys are never transmitted to any server (unless posting a tweet)

**User Experience:**
- Modern, intuitive interface
- Real-time feedback and error handling
- Copy to clipboard functionality
- Regenerate tweet option
- Auto-post feature

**Requirements:**
- Users need their own OpenAI API key (free tier available)
- Users need their own Twitter Developer account and Bearer Token
- Clear instructions provided in README

_## Troubleshooting

**Issue: "Twitter API credentials not set" error**
- Solution: Right-click extension icon → Options → Enter your Twitter Bearer Token

**Issue: "OpenAI API key must start with sk-" error**
- Solution: Enter a valid OpenAI API key in the settings page

**Issue: Tweet generation fails**
- Solution: Check your OpenAI API key is valid and has sufficient quota

**Issue: Cannot post to Twitter**
- Solution: Check your Twitter Bearer Token is valid and has tweet posting permissions

_## Features

*   **Modern UI:** A simple and intuitive interface.
*   **AI-Powered:** Generates clever and relevant tweets.
*   **Character Count:** Keeps track of the tweet length.
*   **Auto-Post:** Automatically posts tweets after generation (optional).
*   **Secure Storage:** API keys are stored locally.

_## Files Included

*   `manifest.json`: The extension's manifest file.
*   `popup/popup.html`: The HTML for the extension's popup.
*   `css/popup.css`: The CSS for styling the popup.
*   `js/popup.js`: The JavaScript for the popup, including tweet generation and posting logic.
*   `js/content.js`: The content script for extracting article text.
*   `js/background.js`: The background service worker.
*   `icons/`: Folder containing the extension icons.
*   `settings/settings.html`: Settings page for API key configuration
*   `css/settings.css`: CSS for the settings page
*   `js/settings.js`: JavaScript for settings page functionality
*   `README.md`: Installation and usage instructions

_## Disclaimer

This is a proof-of-concept extension. The API key handling is simplified for this example. In a production environment, you would want to use a more secure method for storing and accessing API keys, such as a backend server or more advanced secure storage options.

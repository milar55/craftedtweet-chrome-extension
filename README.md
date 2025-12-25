# Crafted 🖋️

![Crafted Logo](icons/logo.png)

**Crafted** is a premium Chrome extension that transforms long-form articles into perfectly distilled, shareable tweets using AI.

## Highlights
- **Elegant UI**: Minimalist sepia-themed studio design.
- **AI Customization**: Set your own "System Prompt" and context length (up to 15k chars).
- **Secure Posting**: Direct posting to X via OAuth 1.0a.
- **Smart Extraction**: Automatically pulls core content from any article URL.
- **Fast Generation**: Press **Enter** in the instructions field to generate instantly.

## Chrome Installation
1.  **Download/Clone** this repository to a local folder.
2.  Open Chrome and go to **`chrome://extensions`**.
3.  Turn on **"Developer mode"** (top right toggle).
4.  Click **"Load unpacked"** and select the extension folder.
5.  **Pin it** to your toolbar for easy access.

## Quick Setup
1.  Open **Settings** from the extension popup.
2.  Add your **OpenAI API Key** (e.g., GPT-4o-mini).
3.  Add your **Twitter API Keys** (Consumer & Access tokens).
4.  (Optional) Tweak the **System Prompt** to change the AI's writing style.

## Usage
1.  Navigate to any article.
2.  Click **Crafted**.
3.  (Optional) Enter custom instructions (e.g., "Make it funny") and press **Enter**.
4.  Edit the generated tweet if needed, then click **Post to X**.

## Development
This project includes a **Local Dev Mode** for UI styling:
1. Run `python -m http.server 8000` (or any local server) in the root.
2. Open `http://localhost:8000/popup/popup.html` in your browser.
3. The `js/dev-mock.js` script will simulate Chrome APIs for a smooth development experience.

## Note on X (Twitter) API Tiers
The **User Search** feature is currently hidden in the UI because it requires a paid **X API Basic Tier** ($100/mo) or higher. The logic remains in the codebase and can be re-enabled in `popup.html` if you have the appropriate API access.

## Files Included

*   `manifest.json`: The extension's manifest file.
*   `popup/popup.html`: The HTML for the extension's popup.
*   `css/popup.css`: The CSS for styling the popup.
*   `js/popup.js`: The JavaScript for the popup, including tweet generation and posting logic.
*   `js/content.js`: The content script for extracting article text.
*   `js/background.js`: The background service worker.
*   `js/dev-mock.js`: Mock API for local UI development.
*   `icons/`: Folder containing the extension icons.
*   `settings/settings.html`: Settings page for API key configuration
*   `css/settings.css`: CSS for the settings page
*   `js/settings.js`: JavaScript for settings page functionality
*   `README.md`: Installation and usage instructions

## Disclaimer

This is a proof-of-concept extension. The API key handling is simplified for this example. In a production environment, you would want to use a more secure method for storing and accessing API keys, such as a backend server or more advanced secure storage options.
---
*Built with Vanilla JS, CSS, and OpenAI.*

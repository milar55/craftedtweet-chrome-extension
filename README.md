# Crafted 🖋️

![Crafted Logo](icons/logo.png)

**Crafted** is a premium Chrome extension that transforms long-form articles into perfectly distilled, shareable tweets using AI.

## Highlights
- **Elegant UI**: Minimalist sepia-themed studio design.
- **AI Customization**: Set your own "System Prompt" and context length (up to 15k chars).
- **Tweet Angle Control**: Reframing instructions are the PRIMARY directive—specify your perspective, tone, or angle and the AI will focus the entire tweet around it.
- **Handle Search**: Lightweight Google-powered search to find X/Twitter handles by name or company.
- **Secure Posting**: Direct posting to X via OAuth 1.0a.
- **Smart Extraction**: Automatically pulls core content from any article URL.
- **Fast Generation**: Press **Enter** in the "Tweet Angle & Perspective" field to generate instantly.

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
3.  In the **"Tweet Angle & Perspective"** field, specify how you want to frame the tweet:
    - Examples: *"write from a founder's perspective"*, *"focus on the practical benefits"*, *"make it controversial"*, *"add a personal note about why this matters"*
    - This becomes the **PRIMARY directive**—the AI will build the entire tweet around your instruction.
    - Press **Enter** to generate instantly, or click **Generate**.
4.  (Optional) Use the **Handle Search** field to find and mention X accounts:
    - Type a name or company (e.g., "OpenAI", "Elon Musk")
    - Select from the dropdown to insert `@handle` into your tweet
    - Uses Google search as a proxy (works without X API access)
5.  Edit the generated tweet if needed, then click **Post to X**.

## How Reframing Works
The extension uses a two-tier prompt structure:
1. **System Prompt** (Settings): Defines general style rules (character limit, hashtag usage, formatting).
2. **Tweet Angle & Perspective** (Popup): Your specific instruction becomes the **PRIMARY TASK** for the AI.

When you provide an angle/perspective, the prompt explicitly tells the AI:
> "YOUR PRIMARY TASK: [your instruction]. The article content is just context."

This ensures your reframing instructions aren't buried—they become the central focus of the generation.

## Development
This project includes a **Local Dev Mode** for UI styling:
1. Run `python -m http.server 8000` (or any local server) in the root.
2. Open `http://localhost:8000/popup/popup.html` in your browser.
3. The `js/dev-mock.js` script will simulate Chrome APIs for a smooth development experience.

## Handle Search Feature
The extension includes a **lightweight handle search** that uses Google as a proxy to find X/Twitter accounts:
- **How it works**: Searches Google with `site:x.com OR site:twitter.com [your query]` and parses handles from the results
- **No API required**: Bypasses X API tier limitations by using public search
- **Dev Mode**: Uses mock data for common queries (OpenAI, Elon Musk, Google, etc.) when running locally
- **Extension Mode**: Performs real Google searches when installed as a Chrome extension
- **Minimal & Simple**: Designed for low-frequency use with basic HTML parsing

Note: The older **X API-based user search** remains in the code but is hidden from the UI since it requires a paid **X API Basic Tier** ($100/mo).

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

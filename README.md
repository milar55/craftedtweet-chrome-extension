# Crafted 🖋️

**Crafted** is a premium Chrome extension that transforms long-form articles into engaging, shareable tweets using AI. Designed for content creators and social media professionals, Crafted streamlines your workflow from reading to posting.

![Crafted Logo](icons/logo.png)

## Features

-   **AI-Powered Generation**: Uses OpenAI's GPT models (configurable in settings) to distill articles into clever tweets.
-   **Branded Experience**: Featuring an elegant sepia-themed studio UI.
-   **Full Control**: Edit generated tweets in an auto-growing editor before they go live.
-   **Direct Posting**: Post directly to X (Twitter) using secure OAuth 1.0a authentication.
-   **Customizable Prompt**: Tailor the AI's "personality" by defining your own system prompt.
-   **Configurable Context**: Choose how much article content is sent to the AI (up to 15,000 characters).

## Installation

1.  Clone this repository or download the source code.
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer mode** (toggle in the top right).
4.  Click **Load unpacked** and select the extension folder.

## Setup

1.  Click the **Crafted** icon in your toolbar and go to **Settings**.
2.  Enter your **OpenAI API Key**.
3.  Enter your **Twitter API Credentials** (OAuth 1.0a):
    -   API Key & Secret
    -   Access Token & Secret
4.  Choose your preferred AI model (e.g., `gpt-4o-mini`).
5.  Save your settings.

## Usage

1.  Navigate to any article you want to tweet about.
2.  Click the **Crafted** extension icon.
3.  Click **✨ Generate**.
4.  Review and edit the tweet in the text area.
5.  Click **Post to X** or **📋 Copy** to use it elsewhere.

## Built With

-   Vanilla JavaScript (ES6+)
-   Custom CSS (Sepia Design System)
-   OpenAI Chat Completions API
-   Twitter API v2

## License

MIT

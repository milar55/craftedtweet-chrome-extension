/**
 * Content script that extracts article content from web pages
 */

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractArticle") {
        const articleText = extractArticleText();
        sendResponse({ articleText });
    }
});

/**
 * Extract article text from the current page
 * @returns {string} The extracted article text
 */
function extractArticleText() {
    let longestText = '';

    // Strategy 1: Look for ALL <article> tags and find the one with the most text
    const articleTags = document.querySelectorAll('article');
    articleTags.forEach(article => {
        const text = extractTextFromElement(article);
        if (text.length > longestText.length) {
            longestText = text;
        }
    });

    // Strategy 2: Look for elements with article-related classes (only if <article> didn't yield much)
    // Or compare against them to find a potentially better candidate (e.g. if <article> wraps the whole body including comments)
    const potentialElements = document.querySelectorAll(
        '[class*="article"], [class*="content"], [class*="main"], [class*="body"], [class*="post"]'
    );

    potentialElements.forEach(element => {
        // Skip body/html to avoid selecting the whole page if possible, unless we find nothing else
        if (element.tagName === 'BODY' || element.tagName === 'HTML') return;

        const text = extractTextFromElement(element);
        if (text.length > longestText.length) {
            longestText = text;
        }
    });

    // Strategy 3: Validation - if text is too short, try document body as last resort
    // But exclude obvious non-content like navs which are handled in extractTextFromElement
    if (longestText.length < 200) {
        const bodyText = extractTextFromElement(document.body);
        if (bodyText.length > longestText.length) {
            return bodyText;
        }
    }

    return longestText;
}

/**
 * Extract clean text from an HTML element
 * @param {HTMLElement} element - The element to extract text from
 * @returns {string} Clean text content
 */
function extractTextFromElement(element) {
    // Remove script, style, and other non-content elements
    const clone = element.cloneNode(true);
    const scripts = clone.querySelectorAll('script, style, iframe, noscript, header, footer, nav, aside, .ad, .advertisement');
    scripts.forEach(script => script.remove());

    // Get text content and clean it up
    let text = clone.textContent || clone.innerText;

    // Remove extra whitespace and newlines
    text = text.replace(/\n+/g, ' ');
    text = text.replace(/\s+/g, ' ');
    text = text.trim();

    return text;
}

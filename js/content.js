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
    // Try to find article content using multiple strategies
    
    // Strategy 1: Look for <article> tags
    const articleTags = document.querySelectorAll('article');
    if (articleTags.length > 0) {
        const article = articleTags[0];
        return extractTextFromElement(article);
    }
    
    // Strategy 2: Look for elements with article-related classes
    const potentialElements = document.querySelectorAll(
        '[class*="article"], [class*="content"], [class*="main"], [class*="body"], [class*="post"]'
    );
    
    let longestText = '';
    potentialElements.forEach(element => {
        const text = extractTextFromElement(element);
        if (text.length > longestText.length) {
            longestText = text;
        }
    });
    
    // Strategy 3: If no specific elements found, try to get main content
    if (longestText.length === 0) {
        const bodyText = extractTextFromElement(document.body);
        return bodyText;
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

/**
 * Mock Chrome API for local development outside of an extension context.
 */
if (typeof chrome === 'undefined' || !chrome.extension) {
    window.chrome = {
        runtime: {
            openOptionsPage: () => {
                window.open('../settings/settings.html', '_blank');
            },
            sendMessage: (msg, callback) => {
                console.log('Mock sendMessage:', msg);
                if (callback) callback({ success: true });
            }
        },
        storage: {
            local: {
                get: (keys, callback) => {
                    const promise = new Promise((resolve) => {
                        const result = {};
                        const items = Array.isArray(keys) ? keys : (keys === null ? Object.keys(localStorage) : [keys]);

                        if (keys === null) {
                            for (let i = 0; i < localStorage.length; i++) {
                                const key = localStorage.key(i);
                                try {
                                    result[key] = JSON.parse(localStorage.getItem(key));
                                } catch (e) {
                                    result[key] = localStorage.getItem(key);
                                }
                            }
                        } else {
                            items.forEach(key => {
                                const val = localStorage.getItem(key);
                                try {
                                    result[key] = val ? JSON.parse(val) : undefined;
                                } catch (e) {
                                    result[key] = val;
                                }
                            });
                        }
                        setTimeout(() => {
                            if (callback) callback(result);
                            resolve(result);
                        }, 0);
                    });
                    return promise;
                },
                set: (items, callback) => {
                    const promise = new Promise((resolve) => {
                        Object.keys(items).forEach(key => {
                            localStorage.setItem(key, JSON.stringify(items[key]));
                        });
                        setTimeout(() => {
                            if (callback) callback();
                            resolve();
                        }, 0);
                    });
                    return promise;
                },
                clear: (callback) => {
                    const promise = new Promise((resolve) => {
                        localStorage.clear();
                        setTimeout(() => {
                            if (callback) callback();
                            resolve();
                        }, 0);
                    });
                    return promise;
                }
            }
        },
        tabs: {
            query: (queryInfo, callback) => {
                const mockTab = [{
                    id: 1,
                    url: 'https://example.com/mock-article',
                    active: true
                }];
                if (callback) setTimeout(() => callback(mockTab), 0);
                return Promise.resolve(mockTab);
            },
            sendMessage: (tabId, message) => {
                console.log('Mock tabs.sendMessage:', message);
                return Promise.resolve({
                    articleText: "This is a mock article content for development purposes. It contains enough text to satisfy the extraction requirements and allow you to test the tweet generation UI logic without needing a real tab context."
                });
            }
        },
        scripting: {
            executeScript: ({ target, files }) => {
                console.log('Mock executeScript:', files);
                return Promise.resolve();
            }
        }
    };
    console.log('🛠️ Chrome Extension Mock Loaded');
}


// background.js

async function sendMessageToActiveTab(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, message);
    return response;
}

// Function to analyze and update rules dynamically
const analyzeAndBlock = async (url, sender) => {
    let result = {};
    try {
        // Show loader on the page
        console.log('Analyzing URL:', url);

        // Send message to content script to show loader
        const setLoader = await sendMessageToActiveTab({ type: 'showLoader' });

        console.log('Loader set:', setLoader)

        const response = await fetch('http://localhost:5000/analyze_url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        result = await response.json();

        if (result.prediction !== 'benign') {
            // Block the page if it's malicious
            console.log('Blocking URL:', url);
            // ruleId is a SHORT unique identifier for the rule based on the order of addition INTEGER
            const ruleId = parseInt(Math.random().toString(36).substring(7), 36)
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [{ id: ruleId, priority: 1, action: { type: 'block' }, condition: { urlFilter: url } }]
            });

            const blockPage = await sendMessageToActiveTab({ type: 'blockPage' });
            console.log('Page blocked:', blockPage);
        } else {
            // Allow the page if it's benign
            console.log('Allowing URL:', url);
            // Check if the rule already exists with the same URL
            // If it exists, we remove it

            const rules = await new Promise((resolve) => {
                chrome.declarativeNetRequest.getDynamicRules((rules) => {
                    resolve(rules);
                });
            });

            console.log('Rules:', rules)

            const existingRules = rules.filter((rule) => rule.condition.urlFilter === url);

            // Get all IDs of the rules
            const ruleIds = existingRules.map((rule) => rule.id);

            if (existingRules.length > 0) {
                console.log('Rules already exists, removing:', existingRules);
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: ruleIds
                });
                return;
            }

            const hideLoader = await sendMessageToActiveTab({ type: 'hideLoader' });
            const hideOverlay = await sendMessageToActiveTab({ type: 'hideOverlay' });
            console.log('Loader hidden:', hideLoader, hideOverlay)

            // Analyze other requests on the page
            //analyzeOtherRequests();
        }
    } catch (error) {
        console.error('Error analyzing URL:', error);
        // Handle error: show error message and block the page
        const ruleId = parseInt(Math.random().toString(36).substring(7), 36)
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [{ id: ruleId, priority: 1, action: { type: 'block' }, condition: { urlFilter: url } }]
        });
        chrome.tabs.sendMessage(sender.tab.id, { type: 'showError', message: 'Error analyzing URL' });
    } finally {
        // Hide loader on the page
        console.log('Done analyzing URL:', url);
        writeLog({ url, malicious: result.prediction !== 'benign' });
    }
};

// Write logs on chrome storage local to be read by the popup
const writeLog = (message) => {
    // Check if logs exist in storage
    if (chrome.storage) {
        console.log('Writing log:', message);
        // Fetch logs from storage and update state and replace if it exists
        chrome.storage.local.get('logs', (result) => {
            let logs = result.logs || [];
            logs.map((log) => {
                if (log.url === message.url) {
                    log.malicious = message.malicious;
                }
                return log;
            });
            logs.push(message);
            chrome.storage.local.set({ logs });
        });
    }
};
    

// Function to analyze other requests on the page
const analyzeOtherRequests = () => {
    // Code to analyze other requests on the page
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'analyzePageUrl') {
        analyzeAndBlock(request.url, sender);
    }
});

// src/background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed and background script running');

    // Initialize rules here if needed
});

// Function to analyze and update rules dynamically
const analyzeAndBlock = async (url) => {
    try {
        console.log(`Analyzing URL: ${url}`);
        console.log('Fetching analysis from server')
        const response = await fetch('http://localhost:5000/analyze_url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        const result = await response.json();

        console.log('Analysis result:', result);

        if (result.prediction !== 'benign') {
            const ruleId = Date.now(); // Unique rule ID
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [
                    {
                        id: ruleId,
                        priority: 1,
                        action: { type: 'block' },
                        condition: { urlFilter: url, resourceTypes: ['main_frame', 'sub_frame'] }
                    }
                ]
            });
            console.log(`Added blocking rule for ${url} with rule ID ${ruleId}`);
        }
        else {
            console.log(`No action taken for ${url}`);
        }
    } catch (error) {
        console.error('Error analyzing URL:', error);
    }
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'analyzeUrl') {
        analyzeAndBlock(request.url);
        sendResponse({ message: 'Analysis initiated' });
        return true; // Keep the messaging channel open for sendResponse
    }
});

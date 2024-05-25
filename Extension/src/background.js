// background.js

/**
 * Secure Hash Algorithm (SHA256)
 * http://www.webtoolkit.info/
 * Original code by Angel Marin, Paul Johnston.
 */

function sha256(s) {
    var chrsz = 8;
    var hexcase = 0;

    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function S(X, n) {
        return (X >>> n) | (X << (32 - n));
    }

    function R(X, n) {
        return (X >>> n);
    }

    function Ch(x, y, z) {
        return ((x & y) ^ ((~x) & z));
    }

    function Maj(x, y, z) {
        return ((x & y) ^ (x & z) ^ (y & z));
    }

    function Sigma0256(x) {
        return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
    }

    function Sigma1256(x) {
        return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
    }

    function Gamma0256(x) {
        return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
    }

    function Gamma1256(x) {
        return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
    }

    function core_sha256(m, l) {
        var K = [
            0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
            0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
            0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
            0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967,
            0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
            0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
            0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
            0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
        ];
        var HASH = [
            0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
        ];
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;

        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for (var i = 0; i < m.length; i += 16) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for (var j = 0; j < 64; j++) {
                if (j < 16) {
                    W[j] = m[j + i];
                } else {
                    W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                }

                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }

        return HASH;
    }

    function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;

        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
        }

        return bin;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    }

    function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";

        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }

        return str;
    }

    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}


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
            // ruleId is a SHORT unique identifier for the rule based on the order of addition INTEGER, we use hash of the URL for this
            const ruleId = Number.parseInt(sha256(url).substring(0, 5), 16);

            console.log('Rule ID:', ruleId);

            // Search for the rule in the rules list
            // If it exists, we do not add it again
            const rules = await new Promise((resolve) => {
                chrome.declarativeNetRequest.getDynamicRules((rules) => {
                    resolve(rules);
                });
            });

            console.log('Rules:', rules)

            if (rules && rules.length > 0) {
                const rule = rules.find((rule) => rule.id === ruleId);
                if (rule) {
                    console.log('Rule already exists:', ruleId);
                }
                else {
                    chrome.declarativeNetRequest.updateDynamicRules({
                        addRules: [{ id: ruleId, priority: 1, action: { type: 'block' }, condition: { urlFilter: url } }]
                    });
                }
            } else {                
                chrome.declarativeNetRequest.updateDynamicRules({
                    addRules: [{ id: ruleId, priority: 1, action: { type: 'block' }, condition: { urlFilter: url } }]
                });
            }

            const blockPage = await sendMessageToActiveTab({ type: 'blockPage' });
            console.log('Page blocked:', blockPage);
        } else {
            // Allow the page if it's benign
            console.log('Allowing URL:', url);
            // Check if the rule already exists with the same URL
            // If it exists, we remove it

            let alreadyExists = false;

            const rules = await new Promise((resolve) => {
                chrome.declarativeNetRequest.getDynamicRules((rules) => {
                    resolve(rules);
                });
            });

            console.log('Rules:', rules)

            const ruleId = Number.parseInt(sha256(url).substring(0, 5), 16);
            console.log('Rule ID:', ruleId);

            if (rules && rules.length > 0) {
                const rule = rules.find((rule) => rule.id === ruleId);
                if (rule) {
                    console.log('Removing rule:', ruleId);
                    alreadyExists = true;
                    chrome.declarativeNetRequest.updateDynamicRules({
                        removeRuleIds: [ruleId]
                    });
                }
            };

            const hideOverlay = await sendMessageToActiveTab({ type: 'hideAll', alreadyExists });
            console.log('Loader hidden:', hideOverlay)

            // Analyze other requests on the page
            //analyzeOtherRequests();
        }
    } catch (error) {
        console.error('Error analyzing URL:', error);
        // Handle error: show error message and block the page
        const ruleId = Number.parseInt(sha256(url).substring(0, 5), 16);
        console.log('Rule ID:', ruleId);
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
            console.log('Logs:', logs)
            logs.length > 0 ?
                // Check if the log already exists in the logs, if it does, we update it, else we add it
                logs.filter((log) => log.url === message.url).length > 0 ?
                    logs = logs.map((log) => log.url === message.url ? message : log) :
                    logs.push(message) :
                logs.push(message);
            chrome.storage.local.set({ logs });
        });
    }
};


// Function to whitelist
const addToWhitelist = async (url, sender) => {
    try {
        // Send request to the server to add the URL to the whitelist
        const response = await fetch('http://localhost:5000/add_to_whitelist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        // Check if the response is successful
        if (response.ok) {
            // Remove the rule from the rules list
            console.log('Removing from rules:', url);
            const ruleId = Number.parseInt(sha256(url).substring(0, 5), 16);
            console.log('Rule ID:', ruleId);
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [ruleId]
            });
            // Send message back to the sender
            const request = await chrome.tabs.sendMessage(sender.tab.id, { type: 'whitelistAdded', url });
            console.log('Response from whitelisted contentscript:', request);
            writeLog({ url, malicious: false });
        } else {
            console.error('Error adding to whitelist:', response.statusText);
            await chrome.tabs.sendMessage(sender.tab.id, { type: 'showError', message: 'Error adding to whitelist' });
        }
    } catch (error) {
        console.error('Error adding to whitelist:', error);
        await chrome.tabs.sendMessage(sender.tab.id, { type: 'showError', message: 'Error adding to whitelist' });
    }
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'analyzePageUrl') {
        analyzeAndBlock(request.url, sender);
    } 
    else if (request.type === 'addToWhitelist') {
        addToWhitelist(request.url, sender);
    }
});
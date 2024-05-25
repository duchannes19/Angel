// contentScript.js

// Function to send URL of the page to background script
const sendPageUrlToBackground = () => {
  console.log('Sending URL to background script');
  const currentUrl = window.location.href;
  chrome.runtime.sendMessage({ type: 'analyzePageUrl', url: currentUrl });
};

const loadComponent = (componentScript) => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(`${componentScript}.js`);
  script.type = 'module';
  document.body.appendChild(script);
};

const blockPage = () => {
  // Load the blocker component
  loadComponent('blocker');
  // Add a button to whitelist the page
  const button = document.createElement('button');
  button.id = 'whitelist-button';
  button.innerHTML = 'Whitelist this page';
  button.style = 'position: fixed; bottom: 10px; right: 10px; padding: 10px; border: none; background: white; color: black; cursor: pointer; z-index: 9999; border-radius: 5px;';
  const currentUrl = window.location.href;
  button.onclick = () => sendWhitelistMessage(currentUrl);
  document.body.appendChild(button);
}

// Function to display loader
const showLoader = () => {
  // Block the page content
  const overlay = document.createElement('div');
  overlay.id = 'request-blocker-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '9998';
  document.body.appendChild(overlay);
};

// Remove the loader element from the page
const hideOverlay = () => {
  const overlay = document.getElementById('request-blocker-overlay');
  if (overlay) overlay.remove();
};

const hideBlocker = () => {
  // Remove the loader element from the page
  const loader = document.getElementById('blocker');
  const button = document.getElementById('whitelist-button');
  if (loader) loader.remove();
  if (button) button.remove();
};

const showError = () => {
  // Display error message on the page
  loadComponent('error');
};

const sendWhitelistMessage = (url) => {
  // Confirmation window to whitelist the page
  const confirmation = confirm('Do you want to whitelist this page?');
  if (confirmation) {
    chrome.runtime.sendMessage({ type: 'addToWhitelist', url });
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'showLoader') {
    showLoader();
    sendResponse({ message: 'Loader displayed' });
  } else if (request.type === 'blockPage') {
    blockPage();
    sendResponse({ message: 'Page blocked' });
  } else if (request.type === 'hideAll') {
    hideBlocker();
    hideOverlay();
    sendResponse({ message: 'Loader hidden' });
    if (request.alreadyExist){
      window.location.reload();
    }
  } else if (request.type === 'hideOverlay') {
    hideOverlay();
    sendResponse({ message: 'Overlay hidden' });
  } else if (request.type === 'showError') {
    showError();
    sendResponse({ message: 'Error displayed' });
  } else if (request.type === 'whitelistAdded') {
    hideOverlay();
    hideBlocker();
    sendResponse({ message: 'Whitelist added, blocker removed' });
    // Refresh the page after whitelisting
    window.location.reload();
  }
});

// Send URL of the page to background script when content script is executed
sendPageUrlToBackground();
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

const showError = (message) => {
  // Display error message on the page
  const error = document.createElement('div');
  error.id = 'request-blocker-error';
  error.innerHTML = message; // You can customize the error message here
  error.style.position = 'fixed';
  error.style.top = '50%';
  error.style.left = '50%';
  error.style.transform = 'translate(-50%, -50%)';
  error.style.background = 'rgba(255, 255, 255, 0.8)';
  error.style.padding = '20px';
  error.style.borderRadius = '8px';
  error.style.zIndex = '9999';
  document.body.appendChild(error);
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
  } else if (request.type === 'hideBlocker') {
    hideBlocker();
    sendResponse({ message: 'Loader hidden' });
  } else if (request.type === 'hideOverlay') {
    hideOverlay();
    sendResponse({ message: 'Overlay hidden' });
  } else if (request.type === 'showError') {
    showError(request.message);
    sendResponse({ message: 'Error displayed' });
  } else if (request.type === 'whitelistAdded') {
    hideOverlay();
    hideBlocker();
    sendResponse({ message: 'Whitelist added, blocker removed' });
  }
});

// Send URL of the page to background script when content script is executed
sendPageUrlToBackground();
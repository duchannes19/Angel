// contentScript.js

// Function to send URL of the page to background script
const sendPageUrlToBackground = () => {
  console.log('Sending URL to background script');
  const currentUrl = window.location.href;
  chrome.runtime.sendMessage({ type: 'analyzePageUrl', url: currentUrl });
};

// Function to display loader
const showLoader = () => {
  // display loader on the page
  const loader = document.createElement('div');
  loader.id = 'request-blocker-loader';
  loader.innerHTML = 'Loading...'; // You can customize the loader content here
  loader.style.position = 'fixed';
  loader.style.top = '50%';
  loader.style.left = '50%';
  loader.style.transform = 'translate(-50%, -50%)';
  loader.style.background = 'rgba(255, 255, 255, 0.8)';
  loader.style.padding = '20px';
  loader.style.borderRadius = '8px';
  loader.style.zIndex = '9999';
  document.body.appendChild(loader);
};

// Remove the loader element from the page
const hideLoader = () => {
  const loader = document.getElementById('request-blocker-loader');
  if (loader) {
    loader.remove();
  }
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

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'showLoader') {
    showLoader();
  } else if (request.type === 'hideLoader') {
    hideLoader();
  }
});

// Send URL of the page to background script when content script is executed
sendPageUrlToBackground();
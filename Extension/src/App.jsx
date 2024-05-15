// src/App.jsx

import React, { useEffect, useState } from 'react';

const App = () => {
  const [logs, setLogs] = useState([]);

  // Function to analyze a URL
  const analyzeUrl = (url) => {
    // Send a message to the background script to analyze the URL
    chrome.runtime.sendMessage({ type: 'analyzeUrl', url }, (response) => {
      console.log(response.message); // Log the response from the background script
    });
  };

  useEffect(() => {
    // Check if logs exist in storage
    if (!chrome.storage) {
      return;
    }
    
    // Fetch logs from storage and update state
    chrome.storage.local.get('logs', (result) => {
      if (result.logs) {
        setLogs(result.logs);
      }
    });

    // Automatically analyze a URL on component mount
    analyzeUrl(window.location.href);

    // Listen for changes in the URL and analyze it
    const handleUrlChange = () => {
      analyzeUrl(window.location.href);
    };
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  return (
    <div>
      <h1>Request Blocker</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log.url} - {log.malicious ? 'Blocked' : 'Allowed'}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;

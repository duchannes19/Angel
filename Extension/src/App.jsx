// Chrome Extension: Request Blocker

import React, { useEffect, useState } from 'react';
import { Box, Button, List, ListItem, Text, Image } from '@chakra-ui/react';

import Angel from './assets/angel.png';

import './App.css';

const App = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Check if logs exist in storage
    if (chrome.storage) {
      // Fetch logs from storage and update state
      chrome.storage.local.get('logs', (result) => {
        if (result.logs) {
          setLogs(result.logs);
        }
      });
    }
  }, []);

  const clearLogs = () => {
    if (chrome.storage) {
      chrome.storage.local.set({ logs: [] });
      setLogs([]);
    }
  }

  const clearRules = async () => {
    if (chrome.storage) {
      // Get all rules ids
      const rules = await new Promise((resolve) => {
        chrome.declarativeNetRequest.getDynamicRules((rules) => {
          resolve(rules);
        });
      });

      // Remove all rules
      await new Promise((resolve) => {
        chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: rules.map((rule) => rule.id) }, () => {
          resolve();
        });
      });
    }
  }

  return (
    <Box p={4} className='' display={'flex'} justifyContent={'center'} alignItems={'center'} flexDir={'column'}>
      <Image src={Angel} alt="Logo" mb={2} w={'50%'} />
      <Box mb={4} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={4}>
        <Button onClick={() => clearLogs()}>Clear Logs</Button>
        <Button onClick={() => clearRules()}>Clear Rules</Button>
      </Box>
      <List spacing={3} textAlign={'center'} w={'100%'} maxH={'70vh'} overflowY={'auto'}>
        {logs.map((log, index) => (
          <ListItem key={index}>
            {/* If the url is too long, truncate it */}
            <Text color={log.malicious ? 'red' : 'green'}>{log.url.length > 30 ? `${log.url.substring(0, 30)}...` : log.url} - {log.malicious ? 'Blocked' : 'Allowed'}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default App;

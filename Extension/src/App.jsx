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

  return (
    <Box p={4} className='' display={'flex'} justifyContent={'center'} alignItems={'center'} flexDir={'column'}>
      <Image src={Angel} alt="Logo" mb={2} w={'50%'} />
      <Button onClick={() => clearLogs()}>Clear Logs</Button>
      <List spacing={3} textAlign={'center'}>
        {logs.map((log, index) => (
          <ListItem key={index}>
            <Text>{log.url} - {log.malicious ? 'Blocked' : 'Allowed'}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default App;

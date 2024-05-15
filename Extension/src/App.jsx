// Chrome Extension: Request Blocker

import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Text, Image } from '@chakra-ui/react';

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

  return (
    <Box p={4} className=''>
      <Image src={Angel} alt="Logo" mb={4} w={'30%'} />
      <Heading as="h1" size="lg" mb={4}>Request Blocker</Heading>
      <List spacing={3}>
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

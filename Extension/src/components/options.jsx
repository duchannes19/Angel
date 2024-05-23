import React from 'react';
import ReactDOM from 'react-dom';
import { Box, Button, Input, Text, Image, Divider } from '@chakra-ui/react';
import axios from 'axios';

import Angel from '../assets/angel.png';

const Options = () => {

  const [logs, setLogs] = React.useState([]);
  const [whitelist, setWhitelist] = React.useState([]);
  const [mediaquery, setMediaquery] = React.useState(window.matchMedia('(max-width: 768px)'));

  React.useEffect(() => {
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

  React.useEffect(() => {
    const getWhitelist = async () => {
      const response = await axios.get('http://localhost:5000/get_whitelist');
      console.log(response.data);
      setWhitelist(response.data);
    }

    getWhitelist();
  }, []);

  React.useEffect(() => {
    const handler = e => setMediaquery(e);
    mediaquery.addEventListener('change', handler);
    return () => mediaquery.removeEventListener('change', handler);
  }, [mediaquery]);

  return (
    <Box p={4} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} flexDir={'column'} bg={'#242424'} height={'100vh'} width={'100vw'} textAlign={'center'} overflowY={'auto'}>
      <Image src={Angel} alt="Logo" mb={1} w={mediaquery.matches ? '100px' : '300px'} />
      <Text fontSize="xl" mb={4} color={'white'}>Options Page</Text>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4} border={'1px solid white'} p={4} borderRadius={8} width={'100%'} textAlign={'center'}>
        {/* First row with two components: Log title, then logs */}
        <Text color={'white'} style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Logs</Text>
        <Box display={'flex'} flexDir={'column'} gap={2} height={'auto'} overflowY={'auto'} width={'100%'} textAlign={'center'}>
          {logs.length > 0 ? logs.map((log, index) => (
            <Text color={'white'} key={index}>{log.url} - {log.malicious ? 'Blocked' : 'Allowed'}</Text>
          )) : <Text color={'white'}>No logs available</Text>}
        </Box>
        {/* Divider */}
        <Divider orientation="horizontal" gridColumn="span 2" borderColor={'white'} />
        {/* Second row with two components: Whitelist title, then whitelist */}
        <Text color={'white'} style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Whitelist</Text>
        <Box display={'flex'} flexDir={'column'} gap={2} height={'auto'} overflowY={'auto'} width={'100%'} textAlign={'center'}>
          {whitelist.length > 0 ? whitelist.map((url, index) => (
            <Text color={'white'} key={index}>{url.url}</Text>
          )) : <Text color={'white'}>No whitelist available</Text>}
        </Box>
      </Box>
    </Box>
  );
};

export default Options;
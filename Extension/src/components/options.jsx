import React from 'react';
import axios from 'axios';

import { Box, Button, Text, Image, Divider } from '@chakra-ui/react';

import Notify from './Notify';

import Angel from '../assets/angel.png';

const Options = () => {

  const [logs, setLogs] = React.useState([]);
  const [whitelist, setWhitelist] = React.useState([]);
  const [mediaquery, setMediaquery] = React.useState(window.matchMedia('(max-width: 768px)'));
  const [isretraining, setIsRetraining] = React.useState(false);

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
      try {
        const response = await axios.get('http://localhost:5000/get_whitelist');
        console.log(response.data);
        setWhitelist(response.data);
      }
      catch (error) {
        console.log(error);
      }
    }

    getWhitelist();
  }, []);

  React.useEffect(() => {
    const handler = e => setMediaquery(e);
    mediaquery.addEventListener('change', handler);
    return () => mediaquery.removeEventListener('change', handler);
  }, [mediaquery]);

  const retrainModel = async () => {
    setIsRetraining(true);
    const confirm = window.confirm('Are you sure you want to retrain the model?');
    if (!confirm) {
      setIsRetraining(false);
      return;
    }
    Notify('info', 'Retraining model...');
    try {
      const response = await axios.post('http://localhost:5000/retrain');
      console.log(response.data);
      Notify('success', 'Model retrained successfully');
    } catch (error) {
      console.log(error);
      Notify('error', 'Failed to retrain model');
    } finally {
      setIsRetraining(false);
    }
  };

  const deleteWhitelist = async () => {
    const confirm = window.confirm('Are you sure you want to delete the whitelist?');
    if (!confirm) return;
    Notify('info', 'Deleting whitelist...');
    try {
      const response = await axios.delete('http://localhost:5000/delete_whitelist');
      console.log(response.data);
      Notify('success', 'Whitelist deleted successfully');
      setWhitelist([]);
    } catch (error) {
      console.log(error);
      Notify('error', 'Failed to delete whitelist');
    }
  }

  return (
    <Box p={4} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} flexDir={'column'} bg={'#242424'} height={'100vh'} width={'100vw'} textAlign={'center'} overflowY={'auto'}>
      <Image src={Angel} alt="Logo" mb={1} w={mediaquery.matches ? '100px' : '300px'} />
      <Text fontSize="xl" mb={4} color={'white'}>Options Page</Text>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4} border={'1px solid white'} p={4} borderRadius={8} width={'100%'} textAlign={'center'}>
        {/* First row with two components: Log title, then logs */}
        <Text color={'white'} style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Logs</Text>
        <Box display={'flex'} flexDir={'column'} gap={2} height={'auto'} overflowY={'auto'} width={'100%'} textAlign={'center'}>
          {logs.length > 0 ? logs.map((log, index) => (
            <Text color={log.malicious ? 'red' : 'green'} key={index}>{log.url} - {log.malicious ? 'Blocked' : 'Allowed'}</Text>
          )) : <Text color={'white'}>No logs available</Text>}
        </Box>
        {/* Divider */}
        <Divider orientation="horizontal" gridColumn="span 2" borderColor={'white'} />
        {/* Second row with two components: Whitelist title, then whitelist */}
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexDir={'column'}>
          <Text color={'white'} style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Whitelist</Text>
          <Button colorScheme={'red'} onClick={deleteWhitelist} w={'auto'} margin={'auto'}>Delete Whitelist</Button>
        </Box>
        <Box display={'flex'} flexDir={'column'} gap={2} height={'auto'} overflowY={'auto'} width={'100%'} textAlign={'center'}>
          {whitelist.length > 0 ? whitelist.map((url, index) => (
            <Text color={'white'} key={index}>{url.url}</Text>
          )) : <Text color={'white'}>No whitelist available</Text>}
        </Box>
        {/* Divider */}
        <Divider orientation="horizontal" gridColumn="span 2" borderColor={'white'} />
        {/* Third row with three components: 'Retrain model' with warnings, button */}
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexDir={'column'}>
          <Text color={'white'} style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Retrain Model</Text>
          <Text color={'white'} style={{ fontSize: '0.8rem' }}><b>Warning</b>: This will take a lot depending on your system capabilities.</Text>
          <Text color={'white'} style={{ fontSize: '0.8rem' }}>Only retrain the model if you are sure, otherwise stick to the whitelist.</Text>
        </Box>
        <Button disabled={isretraining} colorScheme={isretraining ? 'gray' : 'blue'} onClick={retrainModel} w={'auto'} margin={'auto'}>{isretraining ? 'Retraining...' : 'Retrain Model'}</Button>
      </Box>
    </Box>
  );
};

export default Options;
import React from 'react';
import ReactDOM from 'react-dom';
import { Box, Button, Input, Text, Image } from '@chakra-ui/react';

import Angel from '../assets/angel.png';

const Options = () => {

  const [mediaquery, setMediaquery] = React.useState(window.matchMedia('(max-width: 768px)'));

  React.useEffect(() => {
    const handler = e => setMediaquery(e);
    mediaquery.addEventListener('change', handler);
    return () => mediaquery.removeEventListener('change', handler);
  }, [mediaquery]);

  return (
    <Box p={4} className='' display={'flex'} justifyContent={'flex-start'} alignItems={'center'} flexDir={'column'} bg={'#242424'} height={'100vh'} width={'100vw'} textAlign={'center'}>
      <Image src={Angel} alt="Logo" mb={1} w={mediaquery.matches ? '100px' : '300px'} />
      <Text fontSize="xl" mb={4} color={'white'}>Options Page</Text>
    </Box>
  );
};

export default Options;

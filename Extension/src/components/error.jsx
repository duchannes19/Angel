import React from 'react'
import ReactDOM from 'react-dom'

import { Box, Text } from '@chakra-ui/react';

const ShowError = () => {

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} height={'100vh'} width={'100vw'} bg={'black'} textAlign={'center'} position={'fixed'} top={0} left={0} zIndex={9998}>
            <Text fontSize={'4rem'} color={'white'}>We could not evaluate the risk of this site</Text>
            <Text fontSize={'1.5rem'} color={'white'}>Check if the Server is running.</Text>
        </Box>
    );
};

//Create element with an id of blocker
const root = document.createElement('div');
root.id = 'error';
document.body.appendChild(root);
const rootElement = ReactDOM.createRoot(root);
rootElement.render(<ShowError />);
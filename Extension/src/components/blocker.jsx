import React from 'react'
import ReactDOM from 'react-dom'

import { Box, Button, List, ListItem, Text, Image } from '@chakra-ui/react';


const Blocker = () => {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} height={'100vh'} width={'100vw'} bg={'black'} textAlign={'center'} position={'fixed'} top={0} left={0} zIndex={9999}>
            <Text fontSize={'4rem'} color={'white'}>The Site has been blocked</Text>
        </Box>
    );
};


//Create element with an id of blocker
const root = document.createElement('div');
root.id = 'blocker';
document.body.appendChild(root);
const rootElement = ReactDOM.createRoot(root);
rootElement.render(<Blocker />);
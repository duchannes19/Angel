import React from 'react'
import ReactDOM from 'react-dom'

import { Box, Button, Text, Image } from '@chakra-ui/react';

const buttonstyle = {
    backgroundColor: 'white',
    color: 'black',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    margin: '10px'
}

const Blocker = () => {

    const [mediaquery, setMediaquery] = React.useState(window.matchMedia('(max-width: 768px)'));

    React.useEffect(() => {
        const handler = e => setMediaquery(e);
        mediaquery.addEventListener('change', handler);
        return () => mediaquery.removeEventListener('change', handler);
    }, [mediaquery]);

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} height={'100vh'} width={'100vw'} bg={'black'} textAlign={'center'} position={'fixed'} top={0} left={0} zIndex={9998}>
            <Image src={'https://i.ibb.co/2SPdstw/angel.png'} alt={'Angel'} width={mediaquery.matches ? '100px' : '300px'} />
            <Text fontSize={'4rem'} color={'white'}>The Site has been blocked</Text>
            <Text fontSize={'1.5rem'} color={'white'}>You think it is safe?</Text>
        </Box>
    );
};

//Create element with an id of blocker
const root = document.createElement('div');
root.id = 'blocker';
document.body.appendChild(root);
const rootElement = ReactDOM.createRoot(root);
rootElement.render(<Blocker />);
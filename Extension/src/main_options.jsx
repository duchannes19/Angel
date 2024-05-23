import React from 'react';
import ReactDOM from 'react-dom';

import Options from './components/options.jsx';

import { ChakraProvider } from '@chakra-ui/react';

const Main = () => {
  return (
    <ChakraProvider>
      <Options />
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
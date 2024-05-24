import React from 'react';
import ReactDOM from 'react-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Options from './components/options.jsx';

import { ChakraProvider } from '@chakra-ui/react';

const Main = () => {
  return (
    <ChakraProvider>
      <ToastContainer />
      <Options />
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
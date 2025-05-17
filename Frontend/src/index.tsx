import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import { TokenProvider } from './Components/Context/TokenContext';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter> 
        <TokenProvider> 
          <App />
        </TokenProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
reportWebVitals();

import { ApolloClient, NormalizedCacheObject, ApolloProvider } from '@apollo/client';
import { cache } from './cache';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Pages from './pages';
import injectStyles from './styles';

// Initialize ApolloClient
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: "http://localhost:4000/graphql",
});

injectStyles();

// Find our rootElement or throw an error if it doesn't exist
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

// Pass the ApolloClient instance to the ApolloProvider component;
// ApolloProvider wraps the React app and places client on the context so you can access it
// anywhere in the component tree
root.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
);


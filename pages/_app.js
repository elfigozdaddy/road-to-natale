import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../Layout';
import '../styles/globals.css';
import { useState } from 'react';

if (typeof window !== 'undefined') {
  // Assicurati che localStorage sia disponibile
  window.localStorage = window.localStorage || {};
}

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}
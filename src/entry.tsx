import Index from '@/pages/index.tsx';
import { theme } from '@/styles/theme.ts';
import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Index />
    </MantineProvider>
  </React.StrictMode>,
);

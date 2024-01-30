import Router from '@/app/router.tsx';
import '@/styles/global.css';
import { theme } from '@/styles/theme.ts';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * Entry point for CSR rendering called from index.html
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <Notifications />
      <Router />
    </MantineProvider>
  </React.StrictMode>,
);

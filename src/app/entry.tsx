import Router from '@/app/router';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import classes from './entry.module.css';
import './global.css';

/**
 * Entry point for CSR rendering called from index.html
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      defaultColorScheme="auto"
      theme={{
        colors: {
          dark: [
            'rgb(188,189,201)',
            'rgb(165,166,182)',
            'rgb(135,137,154)',
            'rgb(121,123,140)',
            'rgb(101,103,119)',
            'rgb(83,85,100)',
            'rgb(63,64,77)',
            'rgb(52,53,65)',
            'rgb(41,42,52)',
            'rgb(26,26,33)',
          ],
        },
        activeClassName: classes['activated'],
        defaultRadius: 'md',
      }}
    >
      <Notifications />
      <Router />
    </MantineProvider>
  </React.StrictMode>,
);

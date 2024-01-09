import '@/styles/global.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import Index from '@/pages/index.tsx';
import { theme } from '@/styles/theme.ts';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Notifications />
      <ModalsProvider>
        <Index />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
);

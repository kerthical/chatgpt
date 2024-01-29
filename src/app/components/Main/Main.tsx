import { isNavbarOpenAtom } from '@/app/stores';
import { AppShellMain, Box, Stack } from '@mantine/core';
import { useAtom } from 'jotai';
import { memo } from 'react';

import classes from './Main.module.css';

export const Main = memo(() => {
  const [isNavbarOpen, setIsNavbarOpen] = useAtom(isNavbarOpenAtom);
  return (
    <AppShellMain>
      <Stack gap="xs" h="calc(100dvh - var(--app-shell-header-height))" left={0} pos="relative" top={0} w="100%">
        <Box
          className={classes['sidebar-chevron-container']}
          component="button"
          onClick={() => setIsNavbarOpen(prev => !prev)}
          visibleFrom="sm"
        >
          <div
            className={isNavbarOpen ? classes['sidebar-chevron-upper-opened'] : classes['sidebar-chevron-upper-closed']}
          />
          <div
            className={isNavbarOpen ? classes['sidebar-chevron-lower-opened'] : classes['sidebar-chevron-lower-closed']}
          />
        </Box>
      </Stack>
    </AppShellMain>
  );
});

Main.displayName = 'Main';

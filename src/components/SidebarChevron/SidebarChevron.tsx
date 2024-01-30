import { useTranslator } from '@/hooks/useTranslator';
import { isNavbarOpenAtom } from '@/stores/navbar';
import { Box, Tooltip } from '@mantine/core';
import { useAtom } from 'jotai/index';
import { memo } from 'react';

import * as classes from './SidebarChevron.css.ts';

export const SidebarChevron = memo(() => {
  const [isNavbarOpen, setIsNavbarOpen] = useAtom(isNavbarOpenAtom);
  const translate = useTranslator('main');

  return (
    <Tooltip
      bg="black"
      c="white"
      fw={700}
      label={isNavbarOpen ? translate('close_sidebar') : translate('open_sidebar')}
      position="right"
      withArrow
    >
      <Box
        className={classes.sidebarChevronContainer}
        component="button"
        onClick={() => setIsNavbarOpen(prev => !prev)}
        visibleFrom="sm"
      >
        <div className={isNavbarOpen ? classes.sidebarChevronUpperOpened : classes.sidebarChevronUpperClosed} />
        <div className={isNavbarOpen ? classes.sidebarChevronLowerOpened : classes.sidebarChevronLowerClosed} />
      </Box>
    </Tooltip>
  );
});

SidebarChevron.displayName = 'SidebarChevron';

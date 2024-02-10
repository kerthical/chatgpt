import type { MantineThemeOverride } from '@mantine/core';

import { createTheme } from '@mantine/core';
import { themeToVars } from '@mantine/vanilla-extract';

import * as classes from './entry.css.ts';

export const theme: MantineThemeOverride = createTheme({
  activeClassName: classes.activated,
  defaultRadius: 'md',
  fontFamily: "'Noto Sans JP', sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', monospace",
  colors: {
    dark: [
      '#e3e3e3',
      '#b6b6b6',
      '#9d9d9d',
      '#7c7c7c',
      '#5e5e5e',
      '#3f3f3f',
      '#262626',
      '#171717',
      '#111111',
      '#0d0d0d',
    ],
  },
});

export const vars = themeToVars(theme);

import type { MantineThemeOverride } from '@mantine/core';

import { createTheme } from '@mantine/core';
import { themeToVars } from '@mantine/vanilla-extract';

import * as classes from './entry.css.ts';

export const theme: MantineThemeOverride = createTheme({
  fontFamily: "'M PLUS 2', sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', monospace",
  fontSizes: {
    xs: '0.65rem',
    sm: '0.75rem',
    md: '0.85rem',
    lg: '1rem',
    xl: '1.15rem',
  },
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
  activeClassName: classes.activated,
  defaultRadius: 'md',
});

export const vars = themeToVars(theme);

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
      '#bcbdc9',
      '#a5a6b6',
      '#87899a',
      '#797b8c',
      '#656777',
      '#535564',
      '#3f404d',
      '#343541',
      '#292a34',
      '#1a1a21',
    ],
  },
});

export const vars = themeToVars(theme);

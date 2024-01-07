import * as classes from '@/styles/theme.css.ts';
import { MantineThemeOverride, createTheme } from '@mantine/core';
import { themeToVars } from '@mantine/vanilla-extract';

export const theme: MantineThemeOverride = createTheme({
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
  autoContrast: true,
  activeClassName: classes.active,
  defaultRadius: 'md',
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";',
});

export const vars = themeToVars(theme);

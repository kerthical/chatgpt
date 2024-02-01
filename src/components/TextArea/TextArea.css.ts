import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.ts';

export const textArea = style({});

globalStyle(`[data-mantine-color-scheme="light"] ${textArea} textarea::placeholder`, {
  color: 'rgba(0,0,0,0.5)',
  fontSize: '16px',
});

globalStyle(`[data-mantine-color-scheme="dark"] ${textArea} textarea::placeholder`, {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '16px',
});

globalStyle(`[data-mantine-color-scheme="light"] ${textArea} textarea`, {
  fontSize: '16px',
  color: 'black',
  background: 'transparent',
  borderColor: 'rgba(0, 0, 0, 0.2)',
  padding: '14px 0px 14px 16px',
  lineHeight: '24px',
});

globalStyle(`[data-mantine-color-scheme="light"] ${textArea} textarea:focus`, {
  borderColor: 'rgba(0, 0, 0, 0.4)',
});

globalStyle(`[data-mantine-color-scheme="dark"] ${textArea} textarea`, {
  fontSize: '16px',
  color: 'white',
  background: 'transparent',
  borderColor: 'rgba(217, 217, 227, 0.2)',
  padding: '14px 0px 14px 16px',
  lineHeight: '24px',
});

globalStyle(`[data-mantine-color-scheme="dark"] ${textArea} textarea:focus`, {
  borderColor: 'rgba(217, 217, 227, 0.4)',
});

export const sendButton = style({
  transition: 'all 0.3s ease',
  ':disabled': {
    opacity: 0.1,
  },
  selectors: {
    [vars.lightSelector]: {
      backgroundColor: 'black',
    },
    [vars.darkSelector]: {
      backgroundColor: 'white',
    },
  },
});

export const sendButtonIcon = style({
  selectors: {
    [`${sendButton}:disabled &`]: {
      opacity: 0.3,
    },
    [vars.lightSelector]: {
      color: 'white',
    },
    [vars.darkSelector]: {
      color: 'black',
    },
  },
});

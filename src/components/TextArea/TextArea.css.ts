import { globalStyle, style } from '@vanilla-extract/css';

export const textArea = style({});

globalStyle(`${textArea} textarea::placeholder`, {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '16px',
});

export const sendButton = style({
  backgroundColor: 'white',
  transition: 'all 0.3s ease',
  ':disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
});

export const sendButtonIcon = style({
  selectors: {
    [`${sendButton}:disabled &`]: {
      opacity: 0.3,
    },
  },
});

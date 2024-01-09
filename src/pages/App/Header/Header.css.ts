import { style } from '@vanilla-extract/css';

const modelSelectButton = style({
  padding: '8px 12px',
  borderRadius: '12px',
});

export const modelSelectorButtonClosed = style([
  modelSelectButton,
  {
    ':hover': {
      background: 'rgba(0, 0, 0, 0.1)',
    },
  },
]);

export const modelSelectorButtonOpened = style([
  modelSelectButton,
  {
    background: 'rgba(0, 0, 0, 0.2)',
  },
]);

export const modelSelector = style({
  background: '#202123',
  borderRadius: '12px',
  borderColor: 'rgba(64, 65, 80, 1)',
});

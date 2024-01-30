import { style } from '@vanilla-extract/css';

const modelButton = style({
  padding: '8px 12px',
  borderRadius: '12px',
});

export const modelButtonClosed = style([
  modelButton,
  {
    ':hover': {
      background: 'rgb(0 0 0 / 10%)',
    },
  },
]);

export const modelButtonOpened = style([
  modelButton,
  {
    background: 'rgb(0 0 0 / 20%)',
  },
]);

export const modelSelector = style({
  borderColor: 'rgb(64 65 80)',
  borderRadius: '12px',
  background: 'rgb(32 33 35)',
});

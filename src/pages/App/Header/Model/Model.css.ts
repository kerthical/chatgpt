import { style } from '@vanilla-extract/css';

export const modelSelectorItem = style({
  padding: '8px 12px',
  borderRadius: '12px',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
});

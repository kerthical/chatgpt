import { style } from '@vanilla-extract/css';

export const active = style({
  transition: 'transform 0.2s ease',
  ':active': {
    transform: 'scale(0.95)',
  },
});

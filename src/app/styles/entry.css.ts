import { style } from '@vanilla-extract/css';

export const activated = style({
  transition: 'transform 0.2s ease-in-out',
  ':active': {
    transform: 'scale(0.95)',
  },
});

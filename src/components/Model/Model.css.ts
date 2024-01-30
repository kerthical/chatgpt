import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme';

export const item = style({
  padding: '8px 12px',
  borderRadius: '8px',
  selectors: {
    [`${vars.darkSelector}:hover`]: {
      background: 'rgb(255 255 255 / 10%)',
    },
    [`${vars.lightSelector}:hover`]: {
      background: 'rgb(0 0 0 / 10%)',
    },
  },
});

import { globalStyle, style } from '@vanilla-extract/css';

export const messageContainer = style({});
export const messageActions = style({
  opacity: 0,
  selectors: {
    [`${messageContainer}:last-child &`]: {
      opacity: 1,
    },

    [`${messageContainer}:hover &`]: {
      opacity: 1,
    },
  },
});
export const messageContent = style({});

globalStyle(`${messageContent} ol`, {
  listStyle: 'auto',
  margin: '20px 0',
  padding: 0,
});

globalStyle(
  `${messageContent} strong
`,
  {
    color: 'white',
  },
);

export const messageFileContainer = style({
  borderRadius: '12px',
  aspectRatio: '1 / 1',
});

export const messageFileImage = style({
  cursor: 'pointer',
});

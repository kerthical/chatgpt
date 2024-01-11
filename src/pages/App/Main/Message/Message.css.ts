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
  cursor: 'pointer',
});

export const collapseArea = style({
  cursor: 'pointer',
});

const collapseIcon = style({
  transition: 'transform 0.2s ease-in-out',
});

export const collapseIconOpened = style([
  collapseIcon,
  {
    transform: 'rotate(180deg)',
  },
]);
export const collapseIconClosed = style([
  collapseIcon,
  {
    transform: 'rotate(0deg)',
  },
]);

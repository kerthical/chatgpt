import { style } from '@vanilla-extract/css';

export const messageImageAttachmentContainer = style({
  borderRadius: '12px',
  aspectRatio: '1 / 1',
  cursor: 'pointer',
  width: 256,
  height: 256,
});

export const messageFileAttachmentContainer = style({
  borderRadius: '12px',
  cursor: 'pointer',
  width: 128,
  height: 64,
});

export const textAreaAttachmentContainer = style({
  borderRadius: '12px',
  aspectRatio: '1 / 1',
  cursor: 'pointer',
  width: 128,
  height: 128,
});

export const textAreaAttachmentActions = style({
  position: 'absolute',
  top: '-4px',
  right: '-4px',
  background: '#F03E3E',
  opacity: 0,
  ':hover': {
    opacity: 1,
    background: '#E03131',
  },
  selectors: {
    [`${textAreaAttachmentContainer}:hover &`]: {
      opacity: 1,
    },
  },
});

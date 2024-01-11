import { globalStyle, style } from '@vanilla-extract/css';

export const sidebarChevronContainer = style({
  position: 'absolute',
  left: '0',
  top: '50%',
  zIndex: 40,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '72px',
  width: '32px',
});

const sidebarChevron = style({
  background: 'gray',
  width: '4px',
  height: '12px',
  transform: 'rotate(0)',
  transition: 'all 0.3s ease',

  selectors: {
    [`${sidebarChevronContainer}:hover &`]: {
      background: 'white',
    },
  },
});

const sidebarChevronUpper = style([
  sidebarChevron,
  {
    borderTopLeftRadius: '0.125rem',
    borderTopRightRadius: '0.125rem',
  },
]);
const sidebarChevronLower = style([
  sidebarChevron,
  {
    borderBottomLeftRadius: '0.125rem',
    borderBottomRightRadius: '0.125rem',
  },
]);

export const sidebarChevronUpperOpened = style([
  sidebarChevronUpper,
  {
    selectors: {
      [`${sidebarChevronContainer}:hover &`]: {
        transform: 'translateY(0.05rem) rotate(15deg)',
      },
    },
  },
]);
export const sidebarChevronLowerOpened = style([
  sidebarChevronLower,
  {
    selectors: {
      [`${sidebarChevronContainer}:hover &`]: {
        transform: 'translateY(-0.05rem) rotate(-15deg)',
      },
    },
  },
]);

export const sidebarChevronUpperClosed = style([
  sidebarChevronUpper,
  {
    transform: 'translateY(0.05rem) rotate(-15deg)',
    selectors: {
      [`${sidebarChevronContainer}:hover &`]: {},
    },
  },
]);
export const sidebarChevronLowerClosed = style([
  sidebarChevronLower,
  {
    transform: 'translateY(-0.05rem) rotate(15deg)',
    selectors: {
      [`${sidebarChevronContainer}:hover &`]: {},
    },
  },
]);

export const sendButton = style({
  zIndex: 10,
  background: 'white',
  outline: '1px solid',
  outlineColor: 'white',
  transition: 'all 0.3s ease',
  ':hover': {
    background: 'transparent',
  },
  ':disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    outlineColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export const sendButtonIcon = style({
  selectors: {
    [`${sendButton}:disabled &`]: {
      opacity: 0.3,
    },
  },
});

export const messageInputWithFile = style({});

globalStyle(`${messageInputWithFile} textarea`, {
  borderTop: 'none',
  borderTopLeftRadius: '0',
  borderTopRightRadius: '0',
});

const messageFileArea = style({
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  borderTop: '1px solid',
  borderLeft: '1px solid',
  borderRight: '1px solid',
});

export const messageFileAreaUnfocused = style([
  messageFileArea,
  {
    borderColor: '#656777',
  },
]);

export const messageFileAreaFocused = style([
  messageFileArea,
  {
    borderColor: '#286fb3',
  },
]);

export const messageFileContainer = style({
  borderRadius: '12px',
  aspectRatio: '1 / 1',
});

export const messageFile = style({
  cursor: 'pointer',
});

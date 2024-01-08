import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.ts';

export const newChatButton = style({
  position: 'sticky',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
});

const accountMenuButton = style({
  padding: '8px 12px',
  borderRadius: '12px',
});

export const accountMenuButtonClosed = style([
  accountMenuButton,
  {
    ':hover': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
  },
]);

export const accountMenuButtonOpened = style([
  accountMenuButton,
  {
    background: 'rgba(255, 255, 255, 0.1)',
  },
]);

export const accountMenu = style({
  background: '#202123',
  borderRadius: '12px',
  padding: '12px 0',
  borderColor: 'rgba(64, 65, 80, 1)',
});

export const accountMenuItem = style({
  padding: '8px 12px',
  borderRadius: '0',
  ':hover': {
    background: vars.colors.dark[7],
  },
});

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

export const modelSelectorItem = style({
  padding: '8px 12px',
  borderRadius: '12px',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
});

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

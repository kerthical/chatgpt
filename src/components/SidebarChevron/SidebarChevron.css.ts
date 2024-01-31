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
  height: '10px',
  transform: 'rotate(0)',
  transition: 'all 0.3s ease',
});

globalStyle(`[data-mantine-color-scheme="light"] ${sidebarChevronContainer}:hover ${sidebarChevron}`, {
  background: 'black',
});

globalStyle(`[data-mantine-color-scheme="dark"] ${sidebarChevronContainer}:hover ${sidebarChevron}`, {
  background: 'white',
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
  },
]);
export const sidebarChevronLowerClosed = style([
  sidebarChevronLower,
  {
    transform: 'translateY(-0.05rem) rotate(15deg)',
  },
]);

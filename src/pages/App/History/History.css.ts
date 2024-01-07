import { style } from '@vanilla-extract/css';

export const historyMenu = style({
  background: '#202123',
  borderRadius: '8px',
  padding: '6px',
  borderColor: 'rgba(64, 65, 80, 1)',
});

export const historyMenuItem = style({
  padding: '12px',
  borderRadius: '4px',
  color: 'white',
  fontWeight: 'bold',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.05)',
  },
});

export const history = style({
  position: 'relative',
  borderRadius: '8px',
});

export const historyActionsSelected = style({
  opacity: 1,
});

export const historyActionsUnselected = style({
  opacity: 0,
  selectors: {
    [`${history}:hover &`]: {
      opacity: 1,
    },
  },
});

const historyOverlay = style({
  position: 'absolute',
  bottom: '0',
  right: '0',
  top: '0',
});

export const historyOverlaySelected = style([
  historyOverlay,
  {
    width: '80px',
    background: 'linear-gradient(to left, #343541 40%, transparent)',
  },
]);

export const historyOverlayUnselected = style([
  historyOverlay,
  {
    width: '32px',
    background: 'linear-gradient(to left, black 40%, transparent)',
  },
]);

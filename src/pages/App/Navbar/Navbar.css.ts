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

import { createSafeContext } from '@mantine/core';

export interface AppContextValue {
  isNavbarOpen: boolean;
  setNavbarOpen(value: boolean): void;
  closeNavbar(): void;
  openNavbar(): void;
  toggleNavbar(): void;
}

export const [AppProvider, useAppContext] = createSafeContext<AppContextValue>(
  'App.Root component was not found in tree.',
);

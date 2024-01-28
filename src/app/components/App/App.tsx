import { AppProvider } from '@/app/components/App';
import { Header } from '@/app/components/Header';
import { AppShell } from '@mantine/core';
import { useState } from 'react';

export function App() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    <AppProvider
      value={{
        isNavbarOpen: isNavbarOpen,
        setNavbarOpen(value: boolean) {
          setIsNavbarOpen(value);
        },
        openNavbar() {
          setIsNavbarOpen(true);
        },
        closeNavbar() {
          setIsNavbarOpen(false);
        },
        toggleNavbar() {
          setIsNavbarOpen(current => !current);
        },
      }}
    >
      <AppShell
        header={{ height: 60 }}
        layout="alt"
        navbar={{
          width: { base: 320, sm: 260 },
          breakpoint: 'sm',
          collapsed: { desktop: !isNavbarOpen, mobile: !isNavbarOpen },
        }}
        transitionDuration={200}
        withBorder={false}
      >
        <Header />
      </AppShell>
    </AppProvider>
  );
}

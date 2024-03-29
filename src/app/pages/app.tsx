import { Header } from '@/components/Header';
import { Main } from '@/components/Main';
import { Navbar } from '@/components/Navbar';
import { isNavbarOpenAtom } from '@/stores/navbar.ts';
import { AppShell } from '@mantine/core';
import { useAtomValue } from 'jotai';

export default function App() {
  const isNavbarOpen = useAtomValue(isNavbarOpenAtom);

  return (
    <AppShell
      header={{
        height: {
          base: 44,
          sm: 60,
        },
      }}
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
      <Navbar />
      <Main />
    </AppShell>
  );
}

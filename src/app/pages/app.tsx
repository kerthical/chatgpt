import { Header, Navbar } from '@/app/components';
import { isNavbarOpenAtom } from '@/app/stores/navbar';
import { AppShell } from '@mantine/core';
import { useAtomValue } from 'jotai';

export default function App() {
  const isNavbarOpen = useAtomValue(isNavbarOpenAtom);

  return (
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
      <Navbar />
    </AppShell>
  );
}

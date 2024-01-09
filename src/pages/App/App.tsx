import { useNavbar } from '@/hooks/useNavbar.ts';
import { Header } from '@/pages/App/Header/Header.tsx';
import { Main } from '@/pages/App/Main/Main.tsx';
import { Navbar } from '@/pages/App/Navbar/Navbar.tsx';
import { AppShell } from '@mantine/core';

export default function App() {
  const { isNavbarOpened } = useNavbar();

  return (
    <AppShell
      header={{
        height: 60,
      }}
      layout="alt"
      navbar={{
        width: {
          base: 320,
          sm: 260,
        },
        breakpoint: 'sm',
        collapsed: {
          desktop: !isNavbarOpened,
          mobile: !isNavbarOpened,
        },
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

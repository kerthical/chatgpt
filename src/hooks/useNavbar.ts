import { useResponsive } from '@/hooks/useResponsive.ts';
import { useDisclosure } from '@mantine/hooks';

export function useNavbar() {
  const { isMobile } = useResponsive();
  const [isNavbarOpened, { open, close, toggle }] = useDisclosure(!isMobile);
  return { isNavbarOpened, openNavbar: open, closeNavbar: close, toggleNavbar: toggle };
}

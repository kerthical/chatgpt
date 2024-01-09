import { useMediaQuery } from '@mantine/hooks';

export function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 48em)');
  return { isMobile };
}

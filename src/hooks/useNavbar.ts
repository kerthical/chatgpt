import { atom, useAtom } from 'jotai';

const isNavbarOpenedAtom = atom(true);
export function useNavbar() {
  const [isNavbarOpened, setIsNavbarOpened] = useAtom(isNavbarOpenedAtom);
  return {
    isNavbarOpened,
    openNavbar: () => setIsNavbarOpened(true),
    closeNavbar: () => setIsNavbarOpened(false),
    toggleNavbar: () => setIsNavbarOpened(prev => !prev),
  };
}

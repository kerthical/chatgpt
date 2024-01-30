import { atom } from 'jotai';

export const isNavbarOpenAtom = atom<boolean>(window.innerWidth > 768);

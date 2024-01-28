import type { locales } from '@/locales';

import { atomWithStorage } from 'jotai/utils';

/**
 * OpenAI ApiKey atom
 */
export const localeAtom = atomWithStorage<keyof typeof locales>('locale', 'ja');

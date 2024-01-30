import { apikeyAtom } from '@/stores/apikey.ts';
import { atom } from 'jotai';
import OpenAI from 'openai';

/**
 * OpenAI API client atom (read-only)
 */
export const clientAtom = atom<OpenAI>(
  get =>
    new OpenAI({
      apiKey: get(apikeyAtom),
      dangerouslyAllowBrowser: true,
    }),
);

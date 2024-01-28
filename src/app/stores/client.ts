import { apikeyAtom } from '@/app/stores/apikey';
import { atom } from 'jotai';
import OpenAI from 'openai';

/**
 * OpenAI API client atom (read-only)
 */
export const clientAtom = atom(
  get =>
    new OpenAI({
      apiKey: get(apikeyAtom),
      dangerouslyAllowBrowser: true,
    }),
);

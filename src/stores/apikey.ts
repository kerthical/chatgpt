import { atomWithStorage } from 'jotai/utils';

/**
 * OpenAI ApiKey atom
 */
export const apikeyAtom = atomWithStorage<string>('apikey', '');

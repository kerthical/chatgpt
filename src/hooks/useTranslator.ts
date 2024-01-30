import type { MessageKeys, NamespaceKeys } from '@/locales';

import { translateUnsafe } from '@/locales/translate.ts';
import { localeAtom } from '@/stores/locale';
import { useAtomValue } from 'jotai';

/**
 * A hook that returns a function that can be translated when a key is entered, according to the current locale.
 *
 * @param namespace Namespace to translate
 * @returns A function that can be translated when a key is entered, according to the current locale
 */
export function useTranslator<NK extends NamespaceKeys<'en'>, MK extends MessageKeys<'en', NK>>(namespace: NK) {
  const locale = useAtomValue(localeAtom);

  return (key: MK): string => translateUnsafe(locale, namespace, key);
}

import { localeAtom } from '@/app/stores/locale';
import { translate } from '@/locales/translate';
import { useAtomValue } from 'jotai';

/**
 * A hook that returns a function that can be translated when a key is entered, according to the current locale.
 *
 * @param namespace Namespace to translate
 * @returns A function that can be translated when a key is entered, according to the current locale
 */
export function useTranslator(namespace: string) {
  const locale = useAtomValue(localeAtom);

  return (key: string) => translate(locale, namespace, key);
}

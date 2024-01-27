import { translate } from '@/locales/translate';
import { localeAtom } from '@/stores/locale';
import { useAtomValue } from 'jotai';

export function useTranslator(namespace: string) {
  const locale = useAtomValue(localeAtom);

  return (key: string) => translate(locale, namespace, key);
}

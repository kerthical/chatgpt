import type { LocaleKeys, MessageKeys, NamespaceKeys } from '@/locales';

import { locales } from '@/locales';

/**
 * A function that returns the corresponding message from a given locale, namespace, message key, and arguments.
 *
 * @param locale The locale to use.
 * @param namespace The namespace to use.
 * @param messageKey The message key to use.
 * @param args The arguments(Key-Value store) to use.
 */
export function translate<LK extends LocaleKeys, NK extends NamespaceKeys<LK>, MK extends MessageKeys<LK, NK>>(
  locale: LK,
  namespace: NK,
  messageKey: MK,
  args: Record<string, string> = {},
): string {
  const namespaces = locales[locale];
  const messages = namespaces[namespace];
  const message = messages[messageKey];
  return Object.keys(args).reduce(
    (acc: string, key: string) => acc.replace(`{{${key}}}`, args[key] ?? `{{${key}}}`),
    message as string,
  );
}

/**
 * A function that returns the corresponding message from a given locale, namespace, message key, and arguments. but using string.
 */
export function translateUnsafe(
  locale: string,
  namespace: string,
  messageKey: string,
  args: Record<string, string> = {},
): string {
  const namespaces = locales[locale as LocaleKeys];
  const messages = namespaces[namespace as NamespaceKeys<LocaleKeys>];
  const message = messages[messageKey as MessageKeys<LocaleKeys, NamespaceKeys<LocaleKeys>>];
  return Object.keys(args).reduce(
    (acc: string, key: string) => acc.replace(`{{${key}}}`, args[key] ?? `{{${key}}}`),
    message as string,
  );
}

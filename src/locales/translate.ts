import { locales } from '@/locales';

/**
 * A function that returns the corresponding message from a given locale, namespace, message key, and arguments.
 *
 * @param locale The locale to use.
 * @param namespace The namespace to use.
 * @param messageKey The message key to use.
 * @param args The arguments(Key-Value store) to use.
 */
export function translate(
  locale: keyof typeof locales,
  namespace: string,
  messageKey: string,
  args: Record<string, string> = {},
): string {
  const namespaces = locales[locale] as Record<string, Record<string, string>>;
  const messages = namespaces[namespace] || {};
  const message = messages[messageKey] || messageKey;
  return Object.keys(args).reduce((acc, key) => acc.replace(`{{${key}}}`, args[key] ?? `{{${key}}}`), message);
}

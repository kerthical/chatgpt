import locales from '@/locales';

export function translate(
  locale: keyof typeof locales,
  namespace: string,
  messageKey: string,
  args: Record<string, string> = {},
): string {
  const namespaces = locales[locale] as Record<string, Record<string, string>>;
  const messages = namespaces[namespace] || {};
  const message = messages[messageKey] || messageKey;
  return Object.keys(args).reduce((acc, key) => acc.replace(`{${key}}`, args[key] ?? `{${key}}`), message);
}

import { en } from '@/locales/en';
import { ja } from '@/locales/ja';

/**
 * Objects that compile translation data for each language. Define namespace and messages.
 */
export const locales = {
  en,
  ja,
} as const;

export type LocaleKeys = keyof typeof locales;
export type NamespaceKeys<LK extends LocaleKeys> = Extract<keyof (typeof locales)[LK], string>;
export type MessageKeys<LK extends LocaleKeys, NK extends NamespaceKeys<LK>> = Extract<
  keyof (typeof locales)[LK][NK],
  string
>;

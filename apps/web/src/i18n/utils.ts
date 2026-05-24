import { en } from './en';
import { bn } from './bn';

export const ui = { en, bn } as const;

export type Locale = keyof typeof ui;
export const defaultLang = 'en';

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Locale;
  return defaultLang;
}

export function useTranslations(lang: Locale) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function useTranslatedPath(lang: Locale) {
  return function translatePath(path: string, l: string = lang) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return l === defaultLang ? cleanPath : `/${l}${cleanPath}`;
  }
}

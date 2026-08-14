export const defaultLocale = "ru" as const;
export const locales = ["ru", "en", "ro"] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  ro: "Română",
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

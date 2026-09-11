"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, Locale } from "../../i18n/config";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Replace current locale segment in pathname
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.unshift("", newLocale);
    }
    const newPath = segments.join("/") || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <div
      className="inline-flex items-stretch h-8 border border-line rounded-sm overflow-hidden divide-x divide-line font-mono text-[11px] tracking-[0.08em] uppercase"
      role="group"
      aria-label="Language"
    >
      {locales.map((loc) => {
        const isActive = loc === currentLocale;
        return (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={`px-2.5 transition-colors duration-180 cursor-pointer ${
              isActive ? "bg-ink text-ink-inverse" : "text-ink-3 hover:text-ink hover:bg-surface"
            }`}
            title={localeNames[loc]}
            aria-pressed={isActive}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}

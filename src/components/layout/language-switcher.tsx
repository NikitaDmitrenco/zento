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
    <div className="inline-flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
      {locales.map((loc) => {
        const isActive = loc === currentLocale;
        return (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={`px-2 py-1 rounded-md transition-all duration-150 cursor-pointer ${
              isActive
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title={localeNames[loc]}
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";

const col = "space-y-2.5 text-small";
const item = "text-ink-2 hover:text-ink transition-colors duration-180";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-24 bg-paper-2 border-t border-line-strong text-ink">
      <div className="container-x pt-14">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5 space-y-4">
            <span className="wordmark text-[28px]">zento</span>
            <p className="text-small text-ink-2 max-w-xs">{dict.common.tagline}</p>
            <p className="label">Chișinău, MD · est. 2026</p>
          </div>

          {/* Catalog */}
          <div className="md:col-span-2">
            <h4 className="label mb-4">{dict.nav.catalog}</h4>
            <ul className={col}>
              <li><Link href={`/${locale}/catalog?category=smartphones`} className={item}>{dict.nav.smartphones}</Link></li>
              <li><Link href={`/${locale}/catalog?category=laptops`} className={item}>{dict.nav.laptops}</Link></li>
              <li><Link href={`/${locale}/catalog?category=tablets`} className={item}>{dict.nav.tablets}</Link></li>
              <li><Link href={`/${locale}/catalog?category=headphones`} className={item}>{dict.nav.headphones}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="label mb-4">{dict.footer.support}</h4>
            <ul className={col}>
              <li><Link href={`/${locale}/privacy`} className={item}>{dict.footer.privacy}</Link></li>
              <li><Link href={`/${locale}/terms`} className={item}>{dict.footer.terms}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="label mb-4">{dict.nav.contacts}</h4>
            <ul className={col}>
              <li className="text-ink-2">Chisinau, Moldova</li>
              <li><a href="mailto:support@zento.tech" className={`data ${item}`}>support@zento.tech</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-5 border-t border-line flex flex-col sm:flex-row justify-between gap-2 label">
          <p>© {new Date().getFullYear()} Zento. {dict.footer.rights}</p>
          <p>RU · EN · RO</p>
        </div>

        {/* Giant wordmark: the footer's signature */}
        <div className="text-[clamp(5rem,17vw,15rem)] mt-6 pb-8 select-none overflow-hidden" aria-hidden="true">
          <span className="wordmark block leading-[0.9] text-ink/90">zento</span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="text-2xl font-black tracking-tighter text-white font-sans lowercase">
              zento<span className="text-blue-500">.</span>
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dict.common.tagline}
            </p>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              {dict.nav.catalog}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/catalog?category=smartphones`} className="hover:text-white transition-colors">
                  {dict.nav.smartphones}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalog?category=laptops`} className="hover:text-white transition-colors">
                  {dict.nav.laptops}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalog?category=tablets`} className="hover:text-white transition-colors">
                  {dict.nav.tablets}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalog?category=headphones`} className="hover:text-white transition-colors">
                  {dict.nav.headphones}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              {dict.footer.support}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">
                  {dict.footer.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              {dict.nav.contacts}
            </h4>
            <p className="text-xs text-slate-400">
              Chisinau, Moldova
            </p>
            <p className="text-xs text-slate-400 mt-1">
              support@zento.tech
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Zento. {dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}

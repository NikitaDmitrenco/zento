import Link from "next/link";
import { defaultLocale } from "../../i18n/config";
import { getDictionary } from "../../i18n/get-dictionary";

/**
 * Locale-segment 404. Params are not reliably available here, so the page is
 * locale-neutral and renders the default-locale dictionary.
 */
export default async function NotFound() {
  const dict = await getDictionary(defaultLocale);

  return (
    <main className="container-x pt-20 pb-8">
      <div className="max-w-2xl">
        <p className="label">404</p>
        <h1 className="text-display text-ink mt-4">{dict.common.notFound}</h1>
        <Link
          href={`/${defaultLocale}`}
          className="group mt-10 inline-flex items-center justify-center gap-2 h-11 px-5 text-sm font-medium rounded-sm whitespace-nowrap bg-transparent text-ink border border-ink hover:bg-ink hover:text-ink-inverse transition-[background-color,color,border-color] duration-180"
        >
          {dict.cart.continueShopping}
          <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Badge } from "../ui/badge";
import { Price } from "../ui/price";
import { CategoryIcon } from "../ui/category-icon";
import { CatalogProductItem } from "../../services/search/search-service";

/**
 * A cell in a shared-hairline grid (see `.rule-grid`): no border of its own, no shadow.
 * The image sits on a sunken plate; text and data are set below it.
 */
export function ProductCard({
  product,
  locale,
  dict,
  index,
}: {
  product: CatalogProductItem;
  locale: Locale;
  dict: Dictionary;
  index?: number;
}) {
  const href = `/${locale}/product/${product.slug}`;

  return (
    <article className="group relative flex flex-col h-full p-4 sm:p-5 bg-white">
      {/* Plate */}
      <Link href={href} className="plate block aspect-[5/4] rounded-sm relative bg-white" tabIndex={-1} aria-hidden="true">
        {product.primaryImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.primaryImage}
            alt=""
            className="w-full h-full object-contain p-2.5 transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-3/60">
            <CategoryIcon slug={product.category.slug} className="w-14 h-14" />
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {product.isFeatured && <Badge variant="signal">Top</Badge>}
        </div>
        {typeof index === "number" && (
          <span className="absolute top-2.5 right-2.5 label text-ink-3">{String(index).padStart(2, "0")}</span>
        )}
      </Link>

      {/* Copy */}
      <div className="pt-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="label">{product.brand.name}</span>
          <span className="label text-ink-3/80">{product.category.name}</span>
        </div>
        <Link href={href} className="mt-2 block">
          <h3 className="text-[15px] leading-snug font-medium text-ink line-clamp-2 decoration-1 underline-offset-4 decoration-line group-hover:underline group-hover:decoration-ink">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3 line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          <Price amount={product.price} currency={dict.common.currency} locale={locale} size="md" />
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-2 hover:text-ink transition-colors"
          >
            {dict.common.viewDetails}
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

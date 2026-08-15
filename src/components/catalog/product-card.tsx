import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CatalogProductItem } from "../../services/search/search-service";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: CatalogProductItem;
  locale: Locale;
  dict: Dictionary;
}) {
  // Format integer cents to currency e.g. 89900 -> 899.00 MDL or 899 MDL
  const formattedPrice = (product.price / 100).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <Card hoverable className="overflow-hidden flex flex-col justify-between h-full group">
      <div>
        {/* Image & Badges Container */}
        <div className="relative aspect-4/3 bg-slate-100/80 overflow-hidden flex items-center justify-center p-4">
          {product.primaryImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.primaryImage}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 transition-transform duration-500 group-hover:scale-105">
              <svg
                className="w-16 h-16 text-slate-300 group-hover:text-blue-500 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <Badge variant="success" className="shadow-xs font-semibold">
                ★ Top
              </Badge>
            )}
            <Badge variant="outline" className="bg-white/90 backdrop-blur-xs text-[10px]">
              {product.category.name}
            </Badge>
          </div>

          <div className="absolute top-3 right-3">
            {product.stock > 0 ? (
              <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full" title={dict.common.inStock}></span>
            ) : (
              <span className="inline-block w-2.5 h-2.5 bg-rose-500 rounded-full" title={dict.common.outOfStock}></span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {product.brand.name}
          </span>
          <Link href={`/${locale}/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer / Price & Button */}
      <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2 pt-3">
        <div>
          <span className="text-lg font-black text-slate-900 tracking-tight">
            {formattedPrice}
          </span>
          <span className="text-xs font-medium text-slate-500 ml-1">
            {dict.common.currency}
          </span>
        </div>

        <Link href={`/${locale}/product/${product.slug}`}>
          <Button size="sm" variant="secondary" className="text-xs font-medium">
            {dict.common.viewDetails}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

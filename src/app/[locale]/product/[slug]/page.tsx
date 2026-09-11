import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { isValidLocale, Locale } from "../../../../i18n/config";
import { getDictionary } from "../../../../i18n/get-dictionary";
import { db } from "../../../../db";
import { products, categories, brands, productImages, productSpecifications } from "../../../../db/schema";
import { demoProducts } from "../../../../db/data/demo-data";
import { Badge } from "../../../../components/ui/badge";
import { Price } from "../../../../components/ui/price";
import { SectionHead } from "../../../../components/ui/section-head";
import { CategoryIcon } from "../../../../components/ui/category-icon";
import { ProductActions } from "../../../../components/product/product-actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const product = await getProductDetails(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
}

async function getProductDetails(slug: string) {
  try {
    const prod = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        category: true,
        brand: true,
      },
    });

    if (prod) {
      const imagesList = await db.query.productImages.findMany({
        where: eq(productImages.productId, prod.id),
      });
      const specsList = await db.query.productSpecifications.findMany({
        where: eq(productSpecifications.productId, prod.id),
      });

      return {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        isFeatured: prod.isFeatured,
        category: prod.category,
        brand: prod.brand,
        images: imagesList.map((img) => img.url),
        specs: specsList,
      };
    }
  } catch {
    // Fallback if DB offline
  }

  // Fallback to demoProducts
  const demo = demoProducts.find((p) => p.slug === slug);
  if (!demo) return null;

  return {
    id: `demo-${demo.slug}`,
    name: demo.name,
    slug: demo.slug,
    description: demo.description,
    price: demo.price,
    stock: demo.stock,
    isFeatured: demo.isFeatured,
    category: { name: demo.categorySlug, slug: demo.categorySlug },
    brand: { name: demo.brandSlug, slug: demo.brandSlug },
    images: demo.images,
    specs: demo.specs,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const product = await getProductDetails(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container-x pt-8 sm:pt-10 pb-8">
      {/* Breadcrumbs */}
      <nav className="label flex items-center gap-2.5 normal-case tracking-normal font-sans text-[13px]" aria-label="Breadcrumb">
        <Link href={`/${locale}`} className="text-ink-3 hover:text-ink transition-colors">Zento</Link>
        <span className="text-line-strong/40" aria-hidden="true">/</span>
        <Link href={`/${locale}/catalog`} className="text-ink-3 hover:text-ink transition-colors">{dict.nav.catalog}</Link>
        <span className="text-line-strong/40" aria-hidden="true">/</span>
        <span className="text-ink truncate">{product.name}</span>
      </nav>

      {/* Object + spec column */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-start">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-3">
          <div className="plate aspect-[4/3] rounded-md relative">
            {product.images && product.images.length > 0 && product.images[0] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-3/50">
                <CategoryIcon slug={product.category.slug} className="w-20 h-20" />
              </div>
            )}
            <span className="absolute bottom-3 left-3 label bg-paper/90 px-1.5 py-1 rounded-xs">
              {product.brand.name} · {product.category.name}
            </span>
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="plate w-20 h-20 rounded-sm shrink-0 border border-line first:border-ink"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="flex items-center gap-3">
            <span className="label">{product.brand.name}</span>
            {product.isFeatured && <Badge variant="signal">Top</Badge>}
          </div>
          <h1 className="text-h2 sm:text-h1 text-ink mt-3">{product.name}</h1>

          <div className="mt-6 pt-5 border-t border-line-strong flex items-end justify-between gap-4">
            <Price amount={product.price} currency={dict.common.currency} locale={locale as Locale} size="xl" />
            <span className={`label ${product.stock > 0 ? "text-ok" : "text-danger"}`}>
              {product.stock > 0 ? `${dict.common.inStock} · ${product.stock}` : dict.common.outOfStock}
            </span>
          </div>

          <p className="mt-5 text-body text-ink-2">{product.description}</p>

          <ProductActions productId={product.id} stock={product.stock} dict={dict} />

          {/* Perks: one ruled list, no tiles */}
          <ul className="mt-8 border-t border-line divide-y divide-line">
            {[dict.product.guarantee, dict.product.freeDelivery, dict.product.securePayment].map((perk, i) => (
              <li key={perk} className="flex items-center gap-4 py-3 text-small text-ink-2">
                <span className="label w-6">{String(i + 1).padStart(2, "0")}</span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Specifications: datasheet */}
      {product.specs && product.specs.length > 0 && (
        <section className="mt-20 space-y-8">
          <SectionHead title={dict.product.specifications} />
          <dl className="border-t border-line-strong divide-y divide-line">
            {product.specs.map((spec, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-x-4 py-3 text-small">
                <dt className="col-span-4 sm:col-span-3 lg:col-span-2 label pt-0.5">{spec.groupName || spec.name}</dt>
                <dd className="col-span-8 sm:col-span-3 lg:col-span-3 text-ink-2">{spec.name}</dd>
                <dd className="col-span-12 sm:col-span-6 lg:col-span-7 data text-ink pl-[calc(33.333%+1rem)] sm:pl-0 mt-1 sm:mt-0">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </main>
  );
}

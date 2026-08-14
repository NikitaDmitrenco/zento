import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { isValidLocale, Locale } from "../../../../i18n/config";
import { getDictionary } from "../../../../i18n/get-dictionary";
import { db } from "../../../../db";
import { products, categories, brands, productImages, productSpecifications } from "../../../../db/schema";
import { demoProducts } from "../../../../db/seed";
import { Badge } from "../../../../components/ui/badge";
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

  const formattedPrice = (product.price / 100).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href={`/${locale}`} className="hover:text-slate-900 transition-colors">
          Zento
        </Link>
        <span>/</span>
        <Link href={`/${locale}/catalog`} className="hover:text-slate-900 transition-colors">
          {dict.nav.catalog}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Gallery */}
        <div className="space-y-4">
          <div className="aspect-4/3 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-8 shadow-xs">
            <div className="w-32 h-32 text-slate-300 flex items-center justify-center">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Product Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {product.brand.name}
              </span>
              {product.isFeatured && <Badge variant="success">★ Top</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              {dict.common.currency}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Interactive Actions (Quantity & Add to Cart) */}
          <ProductActions productId={product.id} stock={product.stock} dict={dict} />

          {/* Guarantee Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200">
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-lg">🛡️</span>
              <p className="text-[11px] font-semibold text-slate-800 mt-1">{dict.product.guarantee}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-lg">🚚</span>
              <p className="text-[11px] font-semibold text-slate-800 mt-1">{dict.product.freeDelivery}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-lg">🔒</span>
              <p className="text-[11px] font-semibold text-slate-800 mt-1">{dict.product.securePayment}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Specifications Section */}
      {product.specs && product.specs.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {dict.product.specifications}
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {product.specs.map((spec, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm">
                <span className="font-semibold text-slate-500">{spec.groupName || spec.name}</span>
                <span className="font-medium text-slate-900 sm:col-span-2">{spec.name}: {spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}

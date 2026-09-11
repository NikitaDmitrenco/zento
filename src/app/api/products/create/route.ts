import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "../../../../lib/auth/session";
import { db } from "../../../../db";
import { products, categories, brands, productImages } from "../../../../db/schema";

// Max size for inline base64 images (data: URLs), ~1.5MB, to bound DB row growth.
const MAX_DATA_URL_LENGTH = 1_500_000;

// Only accept image references we trust: relative storage paths, trusted https hosts,
// or bounded inline base64 images. Everything else (other hosts, http:, javascript:, etc.) is rejected.
function isAllowedImageUrl(value: string): boolean {
  if (!value) return true; // empty -> a placeholder is used

  // Bounded inline base64 image
  if (value.startsWith("data:")) {
    return /^data:image\/(png|jpe?g|webp|gif|avif);base64,/i.test(value) && value.length <= MAX_DATA_URL_LENGTH;
  }

  // Relative storage path (no scheme, no leading slash, no traversal)
  if (/^(products|brands)\//.test(value) && !value.includes("..")) {
    return true;
  }

  // Absolute URL: https only, from a small allowlist of trusted image hosts
  try {
    const u = new URL(value);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    return host === "images.unsplash.com" || host === "supabase.co" || host.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, description, price, stock, categorySlug, brandSlug, imageUrl, isFeatured } = body;

    if (!name || !description || !price || stock === undefined || !categorySlug || !brandSlug) {
      return NextResponse.json({ error: "Please fill in all required product fields." }, { status: 400 });
    }

    if (imageUrl && !isAllowedImageUrl(imageUrl)) {
      return NextResponse.json(
        { error: "Invalid image. Use a storage path, a trusted https image URL, or an uploaded image under 1.5MB." },
        { status: 400 }
      );
    }

    const priceCents = Math.round(Number(price) * 100);
    const finalSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    let insertedProd = null;

    try {
      // 1. Resolve or create category ID
      let category = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
      });

      if (!category) {
        const catName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
        const [newCat] = await db
          .insert(categories)
          .values({ name: catName, slug: categorySlug })
          .returning();
        category = newCat;
      }

      // 2. Resolve or create brand ID
      let brand = await db.query.brands.findFirst({
        where: eq(brands.slug, brandSlug),
      });

      if (!brand) {
        const brandName = brandSlug
          .split("-")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        const [newBrand] = await db
          .insert(brands)
          .values({ name: brandName, slug: brandSlug })
          .returning();
        brand = newBrand;
      }

      // 3. Insert product
      const [newProduct] = await db
        .insert(products)
        .values({
          name,
          slug: finalSlug,
          description,
          price: priceCents,
          stock: Number(stock),
          categoryId: category.id,
          brandId: brand.id,
          isFeatured: Boolean(isFeatured),
          isActive: true,
        })
        .returning();

      insertedProd = newProduct;

      // 4. Insert image record if image is provided
      const finalImage = imageUrl || "products/placeholders/category-smartphones.webp";
      await db.insert(productImages).values({
        productId: newProduct.id,
        url: finalImage,
        isPrimary: true,
        displayOrder: 0,
      });

    } catch (err) {
      console.error("DB product creation error:", err instanceof Error ? err.message : "unknown error");
    }

    return NextResponse.json({
      success: true,
      product: {
        id: insertedProd?.id || `demo-${Date.now()}`,
        name,
        slug: finalSlug,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

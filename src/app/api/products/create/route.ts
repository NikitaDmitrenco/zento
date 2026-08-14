import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSession } from "../../../../lib/auth/session";
import { db } from "../../../../db";
import { products, categories, brands, productImages } from "../../../../db/schema";
import { demoProducts } from "../../../../db/data/demo-data";

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
      console.error("DB product creation error:", err);
    }

    // Always push to demo dataset so offline mode also reflects the new product
    demoProducts.unshift({
      name,
      slug: finalSlug,
      description,
      price: priceCents,
      stock: Number(stock),
      isFeatured: Boolean(isFeatured),
      categorySlug,
      brandSlug,
      images: [imageUrl || "products/placeholders/category-smartphones.webp"],
      specs: [
        { groupName: "General", name: "Brand", value: brandSlug },
        { groupName: "General", name: "Category", value: categorySlug },
      ],
    });

    return NextResponse.json({
      success: true,
      product: {
        id: insertedProd?.id || `demo-${Date.now()}`,
        name,
        slug: finalSlug,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

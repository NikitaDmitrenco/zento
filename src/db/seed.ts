import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  categories,
  brands,
  products,
  productImages,
  productSpecifications,
} from "./schema";
import { demoCategories, demoBrands, demoProducts } from "./data/demo-data";

export { demoCategories, demoBrands, demoProducts };

export async function seedDatabase() {
  console.log("Starting Zento database seed...");

  // 1. Seed Categories
  const categoryMap = new Map<string, string>();
  for (const cat of demoCategories) {
    const [inserted] = await db
      .insert(categories)
      .values(cat)
      .onConflictDoUpdate({
        target: categories.slug,
        set: { name: cat.name, description: cat.description, imageUrl: cat.imageUrl },
      })
      .returning();
    categoryMap.set(inserted.slug, inserted.id);
  }
  console.log(`Seeded ${categoryMap.size} categories.`);

  // 2. Seed Brands
  const brandMap = new Map<string, string>();
  for (const b of demoBrands) {
    const [inserted] = await db
      .insert(brands)
      .values(b)
      .onConflictDoUpdate({
        target: brands.slug,
        set: { name: b.name, logoUrl: b.logoUrl },
      })
      .returning();
    brandMap.set(inserted.slug, inserted.id);
  }
  console.log(`Seeded ${brandMap.size} brands.`);

  // 3. Seed Products + Images + Specs
  let productCount = 0;
  for (const item of demoProducts) {
    const categoryId = categoryMap.get(item.categorySlug);
    const brandId = brandMap.get(item.brandSlug);

    if (!categoryId || !brandId) {
      console.warn(`Skipping product ${item.name} - missing category/brand ID`);
      continue;
    }

    const [prod] = await db
      .insert(products)
      .values({
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        stock: item.stock,
        isFeatured: item.isFeatured,
        isActive: true,
        categoryId,
        brandId,
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          isFeatured: item.isFeatured,
          categoryId,
          brandId,
        },
      })
      .returning();

    // Clear old images & specs for product if updating
    await db.delete(productImages).where(eq(productImages.productId, prod.id));
    await db.delete(productSpecifications).where(eq(productSpecifications.productId, prod.id));

    // Insert Product Images
    let order = 0;
    for (const imgUrl of item.images) {
      await db.insert(productImages).values({
        productId: prod.id,
        url: imgUrl,
        isPrimary: order === 0,
        displayOrder: order++,
      });
    }

    // Insert Product Specifications
    for (const spec of item.specs) {
      await db.insert(productSpecifications).values({
        productId: prod.id,
        groupName: spec.groupName,
        name: spec.name,
        value: spec.value,
      });
    }

    productCount++;
  }

  console.log(`Seeded ${productCount} products with images and specifications.`);
  console.log("Database seed completed successfully!");
}

// Allow running directly via tsx
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error seeding database:", err);
      process.exit(1);
    });
}

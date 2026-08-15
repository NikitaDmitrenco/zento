import { eq, and, gte, lte, ilike, or, inArray, asc, desc, count } from "drizzle-orm";
import { db } from "../../db";
import {
  products,
  categories,
  brands,
  productImages,
} from "../../db/schema";
import { demoProducts, demoCategories, demoBrands } from "../../db/data/demo-data";

export interface CatalogQueryFilters {
  query?: string;
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number; // in cents/minor units
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "featured" | "newest";
  page?: number;
  limit?: number;
}

export interface CatalogProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  primaryImage: string;
}

export interface CatalogResult {
  items: CatalogProductItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function searchCatalog(
  filters: CatalogQueryFilters = {}
): Promise<CatalogResult> {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, Math.min(50, filters.limit || 12));
  const offset = (page - 1) * limit;

  try {
    // Build conditions array
    const conditions = [eq(products.isActive, true)];

    if (filters.query && filters.query.trim()) {
      const q = `%${filters.query.trim()}%`;
      const matchingBrands = await db.query.brands.findMany({
        where: or(ilike(brands.name, q), ilike(brands.slug, q)),
      });
      const matchingBrandIds = matchingBrands.map((b) => b.id);

      if (matchingBrandIds.length > 0) {
        conditions.push(
          or(
            ilike(products.name, q),
            ilike(products.description, q),
            inArray(products.brandId, matchingBrandIds)
          )!
        );
      } else {
        conditions.push(
          or(ilike(products.name, q), ilike(products.description, q))!
        );
      }
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      conditions.push(gte(products.price, filters.minPrice));
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      conditions.push(lte(products.price, filters.maxPrice));
    }

    if (filters.inStockOnly) {
      conditions.push(gte(products.stock, 1));
    }

    if (filters.categorySlug) {
      const cat = await db.query.categories.findFirst({
        where: eq(categories.slug, filters.categorySlug),
      });
      if (cat) {
        conditions.push(eq(products.categoryId, cat.id));
      }
    }

    if (filters.brandSlug) {
      const br = await db.query.brands.findFirst({
        where: eq(brands.slug, filters.brandSlug),
      });
      if (br) {
        conditions.push(eq(products.brandId, br.id));
      }
    }

    const whereClause = and(...conditions);

    // Sorting
    let orderBy;
    switch (filters.sortBy) {
      case "price_asc":
        orderBy = [asc(products.price)];
        break;
      case "price_desc":
        orderBy = [desc(products.price)];
        break;
      case "name_asc":
        orderBy = [asc(products.name)];
        break;
      case "featured":
        orderBy = [desc(products.isFeatured), desc(products.createdAt)];
        break;
      case "newest":
      default:
        orderBy = [desc(products.createdAt)];
        break;
    }

    // Fetch count
    const [totalRes] = await db
      .select({ count: count() })
      .from(products)
      .where(whereClause);

    const total = totalRes?.count || 0;

    // Fetch paginated products with category, brand, primary image
    const productRows = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        stock: products.stock,
        isFeatured: products.isFeatured,
        isActive: products.isActive,
        categoryName: categories.name,
        categorySlug: categories.slug,
        categoryId: categories.id,
        brandName: brands.name,
        brandSlug: brands.slug,
        brandId: brands.id,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .where(whereClause)
      .orderBy(...orderBy)
      .limit(limit)
      .offset(offset);

    // Map primary images
    const items: CatalogProductItem[] = await Promise.all(
      productRows.map(async (row) => {
        const primaryImg = await db.query.productImages.findFirst({
          where: eq(productImages.productId, row.id),
          orderBy: [desc(productImages.isPrimary), asc(productImages.displayOrder)],
        });

        return {
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          price: row.price,
          stock: row.stock,
          isFeatured: row.isFeatured,
          isActive: row.isActive,
          category: {
            id: row.categoryId,
            name: row.categoryName,
            slug: row.categorySlug,
          },
          brand: {
            id: row.brandId,
            name: row.brandName,
            slug: row.brandSlug,
          },
          primaryImage: primaryImg?.url || "products/placeholders/product.webp",
        };
      })
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  } catch (err) {
    // In-memory fallback if PostgreSQL connection is not active
    return searchCatalogInMemory(filters, page, limit, offset);
  }
}

function searchCatalogInMemory(
  filters: CatalogQueryFilters,
  page: number,
  limit: number,
  offset: number
): CatalogResult {
  let filtered = demoProducts.map((p, index) => {
    const cat = demoCategories.find((c) => c.slug === p.categorySlug) || {
      name: p.categorySlug,
      slug: p.categorySlug,
    };
    const br = demoBrands.find((b) => b.slug === p.brandSlug) || {
      name: p.brandSlug,
      slug: p.brandSlug,
    };

    return {
      id: `demo-${index + 1}`,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      stock: p.stock,
      isFeatured: p.isFeatured,
      isActive: true,
      category: { id: `cat-${cat.slug}`, name: cat.name, slug: cat.slug },
      brand: { id: `br-${br.slug}`, name: br.name, slug: br.slug },
      primaryImage: p.images[0] || "products/placeholders/product.webp",
    };
  });

  if (filters.query && filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.brand.slug.toLowerCase().includes(q)
    );
  }

  if (filters.categorySlug) {
    filtered = filtered.filter((p) => p.category.slug === filters.categorySlug);
  }

  if (filters.brandSlug) {
    filtered = filtered.filter((p) => p.brand.slug === filters.brandSlug);
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.inStockOnly) {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  // Sort
  switch (filters.sortBy) {
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name_asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
    default:
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
  }

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

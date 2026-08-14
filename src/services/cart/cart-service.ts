import { inArray, eq } from "drizzle-orm";
import { db } from "../../db";
import { products, productImages } from "../../db/schema";
import { demoProducts } from "../../db/data/demo-data";

export interface RawCartItem {
  id: string; // product id or slug
  quantity: number;
}

export interface EvaluatedCartItem {
  id: string;
  name: string;
  slug: string;
  price: number; // in cents/minor units
  stock: number;
  quantity: number;
  totalPrice: number;
  primaryImage: string;
  isAvailable: boolean;
}

export interface EvaluatedCart {
  items: EvaluatedCartItem[];
  subtotal: number;
  totalItems: number;
  hasStockIssues: boolean;
}

export async function evaluateCart(rawItems: RawCartItem[]): Promise<EvaluatedCart> {
  if (!rawItems || rawItems.length === 0) {
    return { items: [], subtotal: 0, totalItems: 0, hasStockIssues: false };
  }

  const itemsMap = new Map<string, number>();
  rawItems.forEach((item) => {
    if (item.id && item.quantity > 0) {
      itemsMap.set(item.id, (itemsMap.get(item.id) || 0) + item.quantity);
    }
  });

  const idsOrSlugs = Array.from(itemsMap.keys());
  let evaluatedItems: EvaluatedCartItem[] = [];

  try {
    const dbProds = await db.query.products.findMany({
      where: inArray(products.id, idsOrSlugs),
    });

    if (dbProds.length > 0) {
      evaluatedItems = await Promise.all(
        dbProds.map(async (prod) => {
          const requestedQty = itemsMap.get(prod.id) || itemsMap.get(prod.slug) || 1;
          const validQuantity = Math.min(prod.stock, requestedQty);

          const primaryImg = await db.query.productImages.findFirst({
            where: eq(productImages.productId, prod.id),
          });

          return {
            id: prod.id,
            name: prod.name,
            slug: prod.slug,
            price: prod.price,
            stock: prod.stock,
            quantity: validQuantity,
            totalPrice: prod.price * validQuantity,
            primaryImage: primaryImg?.url || "products/placeholders/product.webp",
            isAvailable: prod.stock > 0 && prod.isActive,
          };
        })
      );
    }
  } catch {
    // Database offline
  }

  // Fallback to demoProducts matching if db items not loaded
  if (evaluatedItems.length === 0) {
    evaluatedItems = idsOrSlugs
      .map((key) => {
        const demo = demoProducts.find((p) => p.slug === key || key.includes(p.slug));
        if (!demo) return null;

        const requestedQty = itemsMap.get(key) || 1;
        const validQuantity = Math.min(demo.stock, requestedQty);

        return {
          id: `demo-${demo.slug}`,
          name: demo.name,
          slug: demo.slug,
          price: demo.price,
          stock: demo.stock,
          quantity: validQuantity,
          totalPrice: demo.price * validQuantity,
          primaryImage: demo.images[0] || "products/placeholders/product.webp",
          isAvailable: demo.stock > 0,
        };
      })
      .filter((item): item is EvaluatedCartItem => item !== null);
  }

  const subtotal = evaluatedItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalItems = evaluatedItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasStockIssues = evaluatedItems.some((item) => !item.isAvailable || item.stock < item.quantity);

  return {
    items: evaluatedItems,
    subtotal,
    totalItems,
    hasStockIssues,
  };
}

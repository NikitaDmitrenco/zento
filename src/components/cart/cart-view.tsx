"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { EmptyState } from "../ui/empty-state";
import { Price, formatPrice } from "../ui/price";
import { demoProducts } from "../../db/data/demo-data";

interface StoredCartItem {
  id: string;
  quantity: number;
}

interface CartItemDisplay {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  image: string;
}

const stepper =
  "w-9 h-full inline-flex items-center justify-center text-ink-2 hover:text-ink hover:bg-paper-2 " +
  "disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-180 cursor-pointer text-base leading-none";

export function CartView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [items, setItems] = useState<CartItemDisplay[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("zento_cart");
      if (stored) {
        const raw: StoredCartItem[] = JSON.parse(stored);

        // Map stored items to product details
        const mapped: CartItemDisplay[] = raw
          .map((item) => {
            const demo = demoProducts.find((p) => p.slug === item.id || item.id.includes(p.slug));
            if (!demo) return null;

            const validQty = Math.min(demo.stock, item.quantity);
            return {
              id: item.id,
              slug: demo.slug,
              name: demo.name,
              price: demo.price,
              stock: demo.stock,
              quantity: validQty,
              image: demo.images[0] || "products/placeholders/product.webp",
            };
          })
          .filter((i): i is CartItemDisplay => i !== null);

        setItems(mapped);
      }
    } catch {
      // Empty
    } finally {
      setLoaded(true);
    }
  }, []);

  const saveCart = (newItems: CartItemDisplay[]) => {
    setItems(newItems);
    try {
      const toStore: StoredCartItem[] = newItems.map((i) => ({ id: i.id, quantity: i.quantity }));
      localStorage.setItem("zento_cart", JSON.stringify(toStore));
    } catch {
      //
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveItem = (id: string) => {
    const filtered = items.filter((item) => item.id !== id);
    saveCart(filtered);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!loaded) {
    return (
      <div className="py-16 border-t border-line">
        <p className="label">{dict.common.loading}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        index="00"
        title={dict.cart.empty}
        text={dict.home.heroSubtitle}
        action={
          <Link href={`/${locale}/catalog`}>
            <Button variant="outline" size="md">
              {dict.cart.continueShopping}
              <span className="arrow" aria-hidden="true">→</span>
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-start">

      {/* Items List: one ruled list, no cards */}
      <ul className="lg:col-span-8 border-t border-line-strong divide-y divide-line">
        {items.map((item, i) => (
          <li key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">

            {/* Product Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link
                href={`/${locale}/product/${item.slug}`}
                className="plate w-[72px] h-[72px] rounded-sm shrink-0 relative"
                tabIndex={-1}
                aria-hidden="true"
              >
                {item.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-3/60">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </Link>
              <div className="min-w-0">
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <Link href={`/${locale}/product/${item.slug}`} className="block mt-1">
                  <h3 className="text-[15px] leading-snug font-medium text-ink decoration-1 underline-offset-4 decoration-line hover:underline hover:decoration-ink">
                    {item.name}
                  </h3>
                </Link>
                <p className="data text-small text-ink-3 mt-1">
                  {formatPrice(item.price, locale)} {dict.common.currency}
                </p>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-6 pl-[88px] sm:pl-0">

              {/* Quantity stepper */}
              <div className="inline-flex items-stretch h-10 border border-line rounded-sm bg-surface divide-x divide-line">
                <button
                  onClick={() => handleUpdateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                  className={stepper}
                  aria-label="−"
                >
                  −
                </button>
                <span className="data w-11 inline-flex items-center justify-center text-[13px] font-medium text-ink" aria-live="polite">
                  {String(item.quantity).padStart(2, "0")}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, 1)}
                  disabled={item.quantity >= item.stock}
                  className={stepper}
                  aria-label="+"
                >
                  +
                </button>
              </div>

              {/* Line total */}
              <Price
                amount={item.price * item.quantity}
                currency={dict.common.currency}
                locale={locale}
                size="sm"
                className="sm:min-w-28 sm:justify-end"
              />

              {/* Remove */}
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="inline-flex items-center justify-center w-8 h-8 -mr-2 rounded-sm text-ink-3 hover:text-danger hover:bg-paper-2 transition-colors duration-180 cursor-pointer"
                title={dict.cart.remove}
                aria-label={dict.cart.remove}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

          </li>
        ))}
      </ul>

      {/* Cart Summary */}
      <Card tone="surface" className="lg:col-span-4 lg:sticky lg:top-24 p-6">
        <h3 className="label text-ink-2">{dict.cart.subtotal}</h3>

        <dl className="mt-4 border-t border-line-strong divide-y divide-line">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-small text-ink-2">{dict.cart.subtotal}</dt>
            <dd>
              <Price amount={subtotal} currency={dict.common.currency} locale={locale} size="sm" />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-small text-ink-2">{dict.product.freeDelivery}</dt>
            <dd className="data text-small text-ok">0 {dict.common.currency}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 pt-4 pb-1">
            <dt className="text-[15px] font-medium text-ink">{dict.cart.total}</dt>
            <dd>
              <Price amount={subtotal} currency={dict.common.currency} locale={locale} size="lg" />
            </dd>
          </div>
        </dl>

        <Link href={`/${locale}/checkout`} className="block mt-6">
          <Button size="lg" className="w-full">
            {dict.cart.checkout}
            <span className="arrow" aria-hidden="true">→</span>
          </Button>
        </Link>
      </Card>

    </div>
  );
}

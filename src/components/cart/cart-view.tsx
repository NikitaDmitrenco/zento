"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
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
  const formattedSubtotal = (subtotal / 100).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (!loaded) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-sm font-medium">{dict.common.loading}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4 my-8">
        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-2xl">
          🛒
        </div>
        <h2 className="text-xl font-bold text-slate-900">{dict.cart.empty}</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {dict.home.heroSubtitle}
        </p>
        <Link href={`/${locale}/catalog`}>
          <Button size="md" className="bg-slate-900 text-white">
            {dict.cart.continueShopping} →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* Items List */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => {
          const itemTotal = ((item.price * item.quantity) / 100).toLocaleString(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });

          return (
            <Card key={item.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Product Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <Link href={`/${locale}/product/${item.slug}`}>
                    <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(item.price / 100).toLocaleString(locale)} {dict.common.currency}
                  </p>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                
                {/* Quantity Buttons */}
                <div className="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded disabled:opacity-30 cursor-pointer text-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded disabled:opacity-30 cursor-pointer text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">
                    {itemTotal} {dict.common.currency}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors text-xs font-bold p-1 cursor-pointer"
                  title={dict.cart.remove}
                >
                  ✕
                </button>
              </div>

            </Card>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
          {dict.cart.subtotal}
        </h3>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>{dict.cart.subtotal}</span>
            <span className="font-semibold text-slate-900">{formattedSubtotal} {dict.common.currency}</span>
          </div>
          <div className="flex justify-between">
            <span>{dict.product.freeDelivery}</span>
            <Badge variant="success">0 {dict.common.currency}</Badge>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
          <span className="text-sm font-bold text-slate-900">{dict.cart.total}</span>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formattedSubtotal} <span className="text-xs font-medium text-slate-500">{dict.common.currency}</span>
          </span>
        </div>

        <Link href={`/${locale}/checkout`}>
          <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 text-sm mt-2">
            {dict.cart.checkout} →
          </Button>
        </Link>
      </div>

    </div>
  );
}
